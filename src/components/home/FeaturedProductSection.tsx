"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, ArrowRight, ShieldCheck, Zap, BatteryCharging, Cpu } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const hardwareHighlights = [
  {
    title: "Precision LED Power Meter",
    desc: "Real-time visual percentage gauge eliminates battery guessing during travel and shoots.",
    image: "/assets/products/photo_2026-11-19_19-28-17.jpg",
    metric: "Instant Readout",
  },
  {
    title: "Dual Fast-Charge Hub",
    desc: "Bi-directional USB-C (22.5W / PD) + high-output USB-A for simultaneous multi-device powering.",
    image: "/assets/products/photo_2026-11-19_19-28-14.jpg",
    metric: "22.5W Output",
  },
  {
    title: "Ergonomic Handheld Unibody",
    desc: "Aerospace-inspired curved palm contours designed for effortless grip and daily mobility.",
    image: "/assets/products/photo_2026-11-19_19-28-10.jpg",
    metric: "Handheld Form",
  },
  {
    title: "Matte Carbon Composite",
    desc: "Tactile scratch-resistant textured chassis engineered to withstand keys, drops, and heat.",
    image: "/assets/products/photo_2026-11-19_19-28-21.jpg",
    metric: "Thermal Dissipation",
  },
];

export default function FeaturedProductSection() {
  const { addToCart } = useCart();
  const mainProduct = products[0];
  const [activeView, setActiveView] = useState("/assets/products/photo_2026-11-19_19-28-17.jpg");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!mainProduct) return;
    addToCart(mainProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#fafafa] border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Hardware Engineering
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 mt-1">
            Built for tangible endurance.
          </h2>
          <p className="text-base text-neutral-600 mt-3 font-normal leading-relaxed">
            Every component is purpose-built. From CNC port alignment to internal alloy thermal dissipation, explore the physical anatomy of the PAX power architecture.
          </p>
        </div>

        {/* 4 Architecture Pillars Grid using exclusively pb_images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {hardwareHighlights.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveView(item.image)}
              className={`group cursor-pointer rounded-2xl bg-white border p-5 flex flex-col justify-between transition-all ${
                activeView === item.image
                  ? "border-neutral-900 shadow-md ring-1 ring-neutral-900/10"
                  : "border-neutral-200/80 hover:border-neutral-400"
              }`}
            >
              <div>
                <div className="relative w-full aspect-[4/3] rounded-xl bg-neutral-100 overflow-hidden mb-4 border border-neutral-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950/80 text-white font-medium">
                      {item.metric}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>Proof #{idx + 1}</span>
                <span className="text-neutral-900 font-semibold group-hover:underline">Inspect</span>
              </div>
            </div>
          ))}
        </div>

        {/* Large Detailed Hardware Spec Banner */}
        <div className="rounded-3xl bg-white border border-neutral-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Verified Lab Specifications
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
                10-Layer Protection. Aviation Certified.
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Tested against voltage spikes, short-circuits, and thermal shifts. Safe for aircraft carry-on baggage worldwide under IATA UN38.3 protocols.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-neutral-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-900" />
                  <span>Over-charge Cutoff</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-900" />
                  <span>Dual Port Pass-Through</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-900" />
                  <span>Short-Circuit Lock</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-900" />
                  <span>Flame-Retardant Alloy</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={handleAdd}
                  className="px-6 py-3 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors min-h-[44px]"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Buy Flagship — ₦32,500</span>
                    </>
                  )}
                </button>
                <Link
                  href="/shop"
                  className="text-xs font-mono text-neutral-600 hover:text-neutral-950 flex items-center gap-1"
                >
                  <span>All Kits</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full aspect-square max-w-[420px] rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center p-6 overflow-hidden">
                <Image
                  src={activeView}
                  alt="PAX Hardware Close-up View"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-contain p-4 filter drop-shadow-md transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
