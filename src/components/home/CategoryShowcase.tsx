"use client";

import React from "react";
import Link from "next/link";
import { BatteryCharging, Headphones, Smartphone, Cable, ArrowUpRight } from "lucide-react";
import { categories } from "@/data/products";

const categoryIcons: Record<string, React.ReactNode> = {
  "power-charging": <BatteryCharging className="w-6 h-6 text-cyan-400" />,
  audio: <Headphones className="w-6 h-6 text-blue-400" />,
  "mobile-devices": <Smartphone className="w-6 h-6 text-purple-400" />,
  accessories: <Cable className="w-6 h-6 text-amber-400" />,
};

export default function CategoryShowcase() {
  return (
    <section className="py-20 bg-[#07080a] border-t border-[#14151a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Product Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Engineered Product Categories
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm mt-2 md:mt-0">
            A cohesive ecosystem of consumer technology designed to power everyday workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group p-6 rounded-2xl bg-[#0d0e12] border border-[#1e2026] hover:border-[#2f323c] transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] relative overflow-hidden"
            >
              {/* Category Header */}
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#14161c] border border-[#22242c] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {categoryIcons[category.slug]}
                </div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                  {category.name}
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Status pill */}
              <div className="mt-6 pt-4 border-t border-[#181920] flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-500">
                  {category.itemCount > 0 ? `${category.itemCount} Product Live` : "Pre-Release Pipeline"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    category.itemCount > 0
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                      : "bg-[#181920] text-neutral-400 border border-[#262832]"
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
