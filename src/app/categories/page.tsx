"use client";

import React from "react";
import Link from "next/link";
import {
  BatteryCharging,
  Layers,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { categories } from "@/data/products";

const icons: Record<string, React.ReactNode> = {
  "portable-energy": <BatteryCharging className="w-7 h-7 text-neutral-900" />,
  "creator-bundles": <Layers className="w-7 h-7 text-neutral-900" />,
  "travel-field": <Compass className="w-7 h-7 text-neutral-900" />,
};

export default function CategoriesPage() {
  return (
    <div className="pt-28 pb-20 bg-[#fafafa] min-h-screen text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Hardware Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
            Product Categories
          </h1>
          <p className="text-xs text-neutral-500 mt-2 max-w-xl font-light leading-relaxed">
            Browse our core power architectures across high-density portable energy, multi-device creator packs, and rugged travel editions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="p-7 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-900 transition-all flex flex-col justify-between group relative overflow-hidden shadow-sm"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {icons[cat.slug] || <BatteryCharging className="w-7 h-7 text-neutral-900" />}
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                    {cat.name}
                  </h2>
                  <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                </div>
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">
                  {cat.itemCount > 0 ? `${cat.itemCount} Live Products` : "Preview Collection"}
                </span>
                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                    cat.itemCount > 0
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                  }`}
                >
                  {cat.itemCount > 0 ? "In Stock" : "Coming Soon"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
