"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function FeaturedProductSection() {
  const { addToCart } = useCart();
  const featuredProduct = products.find((p) => p.featured && p.availabilityStatus === "Available");

  const [activeImage, setActiveImage] = useState(
    featuredProduct ? featuredProduct.heroImage : "/assets/products/powerbank-hero.png"
  );
  const [addedAnim, setAddedAnim] = useState(false);

  if (!featuredProduct) return null;

  const handleAdd = () => {
    addToCart(featuredProduct);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#08090a] border-t border-[#141518]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
              Flagship Showcase
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Tactile Carbon Architecture
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mt-2 md:mt-0 font-light leading-relaxed">
            Milled carbon-weave faceplate with integrated digital metering and dual bi-directional fast ports.
          </p>
        </div>

        {/* Featured Product Card with Soft Studio Lighting */}
        <div className="rounded-3xl bg-gradient-to-b from-[#111216] to-[#0c0d10] border border-[#1e2027] p-5 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-950/15 blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Image Presentation & Studio Thumbnail Strip */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative w-full aspect-square max-w-[440px] mx-auto rounded-2xl bg-[#090a0d] border border-[#1b1c24] flex items-center justify-center p-4 overflow-hidden">
                <Image
                  src={activeImage}
                  alt={featuredProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-contain p-4 filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-300"
                />
              </div>

              {/* Hardware Photo Selector from pb_images */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-1">
                {featuredProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#0e0f14] border flex-shrink-0 p-1.5 transition-all ${
                      activeImage === img
                        ? "border-emerald-400 ring-2 ring-emerald-400/20 scale-105"
                        : "border-[#1e2028] opacity-65 hover:opacity-100"
                    }`}
                    aria-label={`Select product image view ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`Hardware view ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details & Purchase Trigger */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {featuredProduct.availabilityStatus}
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  SKU: PB-CH-01
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                  {featuredProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2.5 leading-relaxed font-light">
                  {featuredProduct.shortDescription}
                </p>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                  {formatPrice(featuredProduct.price)}
                </span>
                {featuredProduct.originalPrice && (
                  <span className="text-sm font-mono text-neutral-500 line-through">
                    {formatPrice(featuredProduct.originalPrice)}
                  </span>
                )}
                <span className="text-xs font-mono text-emerald-400 ml-1">
                  Save 15%
                </span>
              </div>

              {/* Key Specs Pills */}
              <div className="space-y-2.5 pt-2 border-t border-[#1a1b22]">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Engineering Overview
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {featuredProduct.specifications.slice(0, 4).map((spec) => (
                    <div key={spec.label} className="p-2.5 sm:p-3 rounded-xl bg-[#0e0f13] border border-[#1b1c22]">
                      <div className="text-neutral-500 text-[10px] uppercase font-mono">{spec.label}</div>
                      <div className="text-neutral-200 font-medium truncate mt-0.5">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleAdd}
                  className={`w-full sm:flex-1 py-4 sm:py-3.5 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
                    addedAnim
                      ? "bg-emerald-500 text-black font-bold"
                      : "bg-white text-black hover:bg-neutral-200 shadow-white/5"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedAnim ? "Added to Bag!" : "Add to Bag"}
                </button>

                <Link
                  href={`/products/${featuredProduct.slug}`}
                  className="w-full sm:w-auto py-4 sm:py-3.5 px-6 rounded-xl bg-[#121317] hover:bg-[#1a1b22] border border-[#22242c] text-neutral-200 font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  View Specifications
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Delivery & Warranty */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-[11px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Express 24-48hr Nationwide Dispatch
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  12-Month Official Warranty
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
