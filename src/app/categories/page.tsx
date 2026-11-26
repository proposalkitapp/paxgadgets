"use client";

import React from "react";
import Link from "next/link";
import {
  BatteryCharging,
  Headphones,
  Smartphone,
  Cable,
  Camera,
  Video,
  Watch,
  ArrowUpRight,
} from "lucide-react";
import { categories } from "@/data/products";

const icons: Record<string, React.ReactNode> = {
  "power-charging": <BatteryCharging className="w-8 h-8 text-emerald-400" />,
  audio: <Headphones className="w-8 h-8 text-emerald-400" />,
  cameras: <Camera className="w-8 h-8 text-emerald-400" />,
  gimbals: <Video className="w-8 h-8 text-emerald-400" />,
  wearables: <Watch className="w-8 h-8 text-emerald-400" />,
  accessories: <Cable className="w-8 h-8 text-emerald-400" />,
};

export default function CategoriesPage() {
  return (
    <div className="pt-28 pb-20 bg-[#08090b] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Hardware Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
            Product Categories
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl font-light leading-relaxed">
            Browse our full hardware divisions across high-density power, spatial acoustics, 4K cameras, 3-axis gimbals, aerospace wearables, and engineering accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="p-7 sm:p-8 rounded-2xl bg-[#0e0f14] border border-[#1f2128] hover:border-[#30333e] transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="w-16 h-16 rounded-xl bg-[#14161d] border border-[#23252f] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {icons[cat.slug] || <Smartphone className="w-8 h-8 text-neutral-300" />}
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {cat.name}
                  </h2>
                  <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#181920] flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">
                  {cat.itemCount > 0 ? `${cat.itemCount} Live Products` : "Preview Collection"}
                </span>
                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold ${cat.itemCount > 0
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                      : "bg-[#181920] text-neutral-400 border border-[#262832]"
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
