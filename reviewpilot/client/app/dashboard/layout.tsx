"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { getDB, MockUser } from "@/lib/db";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<MockUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const db = getDB();
    if (!db.user) {
      router.push("/login");
      return;
    }

    // Set user immediately from local storage to avoid long loading flashes
    setUser(db.user);

    // Intercept Free/unsubscribed users and force plans view, but allow change password
    const allowedFreePaths = ["/dashboard/plans", "/dashboard/change-password"];
    if (db.user.role !== "admin" && db.user.subscription?.plan === "Free" && !allowedFreePaths.includes(pathname)) {
      router.push("/dashboard/plans");
      return;
    }

    // Verify session with the backend to ensure subscription is still active
    const verifySession = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: "include",
        });
        if (res.status === 403 || res.status === 401) {
          // Inactive subscription or invalid session
          localStorage.removeItem("rp_user"); // Clear user
          alert("Access Denied: Your account subscription is inactive or has expired.");
          router.push("/login");
        } else if (res.ok) {
          const data = await res.json();
          setUser(data);
          // Sync database state to local storage
          const localDb = getDB();
          if (localDb.user) {
            localStorage.setItem("rp_user", JSON.stringify({ ...localDb.user, subscription: data.subscription }));
          }
          if (data.role !== "admin" && data.subscription?.plan === "Free" && !allowedFreePaths.includes(pathname)) {
            router.push("/dashboard/plans");
          }
        }
      } catch (err) {
        console.error("Session verification offline, using local storage state", err);
      }
    };

    verifySession();
  }, [router, pathname]);

  if (!mounted || !user) {
    return (
      <div className="bg-slate-50 text-blue-950 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 text-blue-950 min-h-screen md:h-screen flex flex-col md:flex-row selection:bg-blue-200 selection:text-blue-950 relative overflow-hidden md:overflow-hidden">
      {/* Premium Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-blue-300/10 to-indigo-300/15 blur-[120px] pointer-events-none animate-float-slow -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-teal-200/10 to-blue-300/10 blur-[120px] pointer-events-none animate-float-reverse -z-10" />
      <div className="absolute top-[30%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-tr from-purple-200/5 to-blue-200/10 blur-[100px] pointer-events-none -z-10" />

      <Sidebar user={user} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      
      <main className="flex-1 flex flex-col min-w-0 relative z-10 md:h-screen md:overflow-hidden">
        <Navbar setMobileMenuOpen={setMobileMenuOpen} />
        
        <div className="flex-grow p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
