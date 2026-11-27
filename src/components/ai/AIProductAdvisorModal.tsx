"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  X,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { products } from "@/data/products";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface RecommendationItem {
  productId: string;
  matchScore: number;
  matchReason: string;
  highlightFeature: string;
}

interface RecommendationResponse {
  headline: string;
  explanation: string;
  recommendations: RecommendationItem[];
  suggestedFollowUps: string[];
  source: "ai-gateway" | "fallback-catalog-matcher";
  modelUsed?: string;
}

const PRESET_PROMPTS = [
  "High-capacity power bank approved for aviation & long flights",
  "Dual power bank creator rig for cameras and smartphones",
  "Fast charging battery with real-time metered LED display",
  "Rugged field power bank with reinforced impact bumpers",
  "Compact daily commuter power bank with dual fast-charge ports",
];

export default function AIProductAdvisorModal({
  isOpen,
  onClose,
  initialQuery = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}) {
  const { addToCart } = useCart();
  const [query, setQuery] = useState(initialQuery);
  const [prevInitial, setPrevInitial] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  if (initialQuery !== prevInitial) {
    setPrevInitial(initialQuery);
    setQuery(initialQuery);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (searchPrompt?: string) => {
    const activeQuery = (searchPrompt || query).trim();
    if (!activeQuery) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuery }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recommendation");
      }

      const data: RecommendationResponse = await res.json();
      setResult(data);
    } catch (err) {
      console.error("[AI Advisor] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AI Product Advisor Modal"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-neutral-200 text-neutral-900 shadow-2xl overflow-hidden my-8">
          {/* Modal Header */}
          <div className="relative px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                  PAX Hardware Advisor
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 uppercase tracking-widest">
                    Specification Matcher
                  </span>
                </h2>
                <p className="text-xs text-neutral-500">
                  Describe your device requirements or travel conditions for direct hardware matching.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-3"
            >
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. 'I shoot videos on the field with my phone and need reliable multi-charge battery power...'"
                  rows={3}
                  className="w-full bg-neutral-50 border border-neutral-200 text-base sm:text-sm text-neutral-900 placeholder-neutral-400 p-3.5 sm:p-4 rounded-2xl focus:outline-none focus:border-neutral-900 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Find Matches
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Inspiration Prompt Pills */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-neutral-500">
                  Quick prompt ideas:
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQuery(prompt);
                        handleSubmit(prompt);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Loading State */}
            {loading && (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-900 flex items-center justify-center mx-auto animate-pulse">
                  <Cpu className="w-6 h-6 animate-spin text-neutral-900" />
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Consulting Model & Catalog Schematics...
                </div>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Evaluating cell density, port configurations, and stock availability across our inventory.
                </p>
              </div>
            )}

            {/* Results Presentation */}
            {result && !loading && (
              <div className="space-y-5 pt-2">
                {/* Advisor Recommendation Summary Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {result.headline}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-neutral-600 border border-neutral-200">
                      {result.source === "ai-gateway" ? "AI Gateway Live" : "Catalog Engine"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                    {result.explanation}
                  </p>
                </div>

                {/* Recommended Product Cards */}
                <div className="space-y-3">
                  <div className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">
                    Recommended Hardware ({result.recommendations.length})
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.recommendations.map((rec) => {
                      const product = products.find((p) => p.id === rec.productId);
                      if (!product) return null;
                      const isAvailable = product.availabilityStatus === "Available";
                      const isAdded = addedItems[product.id];

                      return (
                        <div
                          key={rec.productId}
                          className="rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 p-4 flex flex-col justify-between transition-all shadow-sm"
                        >
                          <div>
                            {/* Card Top: Match Score & Category */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                                {product.category}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                {rec.matchScore}% Match
                              </span>
                            </div>

                            {/* Product Visual & Name */}
                            <div className="flex gap-3.5 items-center mb-3">
                              <div className="relative w-16 h-16 rounded-xl bg-neutral-50 border border-neutral-200 flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                                <Image
                                  src={product.heroImage}
                                  alt={product.name}
                                  fill
                                  sizes="64px"
                                  className="object-contain p-1"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-neutral-900 truncate">
                                  {product.name}
                                </h4>
                                <div className="text-xs font-mono font-semibold text-neutral-900 mt-0.5">
                                  {isAvailable ? formatPrice(product.price) : "Coming Soon"}
                                </div>
                              </div>
                            </div>

                            {/* Why it matches */}
                            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-600 leading-relaxed mb-3">
                              <span className="text-neutral-900 font-semibold block mb-0.5 font-mono text-[10px] uppercase">
                                Why This Matches You
                              </span>
                              {rec.matchReason}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={onClose}
                              className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 hover:text-neutral-900 text-xs font-medium transition-colors"
                            >
                              View Specs
                            </Link>

                            {isAvailable ? (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                                  isAdded
                                    ? "bg-emerald-600 text-white"
                                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                                }`}
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                {isAdded ? "Added!" : "Add to Bag"}
                              </button>
                            ) : (
                              <span className="text-[11px] font-mono text-neutral-500">
                                Coming Soon
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Follow-up Prompts */}
                {result.suggestedFollowUps?.length > 0 && (
                  <div className="pt-3 border-t border-neutral-100 space-y-2">
                    <span className="text-[11px] font-mono text-neutral-500">
                      Explore related questions:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {result.suggestedFollowUps.map((fu, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setQuery(fu);
                            handleSubmit(fu);
                          }}
                          className="px-3 py-1 rounded-lg text-xs bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900 transition-colors"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
