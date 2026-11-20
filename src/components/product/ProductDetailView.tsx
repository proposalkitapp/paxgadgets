"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function ProductDetailView({ slug }: { slug: string }) {
  const { addToCart } = useCart();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0] || product.heroImage);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  const isAvailable = product.availabilityStatus === "Available";
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="pt-28 pb-20 bg-[#090a0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 font-mono">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white">Catalogue</Link>
          <span>/</span>
          <span className="text-neutral-300 truncate">{product.name}</span>
        </nav>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image Viewport */}
            <div className="relative w-full aspect-square rounded-2xl bg-[#0e0f14] border border-[#20222a] flex items-center justify-center p-8 overflow-hidden shadow-2xl">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-contain p-4 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-300"
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider ${
                    isAvailable
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50"
                      : "bg-amber-950/80 text-amber-400 border border-amber-800/50"
                  }`}
                >
                  {product.availabilityStatus}
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl bg-[#0e0f14] border flex-shrink-0 p-2 overflow-hidden transition-all ${
                      selectedImage === img
                        ? "border-emerald-400 ring-2 ring-emerald-400/20"
                        : "border-[#20222a] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchasing Actions Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-xl bg-[#0f1014] border border-[#1f2026] flex items-baseline justify-between">
              <div>
                <span className="text-xs text-neutral-500 font-mono block">Direct Brand Price</span>
                {isAvailable ? (
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-3xl font-mono font-black text-white">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm font-mono text-neutral-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-sm font-mono text-neutral-400 mt-1">
                    Price Announced Upon Release
                  </div>
                )}
              </div>

              {isAvailable && (
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock ({product.stockQuantity} units)
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Bag (Only for Available products per PRD §5.2) */}
            {isAvailable ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="text-xs text-neutral-400 font-medium">Quantity</div>
                  <div className="flex items-center rounded-lg border border-[#23252d] bg-[#121317]">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-neutral-400 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-xs font-mono font-semibold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                      className="p-2 text-neutral-400 hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xl ${
                    addedAnimation
                      ? "bg-emerald-500 text-black"
                      : "bg-white text-black hover:bg-neutral-200 shadow-white/5"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedAnimation ? "Added to Shopping Bag!" : "Add to Bag"}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-200">Coming Soon</div>
                  <div className="text-[11px] text-amber-400/80 mt-0.5">
                    This product is currently in engineering validation. Purchasing controls are inactive until official release.
                  </div>
                </div>
              </div>
            )}

            {/* Assurance Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1c1d22] text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Express Nationwide Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>12-Month Official Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications & Engineered Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-[#1c1d22] pt-14">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Technical Specifications
            </h3>
            <div className="rounded-xl border border-[#1e2026] bg-[#0c0d10] overflow-hidden">
              <table className="w-full text-xs text-left">
                <tbody>
                  {product.specifications.map((spec, idx) => (
                    <tr
                      key={spec.label}
                      className={idx !== product.specifications.length - 1 ? "border-b border-[#181920]" : ""}
                    >
                      <td className="px-4 py-3 font-mono text-neutral-500 w-1/3 bg-[#0a0b0e]">
                        {spec.label}
                      </td>
                      <td className="px-4 py-3 font-medium text-neutral-200">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Engineered Highlights
            </h3>
            <div className="space-y-3">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0c0d10] border border-[#1e2026] flex items-start gap-3"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-300 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-14 border-t border-[#1c1d22]">
            <h3 className="text-xl font-bold text-white tracking-tight mb-8">
              Explore More Technology
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="p-5 rounded-2xl bg-[#0d0e12] border border-[#1e2026] hover:border-[#2f323c] transition-all flex flex-col justify-between group"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl bg-[#090a0d] flex items-center justify-center p-4 mb-4">
                    <Image
                      src={rel.heroImage}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                      {rel.name}
                    </h4>
                    <span className="inline-block mt-3 text-xs font-mono text-emerald-400">
                      {rel.availabilityStatus === "Available" ? formatPrice(rel.price) : "Coming Soon"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
