"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setStatus("error");
      setErrorMessage("No authorization code found in URL.");
      return;
    }

    const businessId = localStorage.getItem("rp_linking_business_id");
    if (!businessId) {
      setStatus("error");
      setErrorMessage("Business ID not found in local storage. Please try connecting again.");
      return;
    }

    const verifyCallback = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/google/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, businessId }),
          credentials: "include",
        });

        if (res.ok) {
          setStatus("success");
          localStorage.removeItem("rp_linking_business_id");
          setTimeout(() => {
            router.push("/dashboard/ai-replies");
          }, 2000);
        } else {
          const data = await res.json();
          setStatus("error");
          setErrorMessage(data.message || "Failed to link Google account.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "Network error occurred while linking account.");
      }
    };

    verifyCallback();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(26,31,92,0.08)] max-w-md w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-blue-950">Linking Account...</h2>
            <p className="text-sm text-gray-500 mt-2">Please wait while we securely connect your Google My Business account.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-blue-950">Successfully Linked!</h2>
            <p className="text-sm text-gray-500 mt-2">Your Google account is now connected. Redirecting you back to the dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-blue-950">Connection Failed</h2>
            <p className="text-sm text-red-500 font-medium mt-2">{errorMessage}</p>
            <button 
              onClick={() => router.push("/dashboard/ai-replies")}
              className="mt-6 bg-slate-100 hover:bg-slate-200 text-blue-950 font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
