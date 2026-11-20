"use client";

import React from "react";
import { Cpu, ShieldCheck, Compass, Zap } from "lucide-react";
import { brandConfig } from "@/config/brand";

export default function BrandStory() {
  return (
    <section className="py-24 bg-[#08090a] border-t border-[#141518] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
            Design Manifesto
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Matte Obsidian. Relentless Power.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed font-light">
            At {brandConfig.name}, we build personal electronics that eliminate visual clutter. Finished in satin matte obsidian with tactile grip contours and precision digital metering, our devices deliver uncompromising energy without compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23]">
            <Cpu className="w-6 h-6 text-emerald-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Thermal Efficiency</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Proprietary internal alloy shielding dissipates high-wattage heat, protecting lithium-polymer cells across thousands of cycles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23]">
            <Zap className="w-6 h-6 text-emerald-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Protocol Handshakes</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Dynamic voltage regulation identifies the optimal wattage curve for iPhones, Android devices, tablets, and audio accessories.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23]">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">10-Stage Surge Guard</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Integrated circuit arresters protect against short-circuit spikes, sudden dropouts, and electrical anomalies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23]">
            <Compass className="w-6 h-6 text-emerald-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Laboratory Certified</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Certified for commercial aviation carry-on with true rated energy output verified on digital analyzers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
