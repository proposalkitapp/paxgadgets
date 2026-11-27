"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingBag, ArrowUpRight } from "lucide-react";
import { products, categories } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

function ShopContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category") || "all";
  const urlQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);
  if (urlCategory !== prevUrlCategory) {
    setPrevUrlCategory(urlCategory);
    setSelectedCategory(urlCategory);
  }

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchQuery(urlQuery);
  }

  const [sortBy, setSortBy] = useState<string>("featured");

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "all" || product.categorySlug === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Hardware Catalogue
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 mt-1">
            Engineered Power Solutions
          </h1>
          <p className="text-sm text-neutral-600 mt-2 max-w-xl font-normal leading-relaxed">
            All models feature verified high-density lithium-polymer battery chemistry, 22.5W bi-directional fast charging, and UN38.3 aviation flight compliance.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, specs, bundles..."
                aria-label="Search catalogue products"
                className="w-full bg-white border border-neutral-200 text-sm text-neutral-900 pl-9 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-950"
              />
            </div>

            {/* Sorting Control */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products by criteria"
                className="w-full md:w-auto bg-white border border-neutral-200 text-xs font-medium text-neutral-800 px-3.5 py-2.5 rounded-xl focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-200/60 pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-neutral-950 text-white font-semibold"
                  : "bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200"
              }`}
            >
              All Models
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-neutral-950 text-white font-semibold"
                    : "bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isAvailable = product.availabilityStatus === "Available";

            return (
              <div
                key={product.id}
                className="rounded-2xl bg-white border border-neutral-200/90 p-5 flex flex-col justify-between hover:border-neutral-400 transition-all duration-200 shadow-sm group"
              >
                {/* Clickable Image Container (Using exclusively pb_images) */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative w-full aspect-[4/3] rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center p-4 mb-4 overflow-hidden block"
                >
                  <Image
                    src={product.heroImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-white font-medium">
                      {product.badge}
                    </span>
                  )}
                </Link>

                {/* Body Details */}
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <Link href={`/products/${product.slug}`} className="block mt-1">
                    <h2 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-mono font-bold text-neutral-950">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-[11px] font-mono text-neutral-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="p-2 rounded-lg text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                      aria-label={`View ${product.name} specifications`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                    {isAvailable && (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-xs font-mono text-neutral-500">Loading Store Catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
