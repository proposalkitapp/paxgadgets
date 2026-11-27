"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Check, ShieldCheck, Zap } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

const studioViews = [
  {
    src: "/assets/products/powerbank-hero.png",
    label: "Chassis",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-10.jpg",
    label: "Ergonomics",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-14.jpg",
    label: "Dual Ports",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-17.jpg",
    label: "LED Meter",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-21.jpg",
    label: "Carbon Weave",
  },
  {
    src: "/assets/products/photo_2026-11-19_19-28-00.jpg",
    label: "Profile",
  },
];

export default function HeroSection() {
  const { addToCart } = useCart();
  const primaryProduct = products[0];
  const [activeImage, setActiveImage] = useState(studioViews[0].src);
  const [added, setAdded] = useState(false);

  const handleQuickAdd = () => {
    if (!primaryProduct) return;
    addToCart(primaryProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 border-b border-neutral-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Minimalist Typography & Purchase Action */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Minimalist Model Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              <span>PAX HARDWARE • MODEL PB-01</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-950 leading-[1.04]">
                Power, distilled.
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed pt-2 max-w-lg">
                Engineered for intense daily demands. High-density energy storage, bi-directional 22.5W fast charging, and real-time digital metering in a precision-milled matte charcoal chassis.
              </p>
            </div>

            {/* Industrial Spec Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <div className="text-[10px] font-mono text-neutral-500 uppercase">Input / Output</div>
                <div className="text-sm font-semibold text-neutral-900 mt-0.5">22.5W PD Fast</div>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <div className="text-[10px] font-mono text-neutral-500 uppercase">Display</div>
                <div className="text-sm font-semibold text-neutral-900 mt-0.5">LED Level Gauge</div>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-neutral-500 uppercase">Compliance</div>
                <div className="text-sm font-semibold text-neutral-900 mt-0.5">Aviation UN38.3</div>
              </div>
            </div>

            {/* Pricing & Primary CTA */}
            <div className="pt-3 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                  {formatPrice(primaryProduct.price)}
                </span>
                <span className="text-sm font-mono text-neutral-400 line-through">
                  {formatPrice(primaryProduct.originalPrice || 38000)}
                </span>
                <span className="text-xs font-mono font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                  In Stock
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleQuickAdd}
                  className="px-8 py-3.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all shadow-sm min-h-[48px]"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <Link
                  href="/shop"
                  className="px-6 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors min-h-[48px]"
                >
                  <span>Catalogue Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                  12-Month Official Warranty
                </span>
                <span>•</span>
                <span>Express 24-48hr Lagos & Nationwide Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Hardware Studio Showcase (Using only pb_images) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[480px] rounded-3xl bg-neutral-50 border border-neutral-200/90 flex items-center justify-center p-8 overflow-hidden shadow-sm">
              <Image
                src={activeImage}
                alt="PAX Portable Power Bank hardware engineering"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-contain p-6 filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.12)] transition-all duration-300"
              />
            </div>

            {/* Interactive Hardware View Strip (Exclusively pb_images) */}
            <div className="flex items-center justify-center gap-2 mt-4 overflow-x-auto p-1 max-w-full">
              {studioViews.map((view, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(view.src)}
                  className={`relative w-14 h-14 rounded-xl bg-white border p-1 transition-all flex-shrink-0 ${
                    activeImage === view.src
                      ? "border-neutral-950 ring-2 ring-neutral-950/10 scale-105"
                      : "border-neutral-200 opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View ${view.label}`}
                >
                  <Image
                    src={view.src}
                    alt={view.label}
                    fill
                    sizes="56px"
                    className="object-contain p-0.5 rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
