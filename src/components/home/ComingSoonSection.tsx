"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bell, Check, Clock } from "lucide-react";
import { products } from "@/data/products";

export default function ComingSoonSection() {
  const comingSoonProducts = products.filter((p) => p.availabilityStatus === "Coming Soon");
  const [notifiedSkus, setNotifiedSkus] = useState<Record<string, boolean>>({});

  const handleNotify = (id: string) => {
    setNotifiedSkus((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="py-24 bg-[#08090a] border-t border-[#141518]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
              R&D Laboratory
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Upcoming Hardware
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm mt-2 md:mt-0 font-light leading-relaxed">
            Preview prototypes undergoing engineering stress testing. Reserve launch notification for early access.
          </p>
        </div>

        {/* Coming Soon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23] p-6 flex flex-col justify-between hover:border-[#2a2c37] transition-all relative overflow-hidden group"
            >
              {/* Coming Soon Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#181920] text-neutral-300 border border-[#262832] flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  Coming Soon
                </span>
                <span className="text-[11px] font-mono text-neutral-500 uppercase">
                  {product.category}
                </span>
              </div>

              {/* Product Visual Preview */}
              <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#090a0d] border border-[#181920] flex items-center justify-center p-6 my-2 overflow-hidden">
                <Image
                  src={product.heroImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-transparent opacity-70" />
              </div>

              {/* Info */}
              <div className="pt-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-light">
                  {product.shortDescription}
                </p>

                {/* Features */}
                <ul className="mt-4 space-y-1.5 text-[11px] text-neutral-400 font-mono">
                  {product.features.slice(0, 2).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notify Trigger */}
              <div className="mt-6 pt-4 border-t border-[#181920] flex items-center justify-between">
                <span className="text-[11px] text-neutral-500 font-mono">Specs Verified</span>
                <button
                  onClick={() => handleNotify(product.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 transition-colors ${
                    notifiedSkus[product.id]
                      ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/50"
                      : "bg-[#14151a] hover:bg-[#1c1e24] border border-[#22242c] text-neutral-300"
                  }`}
                >
                  {notifiedSkus[product.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Notified
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      Notify Me
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
