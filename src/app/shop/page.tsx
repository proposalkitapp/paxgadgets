"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingBag, ArrowRight } from "lucide-react";
import { products, categories } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

function ShopContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Read URL query params on mount or when params change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "all" || product.categorySlug === selectedCategory;
        const matchesAvailability =
          availabilityFilter === "all" || product.availabilityStatus === availabilityFilter;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesAvailability && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [selectedCategory, availabilityFilter, searchQuery, sortBy]);

  return (
    <div className="pt-28 pb-20 bg-[#090a0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Official Storefront
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
            Browse All Products
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl">
            Explore our engineering catalogue. Browse freely without mandatory account creation.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-xl bg-[#0f1014] border border-[#1f2026] mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search catalogue products"
                className="w-full bg-[#15161c] border border-[#252730] text-xs text-neutral-200 pl-9 pr-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Sorting & Availability Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                aria-label="Filter products by availability status"
                className="bg-[#15161c] border border-[#252730] text-xs text-neutral-300 px-3 py-2.5 rounded-lg focus:outline-none"
              >
                <option value="all">All Availability</option>
                <option value="Available">In Stock Only</option>
                <option value="Coming Soon">Coming Soon Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products by criteria"
                className="bg-[#15161c] border border-[#252730] text-xs text-neutral-300 px-3 py-2.5 rounded-lg focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#1a1b22] pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-white text-black font-semibold"
                  : "bg-[#14151a] text-neutral-400 hover:text-white"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-white text-black font-semibold"
                    : "bg-[#14151a] text-neutral-400 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isAvailable = product.availabilityStatus === "Available";

            return (
              <div
                key={product.id}
                className="rounded-2xl bg-[#0e0f13] border border-[#1d1f25] hover:border-[#2c2f38] transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Clickable Image Container */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative w-full aspect-[4/3] bg-[#090a0d] border-b border-[#181920] flex items-center justify-center p-6 overflow-hidden block"
                >
                  <Image
                    src={product.heroImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className={`object-contain p-4 group-hover:scale-105 transition-transform duration-500 ${
                      !isAvailable ? "filter grayscale opacity-75" : ""
                    }`}
                  />
                  {/* Availability Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isAvailable
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50"
                          : "bg-amber-950/80 text-amber-400 border border-amber-800/50"
                      }`}
                    >
                      {product.availabilityStatus}
                    </span>
                  </div>
                </Link>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      {product.category}
                    </span>
                    <Link href={`/products/${product.slug}`} className="block">
                      <h2 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#181920] flex items-center justify-between">
                    <div>
                      {isAvailable ? (
                        <div className="text-base font-mono font-bold text-white">
                          {formatPrice(product.price)}
                        </div>
                      ) : (
                        <div className="text-xs font-mono text-neutral-500">
                          Price TBA
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="px-2.5 py-1.5 rounded-lg bg-[#14151b] hover:bg-[#1c1d24] text-neutral-300 hover:text-white text-xs font-medium border border-[#252732] transition-colors"
                      >
                        Specs
                      </Link>
                      {isAvailable && (
                        <button
                          onClick={() => addToCart(product)}
                          className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add
                        </button>
                      )}
                    </div>
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
