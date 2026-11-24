"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Lock, ArrowRight, KeyRound, CheckCircle, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { brandConfig } from "@/config/brand";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUnauthorizedAttempt = searchParams.get("unauthorized") === "1";
  const isExpired = searchParams.get("expired") === "1";
  const fromPath = searchParams.get("from") || "/admin";

  const [authMode, setAuthMode] = useState<"password" | "pin">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    isUnauthorizedAttempt
      ? "Restricted Gateway: You must authenticate with authorized admin credentials to enter the administrative portal."
      : isExpired
      ? "Session Expired: Your administrative authentication has lapsed. Please sign in again."
      : ""
  );

  const handleFillDemo = () => {
    setEmail("admin@paxgadgets.com");
    setPassword("paxadmin2026");
    setPin("2026");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = authMode === "password"
        ? { email, password }
        : { email: email || "admin@paxgadgets.com", pin };

      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to intended path or /admin
        router.push(fromPath.startsWith("/admin") ? fromPath : "/admin");
        router.refresh();
      } else {
        setErrorMessage(data.error || "Administrative authentication failed. Access denied.");
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("System authorization error. Please check server status.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-neutral-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background ambient security glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Back to store navigation */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center text-xs">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
        <span className="font-mono text-neutral-600 text-[11px] uppercase tracking-wider">
          v1.0 PRD Compliance
        </span>
      </div>

      <div className="w-full max-w-md bg-[#0d0e12] border border-[#1e2027] rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        {/* Top security header badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#12141a] to-[#1a1c24] border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_24px_rgba(0,230,118,0.2)]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-black tracking-[0.25em] text-white uppercase">
              {brandConfig.wordmark}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
            <span className="font-mono text-xs text-neutral-400">CONTROL</span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Admin Portal</h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            Restricted access interface for store orders, product catalog, and delivery distributors.
          </p>
        </div>

        {/* Security Warning / Error Notice */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Authentication Mode Toggle */}
        <div className="flex rounded-xl bg-[#12141b] p-1 mb-6 border border-[#1d202b]">
          <button
            type="button"
            onClick={() => setAuthMode("password")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === "password"
                ? "bg-emerald-500 text-black shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("pin")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === "pin"
                ? "bg-emerald-500 text-black shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Master Security PIN
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "password" ? (
            <>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@paxgadgets.com"
                  required
                  className="w-full px-4 py-3 bg-[#13151c] border border-[#222532] rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Master Password
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-3 bg-[#13151c] border border-[#222532] rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                4-Digit Security Master PIN
              </label>
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter Master PIN (e.g. 2026)"
                required
                className="w-full px-4 py-3 bg-[#13151c] border border-[#222532] rounded-xl text-center text-lg tracking-[0.4em] text-emerald-400 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Authorizing Security...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Verify & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Credentials Card */}
        <div className="mt-8 pt-6 border-t border-[#181a22] text-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Store Owner Demo Keys:
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] underline"
            >
              Auto-Fill
            </button>
          </div>
          <div className="bg-[#12141a] rounded-xl p-3 font-mono text-[11px] text-neutral-300 space-y-1 border border-[#1b1e27]">
            <div>Email: <span className="text-emerald-300">admin@paxgadgets.com</span></div>
            <div>Password: <span className="text-emerald-300">paxadmin2026</span></div>
            <div>Master PIN: <span className="text-emerald-300">2026</span></div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono">
          <CheckCircle className="w-3 h-3 text-emerald-500" />
          <span>256-bit Encrypted Session • Role-Based Guard Active</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080a] flex items-center justify-center text-neutral-400 font-mono text-sm">
          Loading Security Gateway...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
