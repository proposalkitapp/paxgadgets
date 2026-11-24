"use client";

import React from "react";
import Image from "next/image";
import { Cpu, ShieldCheck, Compass, Zap, Camera } from "lucide-react";
import { brandConfig } from "@/config/brand";

const studioPhotos = [
  {
    src: "/assets/products/photo_2026-11-19_19-28-10.jpg",
    alt: "PaxGadgets power bank in-hand form factor and matte finish",
    caption: "Ergonomic Handheld Unibody",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-14.jpg",
    alt: "Dual high-speed fast charging ports detail",
    caption: "Precision CNC Port Alignment",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-17.jpg",
    alt: "Precision LED digital power display bar in action",
    caption: "Dynamic LED Power Gauge",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-21.jpg",
    alt: "Tactile scratch-resistant charcoal unibody surface",
    caption: "Matte Charcoal Alloy Chassis",
  },
];

export default function BrandStory() {
  return (
    <section className="py-16 sm:py-24 bg-[#08090a] border-t border-[#141518] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
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

        {/* Real Hardware Gallery from pb_images */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Engineering Studio Proofs</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              Photographed at Lagos R&D Facility
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {studioPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/5] sm:aspect-square rounded-2xl bg-[#0f1117] border border-[#1d1f2b] overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 text-left">
                  <span className="text-[10px] sm:text-xs font-mono font-semibold text-neutral-200 block truncate">
                    {photo.caption}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400">
                    Live Sample #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23]">
            <Cpu className="w-6 h-6 text-emerald-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Thermal Efficiency</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Proprietary internal alloy shielding dissipates high-wattage heat, protecting lithium-polymer cells across thousands of cycles.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23]">
            <Zap className="w-6 h-6 text-emerald-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Protocol Handshakes</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Dynamic voltage regulation identifies the optimal wattage curve for iPhones, Android devices, tablets, and audio accessories.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23]">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">10-Stage Surge Guard</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Integrated circuit arresters protect against short-circuit spikes, sudden dropouts, and electrical anomalies.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23]">
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
