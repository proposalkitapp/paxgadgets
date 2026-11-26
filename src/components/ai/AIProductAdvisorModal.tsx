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
  "4K action camera with dual touchscreens and rugged stabilization",
  "3-axis motorized smartphone gimbal for smooth cinematic vlogging",
  "Premium spatial ANC earpods with smart OLED display case",
  "Aerospace titanium smartwatch with clinical ECG & 14-day battery",
  "10-in-1 CNC aluminum docking station with dual 4K display outputs",
  "140W GaN Pro charger for fast-charging laptop and phone simultaneously",
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
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-3xl rounded-3xl bg-[#0c0d12] border border-[#242633] text-neutral-100 shadow-2xl overflow-hidden my-8">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Modal Header */}
          <div className="relative px-6 py-5 border-b border-[#1b1c24] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0c0d12] rounded-[10px] flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  PAX Hardware Advisor
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 uppercase tracking-widest">
                    Specification Matcher
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Describe your workflow, device requirements, or travel needs for verified hardware matching.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#181922] transition-colors"
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
                  placeholder="e.g. 'I commute daily on noisy buses and need comfortable headphones that block engine noise and last all week without charging...'"
                  rows={3}
                  className="w-full bg-[#11131a] border border-[#232532] text-base sm:text-sm text-neutral-200 placeholder-neutral-500 p-3.5 sm:p-4 rounded-2xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-40 font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-md"
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
                <div className="text-[11px] font-mono text-neutral-400">
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
                      className="px-3 py-1.5 rounded-lg text-xs bg-[#12141c] border border-[#20222e] text-neutral-300 hover:text-white hover:border-[#333647] transition-colors text-left"
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
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
                  <Cpu className="w-6 h-6 animate-spin text-emerald-400" />
                </div>
                <div className="text-sm font-semibold text-white">
                  Consulting Model & Catalog Schematics...
                </div>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Evaluating thermal ratings, acoustic architecture, wattage requirements, and stock availability across our inventory.
                </p>
              </div>
            )}

            {/* Results Presentation */}
            {result && !loading && (
              <div className="space-y-5 pt-2">
                {/* Advisor Recommendation Summary Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#101218] border border-[#1f212c] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {result.headline}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161822] text-neutral-400 border border-[#252735]">
                      {result.source === "ai-gateway" ? "AI Gateway Live" : "Catalog Engine"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                    {result.explanation}
                  </p>
                </div>

                {/* Recommended Product Cards */}
                <div className="space-y-3">
                  <div className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
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
                          className="rounded-2xl bg-[#0f1117] border border-[#1e202b] hover:border-[#2f3242] p-4 flex flex-col justify-between transition-all"
                        >
                          <div>
                            {/* Card Top: Match Score & Category */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                {product.category}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {rec.matchScore}% Match
                              </span>
                            </div>

                            {/* Product Visual & Name */}
                            <div className="flex gap-3.5 items-center mb-3">
                              <div className="relative w-16 h-16 rounded-xl bg-[#0a0a0c] border border-[#1b1d24] flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                                <Image
                                  src={product.heroImage}
                                  alt={product.name}
                                  fill
                                  sizes="64px"
                                  className="object-contain p-1"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white truncate">
                                  {product.name}
                                </h4>
                                <div className="text-xs font-mono font-semibold text-emerald-400 mt-0.5">
                                  {isAvailable ? formatPrice(product.price) : "Coming Soon"}
                                </div>
                              </div>
                            </div>

                            {/* Why it matches */}
                            <div className="p-3 rounded-xl bg-[#0a0b0f] border border-[#191b24] text-[11px] text-neutral-300 leading-relaxed mb-3">
                              <span className="text-emerald-400 font-semibold block mb-0.5 font-mono text-[10px] uppercase">
                                Why This Matches You
                              </span>
                              {rec.matchReason}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-[#191b24] flex items-center justify-between gap-2">
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={onClose}
                              className="px-3 py-2 rounded-xl bg-[#14161f] border border-[#232532] text-neutral-300 hover:text-white text-xs font-medium transition-colors"
                            >
                              View Specs
                            </Link>

                            {isAvailable ? (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${isAdded
                                    ? "bg-emerald-500 text-black font-bold"
                                    : "bg-white text-black hover:bg-neutral-200"
                                  }`}
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                {isAdded ? "Added!" : "Add to Bag"}
                              </button>
                            ) : (
                              <span className="text-[11px] font-mono text-neutral-500">
                                Prototype R&D
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
                  <div className="pt-3 border-t border-[#1b1c24] space-y-2">
                    <span className="text-[11px] font-mono text-neutral-400">
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
                          className="px-3 py-1 rounded-lg text-xs bg-[#12141c] border border-[#20222d] text-neutral-300 hover:text-white transition-colors"
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
