"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, ArrowUpRight } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function CategoryShowcase() {
  const { addToCart } = useCart();

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Hardware Lineup
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 mt-1">
              Engineered Configurations
            </h2>
          </div>
          <p className="text-sm text-neutral-600 max-w-sm mt-3 md:mt-0 font-normal leading-relaxed">
            Choose between standalone units, dual-pack creator rigs, or metered field versions. Built with identical cell integrity.
          </p>
        </div>

        {/* Minimalist Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-white border border-neutral-200/90 p-5 flex flex-col justify-between hover:border-neutral-400 transition-all duration-200 shadow-sm group"
            >
              <div>
                {/* Image Container with only pb_images */}
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

                <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
                  {product.category}
                </span>

                <Link href={`/products/${product.slug}`} className="block mt-1">
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold font-mono text-neutral-950">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-[11px] font-mono text-neutral-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                    aria-label={`View ${product.name} specifications`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
