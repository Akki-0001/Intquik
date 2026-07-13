"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ShieldCheck, Sparkles, Loader2, CheckCircle2, ArrowLeft, User, Zap, Wallet } from "lucide-react";
import { getDB, saveUser } from "@/lib/db";

const PLANS: Record<string, { price: string; rawPrice: number; name: string; stores: string; features: string[] }> = {
  Starter: {
    name: "Starter", price: "₹699", rawPrice: 699, stores: "1 Active Location",
    features: ["Basic NFC Cards", "Review Monitoring", "Standard Support"]
  },
  Professional: {
    name: "Growth", price: "₹1,599", rawPrice: 1599, stores: "5 Active Locations",
    features: ["Custom NFC Cards", "Auto-reply Suite", "Priority Support", "Analytics Dashboard"]
  },
  Enterprise: {
    name: "Enterprise", price: "₹3,499", rawPrice: 3499, stores: "Unlimited Locations",
    features: ["White-label Solution", "API Access", "Dedicated Manager", "Custom Integrations"]
  },
  Growth: {
    name: "Growth", price: "₹1,599", rawPrice: 1599, stores: "5 Active Locations",
    features: ["Custom NFC Cards", "Auto-reply Suite", "Priority Support", "Analytics Dashboard"]
  },
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPlanParam = searchParams.get("plan") || "Growth";

  // Map "Growth" query parameter to Professional just in case backend expects it
  const planParam = rawPlanParam === "Growth" ? "Professional" : rawPlanParam;
  const currentPlan = PLANS[planParam] || PLANS["Growth"];

  const [user, setUser] = useState<any>(null);
  const [billingName, setBillingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const autoOpened = useRef(false);

  useEffect(() => {
    const db = getDB();
    if (!db.user) {
      router.push("/login");
    } else {
      setUser(db.user);
      setBillingName(db.user.name || "");
    }
  }, [router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => {
      const el = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, []);

  const initiatePayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Use fallback name if not available
    const nameToUse = billingName || user?.name || "Customer";

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ plan: planParam }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const data = await res.json();

      // 2. Handle Mock/Staging Bypass Flow directly
      if (data.isMock) {
        const verifyRes = await fetch("http://localhost:5000/api/payment/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            razorpay_order_id: data.orderId,
            razorpay_payment_id: "pay_mock_" + Math.floor(100000 + Math.random() * 900000),
            razorpay_signature: "mock_signature",
            plan: planParam,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          const updatedUser = {
            ...user,
            subscription: verifyData.subscription,
          };
          saveUser(updatedUser);
          setSuccess(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 2500);
        } else {
          alert(verifyData.message || "Mock payment verification failed.");
        }
        return;
      }

      // 3. Open Real Razorpay Checkout modal
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Intuik",
        description: `${planParam} Plan Subscription`,
        order_id: data.orderId,
        handler: async function (response: any) {
          setLoading(true);
          try {
            const verifyRes = await fetch("http://localhost:5000/api/payment/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planParam,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              const updatedUser = {
                ...user,
                subscription: verifyData.subscription,
              };
              saveUser(updatedUser);
              setSuccess(true);
              setTimeout(() => {
                router.push("/dashboard");
              }, 2500);
            } else {
              alert(verifyData.message || "Payment verification failed.");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            alert("Error verifying payment: " + err.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: nameToUse,
          email: user?.email || "",
        },
        theme: {
          color: "#283570",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed. Reason: " + response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      alert("Error starting payment processing: " + err.message);
      setLoading(false);
    }
  };

  // Auto-initiate payment when loaded
  useEffect(() => {
    if (user && scriptLoaded && !autoOpened.current && !success) {
      autoOpened.current = true;
      initiatePayment();
    }
  }, [user, scriptLoaded, success]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#2E9E9C]" />
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] text-[#2B2B2B] min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white border border-[#E2DDD1] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* Left Side: Order Summary & Features */}
        <div className="bg-gradient-to-br from-[#283570] to-[#1A234A] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#2E9E9C] opacity-10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#2E9E9C] opacity-10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="mb-8">
              <h2 className="text-sm font-bold text-[#2E9E9C] uppercase tracking-widest mb-2">Order Summary</h2>
              <div className="flex items-end gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">{currentPlan.price}</h1>
                <span className="text-white/70 mb-1">/ month</span>
              </div>
              <p className="text-lg text-white/90 font-medium">Intuik {currentPlan.name} Plan</p>
              <p className="text-sm text-white/60 mt-1">{currentPlan.stores}</p>
            </div>

            <div className="space-y-4 mb-10">
              {currentPlan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#2E9E9C]/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9E9C]" />
                  </div>
                  <span className="text-sm text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-xl flex gap-4 items-start mt-8">
            <Sparkles className="w-6 h-6 text-[#2E9E9C] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Premium Features Included</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Instant access to Smart NFC generator tools, reviews dashboard, response workflows, and the GMB auto-reply suite.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Checkout Action */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          {success ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
              <div className="w-20 h-20 bg-[#2E9E9C]/10 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-[#2E9E9C]" />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#283570] mb-3">Payment Successful!</h2>
                <p className="text-sm text-[#6B6B6B] max-w-sm mx-auto leading-relaxed">
                  Thank you for upgrading to the <strong className="text-[#283570]">{currentPlan.name}</strong> plan. We're setting up your workspace and redirecting you to your dashboard.
                </p>
              </div>
              <Loader2 className="w-6 h-6 animate-spin text-[#283570]" />
            </div>
          ) : (
            <div className="max-w-md w-full mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-[#283570] tracking-tight mb-2">Complete Checkout</h2>
                <p className="text-sm text-[#6B6B6B]">Review your details and proceed to secure payment.</p>
              </div>

              <form onSubmit={initiatePayment} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-bold text-[#283570] block mb-1.5">Billing Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-lg pl-11 pr-4 py-3 text-sm text-[#2B2B2B] focus:ring-2 focus:ring-[#2E9E9C] focus:border-[#2E9E9C] outline-none transition-all shadow-sm font-medium"
                        placeholder="Enter your full name"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#283570] block mb-1.5">Account Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full bg-[#F8F9FA] border border-[#E2DDD1] rounded-lg px-4 py-3 text-sm text-[#6B6B6B] outline-none cursor-not-allowed font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-[#6B6B6B] mt-1.5">Your receipt will be sent to this email address.</p>
                  </div>
                </div>

                <div className="bg-[#F8F9FA] border border-[#E2DDD1] p-4 rounded-lg flex items-start gap-3 mt-8">
                  <Wallet className="w-5 h-5 text-[#283570] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#283570] mb-1">Pay Securely via Razorpay</h4>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed">
                      You will be redirected to Razorpay's secure checkout. You can pay using <strong>UPI (GPay, PhonePe)</strong>, Credit/Debit Cards, Netbanking, or Wallets.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#283570] text-[#2E9E9C] hover:bg-[#1A234A] border border-transparent font-serif font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm mt-6 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-[#2E9E9C] group-hover:scale-110 transition-transform" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-6 pt-6">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B6B6B]">
                    <Lock className="w-3.5 h-3.5 text-[#2E9E9C]" />
                    <span>256-BIT SSL ENCRYPTION</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B6B6B]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#283570]" />
                    <span>PCI-DSS SECURE</span>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#2E9E9C]" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

