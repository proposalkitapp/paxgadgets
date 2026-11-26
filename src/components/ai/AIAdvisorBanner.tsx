"use client";

import React, { useState } from "react";
import { Cpu, ArrowRight, Search } from "lucide-react";
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
      <div className="relative rounded-3xl bg-gradient-to-r from-[#101217] via-[#0d0e12] to-[#111319] border border-[#1f212a] p-6 sm:p-8 overflow-hidden shadow-2xl mb-12">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-neutral-800/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              <Cpu className="w-3.5 h-3.5" />
              Hardware Advisory System
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Match the exact hardware engineered for your rig.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl font-light">
              Specify your required battery capacity, port wattage, acoustic isolation, or travel demands. Our hardware matcher correlates our certified catalog instantly.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleSearch} className="space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="e.g. 'Flight-approved power bank for iPhone & MacBook...'"
                  className="w-full bg-[#090a0d] border border-[#22242e] text-xs text-neutral-200 placeholder-neutral-500 pl-4 pr-28 py-3.5 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  Match Gear
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>Direct specification consultation</span>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 transition-colors"
                >
                  Open Advisor
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
