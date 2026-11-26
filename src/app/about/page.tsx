"use client";

import React from "react";
import { Cpu, ShieldCheck, Globe, CheckCircle2 } from "lucide-react";
import { brandConfig } from "@/config/brand";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 bg-[#08090b] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            About {brandConfig.name}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-2 leading-tight">
            Engineering Consumer Technology for the Forward-Moving.
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed font-light">
            {brandConfig.name} is a direct-to-consumer technology manufacturing brand founded to create personal electronics that balance aesthetic precision, thermal endurance, and extreme daily reliability.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-[#0e0f14] border border-[#1f2128]">
            <Cpu className="w-8 h-8 text-emerald-400 mb-5" />
            <h3 className="text-lg font-bold text-white mb-2">Own-Brand Engineering</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              We design and manufacture our own hardware rather than relabeling generic white-label stock. From board schematics to alloy extrusion, every contour is intentional.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0e0f14] border border-[#1f2128]">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-5" />
            <h3 className="text-lg font-bold text-white mb-2">Reliability Under Load</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Built to withstand real-world electrical instability, thermal shifts, and heavy travel demands with internal protection circuitry.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0e0f14] border border-[#1f2128]">
            <Globe className="w-8 h-8 text-emerald-400 mb-5" />
            <h3 className="text-lg font-bold text-white mb-2">Initial Focus: Nigeria</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Launched initially in Nigeria with direct local inventory, genuine 12-month warranties, and express door-to-door logistics, setting the foundation for global expansion.
            </p>
          </div>
        </div>

        {/* Brand Promise Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0c0d11] border border-[#1c1d24] relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              Quality Assurance Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              No Fabricated Specs. Pure Verifiable Power.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
              Our battery cells, acoustic transducers, and charging controllers are tested in certified laboratories. We guarantee true rated capacity and real-world fast-charging output on every device we ship.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 text-xs font-mono text-neutral-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Genuine Cell Certification
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Authorized Warranty Centers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
