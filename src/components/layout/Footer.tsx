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
    <footer className="bg-[#060708] border-t border-[#181920] text-neutral-400">
      {/* Brand Value Pillars */}
      <div className="border-b border-[#14151a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0c0d10]/60 border border-[#1a1b22]">
              <div className="p-3 rounded-lg bg-[#14161c] text-cyan-400 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Nationwide Express Delivery</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Fast 24-48hr fulfillment from our primary Lagos logistics hub to all 36 Nigerian states.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0c0d10]/60 border border-[#1a1b22]">
              <div className="p-3 rounded-lg bg-[#14161c] text-cyan-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">12-Month Official Warranty</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Direct manufacturer backing with authorized diagnostic and replacement support.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0c0d10]/60 border border-[#1a1b22]">
              <div className="p-3 rounded-lg bg-[#14161c] text-cyan-400 flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Direct Customer Care</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Dedicated local technical assistance via verified WhatsApp, phone, and email.
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
              <span className="text-xl font-black tracking-widest text-white uppercase">
                {brandConfig.wordmark}
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </Link>

            <p className="text-xs leading-relaxed text-neutral-500 max-w-sm">
              An engineering-first consumer electronics manufacturer crafting high-density power solutions,
              precision acoustics, and modern portable technology for forward-moving creators.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Release Broadcasts
              </h5>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-[#101115] border border-[#20222a] text-xs text-neutral-200 px-3.5 py-2.5 rounded-l-lg focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-r-lg text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-600" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-1.5">Thank you for subscribing to updates.</p>
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
                  <Link href={link.href} className="hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Support & Care
            </h5>
            <ul className="space-y-2 text-xs">
              {brandConfig.navigation.footer.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Legal & Terms
            </h5>
            <ul className="space-y-2 text-xs">
              {brandConfig.navigation.footer.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-[#181920] text-xs text-neutral-500 space-y-1">
              <div>{brandConfig.contact.address}</div>
              <div>{brandConfig.contact.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#121318] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 {brandConfig.name} Technology Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Market: Nigeria (NGN)</span>
            <span>•</span>
            <span>Built on Antigravity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
