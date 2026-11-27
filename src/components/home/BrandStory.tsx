"use client";

import React from "react";
import Image from "next/image";
import { Cpu, ShieldCheck, Zap, Camera, Check } from "lucide-react";
import { brandConfig } from "@/config/brand";

const studioPhotos = [
  {
    src: "/assets/products/photo_2026-11-19_19-28-10.jpg",
    alt: "PAX power bank in-hand form factor and matte finish",
    caption: "Ergonomic Handheld Profile",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-14.jpg",
    alt: "Dual high-speed fast charging ports detail",
    caption: "CNC Port Housing",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-17.jpg",
    alt: "Precision LED digital power display bar in action",
    caption: "Precision LED Meter",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-21.jpg",
    alt: "Tactile scratch-resistant charcoal unibody surface",
    caption: "Matte Carbon Composite",
  },
];

export default function BrandStory() {
  return (
    <section className="py-20 sm:py-28 bg-[#fafafa] border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Design Philosophy
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950">
            Matte Carbon. Pure Utility.
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed font-normal">
            At {brandConfig.name}, we reject fabricated specs and visual clutter. Finished in satin matte composite with ergonomic grip contours and direct digital metering, our hardware delivers uninterrupted power when you need it most.
          </p>
        </div>

        {/* Real Hardware Gallery from pb_images */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider">
              <Camera className="w-4 h-4 text-neutral-700" />
              <span>Studio Photographic Proofs</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              Photographed at Lagos R&D Facility
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {studioPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-2xl bg-white border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-all duration-300 shadow-sm"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono font-semibold text-white block truncate">
                    {photo.caption}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-300">
                    Proof #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Core Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
            <Cpu className="w-5 h-5 text-neutral-900 mb-3" />
            <h3 className="text-sm font-bold text-neutral-900 mb-1.5">Thermal Endurance</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Internal alloy shielding dissipates high-wattage heat, protecting lithium-polymer cells across 1,000+ deep charge cycles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
            <Zap className="w-5 h-5 text-neutral-900 mb-3" />
            <h3 className="text-sm font-bold text-neutral-900 mb-1.5">Intelligent Protocols</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Dynamic voltage handshake auto-regulates optimal wattage per smartphone, tablet, or creator accessory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-neutral-900 mb-3" />
            <h3 className="text-sm font-bold text-neutral-900 mb-1.5">12-Month Guarantee</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Every unit is serialized and backed by our verified diagnostics and prompt device replacement policy in Lagos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
            <Check className="w-5 h-5 text-neutral-900 mb-3" />
            <h3 className="text-sm font-bold text-neutral-900 mb-1.5">Direct Fulfillment</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Direct express dispatch from our Victoria Island dispatch facility to all 36 Nigerian states within 24–48 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
