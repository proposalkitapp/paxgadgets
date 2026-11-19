"use client";

import React from "react";
import { Cpu, ShieldCheck, Compass, Zap } from "lucide-react";
import { brandConfig } from "@/config/brand";

export default function BrandStory() {
  return (
    <section className="py-24 bg-[#07080a] border-t border-[#14151a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Brand Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Engineered with Purpose. Built for Durability.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            At {brandConfig.name}, we believe personal electronics should be uncompromising instruments—reliable,
            tactile, and engineered to thrive under relentless daily use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#0d0e12] border border-[#1e2026]">
            <Cpu className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Thermal Efficiency</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Proprietary internal heat sinking maximizes charging velocity while preserving long-term battery cell longevity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d0e12] border border-[#1e2026]">
            <Zap className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Smart Wattage Negotiation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Real-time protocol handshakes ensure smartphones, tablets, and earbuds receive optimal power without degradation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d0e12] border border-[#1e2026]">
            <ShieldCheck className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">10-Point Hardware Safety</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Short-circuit interception, over-current arresters, and temperature cutoff sensors safeguard connected gear.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d0e12] border border-[#1e2026]">
            <Compass className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Rigorous Quality Validation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every production batch undergoes continuous load-testing to exceed international consumer safety standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
