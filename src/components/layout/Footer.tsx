"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Headphones, Check } from "lucide-react";
import { brandConfig } from "@/config/brand";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#050607] border-t border-[#141518] text-neutral-400">
      {/* Brand Value Pillars */}
      <div className="border-b border-[#101114]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0c0d10]/60 border border-[#16171d]">
              <div className="p-3 rounded-xl bg-[#121318] text-emerald-400 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Express Nationwide Dispatch</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed font-light">
                  Direct dispatch from our Lagos hub to all 36 Nigerian states within 24-48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0c0d10]/60 border border-[#16171d]">
              <div className="p-3 rounded-xl bg-[#121318] text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">12-Month Official Warranty</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed font-light">
                  Comprehensive coverage backed by certified diagnostics and hardware replacement.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0c0d10]/60 border border-[#16171d]">
              <div className="p-3 rounded-xl bg-[#121318] text-emerald-400 flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Engineer Support Desk</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed font-light">
                  Direct support via verified WhatsApp, phone, and concierge email assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-lg font-black tracking-[0.2em] text-white uppercase">
                {brandConfig.wordmark}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
            </Link>

            <p className="text-xs leading-relaxed text-neutral-500 max-w-sm font-light">
              High-density energy storage, tactile carbon materials, and industrial precision designed for the forward-moving creator.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Hardware Releases
              </h5>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address for release broadcasts"
                  required
                  className="flex-1 bg-[#0e0f13] border border-[#1c1d24] text-xs text-neutral-200 px-3.5 py-2.5 rounded-l-xl focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to release broadcasts"
                  className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-r-xl text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-600" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-1.5 font-mono">Subscribed to hardware broadcasts.</p>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Catalogue
            </h5>
            <ul className="space-y-2 text-xs">
              {brandConfig.navigation.footer.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Care & Help
            </h5>
            <ul className="space-y-2 text-xs">
              {brandConfig.navigation.footer.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Legal
            </h5>
            <ul className="space-y-2 text-xs">
              {brandConfig.navigation.footer.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-[#141519] text-xs text-neutral-500 space-y-1 font-mono">
              <div>{brandConfig.contact.address}</div>
              <div>{brandConfig.contact.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#0f1013] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 {brandConfig.name} Technology Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Market: Nigeria (NGN)</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#00e676]" />
              Industrial Matte Concept
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
