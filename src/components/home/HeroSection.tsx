"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, BatteryCharging } from "lucide-react";
import { brandConfig } from "@/config/brand";
import PowerBank3DViewer from "@/components/hero/PowerBank3DViewer";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden studio-radial-bg">
      {/* Studio Lighting Accents (mimicking the soft overhead spotlight of the inspiration image) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-b from-neutral-800/10 via-neutral-900/5 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-16 right-1/4 w-[350px] h-[350px] bg-emerald-950/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Story & Hero Copy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Signature Status Pill with glowing jewel emerald indicator */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111216] border border-[#20222a] text-xs font-mono text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#00e676] animate-pulse" />
              <span>ACTIVE RELEASE • POWER BANK</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.06]">
              Power, <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500">distilled.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
              {brandConfig.hero.subheadline}
            </p>

            {/* Industrial Specs Trio */}
            <div className="grid grid-cols-3 gap-3 pt-2 pb-2 max-w-md mx-auto lg:mx-0 text-left">
              <div className="p-3.5 rounded-xl bg-[#0f1013] border border-[#1c1d22]">
                <BatteryCharging className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-semibold text-neutral-200">High-Density</div>
                <div className="text-[10px] text-neutral-500 font-mono">Li-Polymer Core</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0f1013] border border-[#1c1d22]">
                <Zap className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-semibold text-neutral-200">Dual Fast</div>
                <div className="text-[10px] text-neutral-500 font-mono">Bi-Directional</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0f1013] border border-[#1c1d22]">
                <Shield className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-semibold text-neutral-200">Aviation Safe</div>
                <div className="text-[10px] text-neutral-500 font-mono">Multi-Thermal</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href={brandConfig.hero.primaryCtaHref}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xl shadow-white/5"
              >
                {brandConfig.hero.primaryCta}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={brandConfig.hero.secondaryCtaHref}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#121317] hover:bg-[#1a1b22] border border-[#22242c] text-neutral-300 font-medium text-xs tracking-wider uppercase flex items-center justify-center transition-colors"
              >
                {brandConfig.hero.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Right Column: Signature 3D Floating Power Bank */}
          <div className="lg:col-span-6 flex justify-center">
            <PowerBank3DViewer
              fallbackImage="/assets/products/powerbank-hero.png"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
