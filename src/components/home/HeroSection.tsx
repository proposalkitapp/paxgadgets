"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, BatteryCharging } from "lucide-react";
import { brandConfig } from "@/config/brand";
import PowerBank3DViewer from "@/components/hero/PowerBank3DViewer";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-radial-gradient">
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-950/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-950/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Story & Hero Copy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14161c] border border-[#232630] text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>INITIAL RELEASE • POWER BANK AVAILABLE</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Power your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">world.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {brandConfig.hero.subheadline} Precision-crafted in matte charcoal alloy with intelligent dual fast-charging.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2 pb-2 max-w-md mx-auto lg:mx-0 text-left">
              <div className="p-3 rounded-lg bg-[#101115] border border-[#1f2028]">
                <BatteryCharging className="w-4 h-4 text-cyan-400 mb-1" />
                <div className="text-xs font-semibold text-neutral-200">High-Density</div>
                <div className="text-[10px] text-neutral-500 font-mono">Li-Polymer</div>
              </div>
              <div className="p-3 rounded-lg bg-[#101115] border border-[#1f2028]">
                <Zap className="w-4 h-4 text-cyan-400 mb-1" />
                <div className="text-xs font-semibold text-neutral-200">Dual Fast</div>
                <div className="text-[10px] text-neutral-500 font-mono">Bi-Directional</div>
              </div>
              <div className="p-3 rounded-lg bg-[#101115] border border-[#1f2028]">
                <Shield className="w-4 h-4 text-cyan-400 mb-1" />
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
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#131418] hover:bg-[#1a1b22] border border-[#23252d] text-neutral-300 font-medium text-xs tracking-wider uppercase flex items-center justify-center transition-colors"
              >
                {brandConfig.hero.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Right Column: Signature 3D Interactive Viewer */}
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
