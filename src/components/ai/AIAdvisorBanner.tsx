"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react";
import AIProductAdvisorModal from "./AIProductAdvisorModal";

export default function AIAdvisorBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="relative rounded-3xl bg-gradient-to-r from-[#12141c] via-[#0f1118] to-[#121520] border border-[#212330] p-6 sm:p-8 overflow-hidden shadow-2xl mb-12">
        {/* Ambient Gradient Flare */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              AI Gateway Product Matcher
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Describe what you&apos;re looking for. Let AI find your gear.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl">
              Tell our model about your commute, travel plans, power needs, or audio tastes. We analyze our entire catalog and recommend the exact hardware match.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleSearch} className="space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="e.g. 'I need a fast charger for travel flights...'"
                  className="w-full bg-[#0a0b0e] border border-[#242735] text-xs text-neutral-200 placeholder-neutral-500 pl-4 pr-24 py-3.5 rounded-xl focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-white text-black hover:bg-neutral-200 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Ask AI
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>Natural language hardware consultation</span>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Open Full Advisor
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AIProductAdvisorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialQuery={inputQuery}
      />
    </>
  );
}
