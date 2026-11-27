"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShieldCheck, Truck, Headphones, Check } from "lucide-react";
import { brandConfig } from "@/config/brand";

export default function Footer() {
  const pathname = usePathname();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/distributordelivering")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-white border-t border-neutral-200/90 text-neutral-600">
      {/* Brand Value Pillars */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">Express Nationwide Dispatch</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Direct dispatch from our Lagos facility to all 36 Nigerian states within 24–48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">12-Month Official Warranty</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Comprehensive coverage backed by certified diagnostics and device replacement in Lagos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex-shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">Engineer Support Desk</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
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
              <span className="text-lg font-black tracking-[0.25em] text-neutral-950 uppercase">
                {brandConfig.wordmark}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            </Link>

            <p className="text-xs leading-relaxed text-neutral-500 max-w-sm font-normal">
              High-density energy storage, tactile composite materials, and industrial precision designed for the forward-moving creator.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-2 font-mono">
                Hardware Updates
              </h5>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address for release broadcasts"
                  required
                  className="flex-1 bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 px-3.5 py-2.5 rounded-l-xl focus:outline-none focus:border-neutral-950"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to release broadcasts"
                  className="px-4 py-2.5 bg-neutral-950 text-white hover:bg-neutral-800 rounded-r-xl text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-400" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-neutral-900 mt-1.5 font-mono">Subscribed to hardware broadcasts.</p>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3 font-mono">
              Hardware
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  All Configurations
                </Link>
              </li>
              <li>
                <Link href="/shop?category=portable-power" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  Portable Power Banks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=creator-bundles" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  Creator Dual Packs
                </Link>
              </li>
              <li>
                <Link href="/shop?category=travel-field" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  Field Editions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3 font-mono">
              Support
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/contact#faqs" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  FAQs & Servicing
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  12-Month Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3 font-mono">
              PAX Lab
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  About PAX
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  Design Manifesto
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>
            © {new Date().getFullYear()} {brandConfig.name}. Designed & Assembled for Nigerian Creators.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-500">{brandConfig.contact.phone}</span>
            <span>•</span>
            <span className="text-neutral-500">{brandConfig.contact.address}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
