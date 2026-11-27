"use client";

import React, { useState, useEffect } from "react";
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
import { trackProductView } from "@/lib/analytics";

export default function ProductDetailView({ slug }: { slug: string }) {
  const { addToCart } = useCart();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0] || product.heroImage);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  useEffect(() => {
    trackProductView({
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      slug: product.slug,
    });
  }, [product]);

  const isAvailable = product.availabilityStatus === "Available";
  const categoryRelated = products.filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug);
  const otherRelated = products.filter((p) => p.id !== product.id && p.categorySlug !== product.categorySlug);
  const relatedProducts = [...categoryRelated, ...otherRelated].slice(0, 3);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-32 lg:pb-20 bg-[#fafafa] min-h-screen text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 sm:mb-8 font-mono overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-neutral-900">Catalogue</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image Viewport */}
            <div className="relative w-full aspect-square rounded-2xl bg-white border border-neutral-200/90 flex items-center justify-center p-8 overflow-hidden shadow-sm">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-contain p-6 transition-all duration-300"
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider ${
                    isAvailable
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-200 text-neutral-700"
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
                    className={`relative w-20 h-20 rounded-xl bg-white border flex-shrink-0 p-2 overflow-hidden transition-all ${
                      selectedImage === img
                        ? "border-neutral-900 ring-2 ring-neutral-900/10 shadow-sm"
                        : "border-neutral-200 opacity-70 hover:opacity-100"
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
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-1">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex items-baseline justify-between">
              <div>
                <span className="text-xs text-neutral-500 font-mono block">Direct Brand Price</span>
                {isAvailable ? (
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-3xl font-mono font-black text-neutral-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm font-mono text-neutral-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-sm font-mono text-neutral-500 mt-1">
                    Price Announced Upon Release
                  </div>
                )}
              </div>

              {isAvailable && (
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-900 font-semibold bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    In Stock ({product.stockQuantity} units)
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Bag */}
            {isAvailable ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="text-xs text-neutral-600 font-medium">Quantity</div>
                  <div className="flex items-center rounded-xl border border-neutral-200 bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-mono font-bold text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                      className="w-11 h-11 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-sm min-h-[48px] ${
                    addedAnimation
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-black"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedAnimation ? "Added to Shopping Bag!" : "Add to Bag"}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-800 flex items-start gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 text-neutral-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-900">Coming Soon</div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">
                    This product is currently in engineering validation. Purchasing controls are inactive until official release.
                  </div>
                </div>
              </div>
            )}

            {/* Assurance Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-900 flex-shrink-0" />
                <span>Express Nationwide Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-900 flex-shrink-0" />
                <span>12-Month Official Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications & Engineered Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-neutral-200 pt-14">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
              Technical Specifications
            </h3>
            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <tbody>
                  {product.specifications.map((spec, idx) => (
                    <tr
                      key={spec.label}
                      className={idx !== product.specifications.length - 1 ? "border-b border-neutral-100" : ""}
                    >
                      <td className="px-4 py-3 font-mono text-neutral-500 w-1/3 bg-neutral-50">
                        {spec.label}
                      </td>
                      <td className="px-4 py-3 font-medium text-neutral-900">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
              Engineered Highlights
            </h3>
            <div className="space-y-3">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-neutral-200 flex items-start gap-3 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-neutral-900 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-700 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-14 border-t border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight mb-8">
              Explore More Technology
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl bg-neutral-50 flex items-center justify-center p-4 mb-4">
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
                    <h4 className="text-sm font-bold text-neutral-900 mt-1 group-hover:text-neutral-600 transition-colors">
                      {rel.name}
                    </h4>
                    <span className="inline-block mt-3 text-xs font-mono text-neutral-900 font-bold">
                      {rel.availabilityStatus === "Available" ? formatPrice(rel.price) : "Coming Soon"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Mobile Sticky Action Bar */}
      {isAvailable && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-white/95 backdrop-blur-xl border-t border-neutral-200 lg:hidden flex items-center justify-between gap-3 shadow-[0_-10px_25px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-11 h-11 rounded-lg bg-neutral-50 border border-neutral-200 flex-shrink-0 p-1">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-neutral-900 truncate max-w-[130px] sm:max-w-[200px]">
                {product.name}
              </div>
              <div className="text-xs font-mono font-black text-neutral-900">
                {formatPrice(product.price * quantity)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleAddToCart}
              className={`px-4 sm:px-5 py-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-sm ${
                addedAnimation
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-900 text-white active:bg-black"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {addedAnimation ? "Added!" : "Add to Bag"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
