"use client";

import React from "react";
import Link from "next/link";
import { BatteryCharging, Headphones, Smartphone, Cable, ArrowUpRight } from "lucide-react";
import { categories } from "@/data/products";

const categoryIcons: Record<string, React.ReactNode> = {
  "power-charging": <BatteryCharging className="w-5 h-5 text-emerald-400" />,
  audio: <Headphones className="w-5 h-5 text-neutral-300" />,
  "mobile-devices": <Smartphone className="w-5 h-5 text-neutral-300" />,
  accessories: <Cable className="w-5 h-5 text-neutral-300" />,
};

export default function CategoryShowcase() {
  return (
    <section className="py-24 bg-[#08090a] border-t border-[#141518]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
              Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Product Architecture
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm mt-2 md:mt-0 font-light leading-relaxed">
            High-density power solutions and acoustic accessories built with minimal Scandinavian industrial design principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group p-6 rounded-2xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1b1c23] hover:border-[#2a2c37] transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] relative overflow-hidden"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#14151a] border border-[#20222a] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {categoryIcons[category.slug]}
                </div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                  {category.name}
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-light">
                  {category.description}
                </p>
              </div>

              {/* Status pill */}
              <div className="mt-6 pt-4 border-t border-[#181920] flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-500">
                  {category.itemCount > 0 ? `${category.itemCount} Product Live` : "Validation Pipeline"}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    category.itemCount > 0
                      ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/50"
                      : "bg-[#14151a] text-neutral-400 border border-[#22242c]"
                  }`}
                >
                  {category.itemCount > 0 ? "In Stock" : "Coming Soon"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
