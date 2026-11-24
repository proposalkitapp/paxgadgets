"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Eye,
  ShoppingCart,
  CreditCard,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import {
  getStoredEvents,
  clearStoredEvents,
  AnalyticsEventRecord,
} from "@/lib/analytics";

export default function AnalyticsInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<AnalyticsEventRecord[]>(() =>
    typeof window !== "undefined" ? getStoredEvents() : []
  );
  const [lastEventTime, setLastEventTime] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Listen to live events emitted across the window
    const handleLiveEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AnalyticsEventRecord>;
      if (customEvent.detail) {
        setEvents((prev) => [customEvent.detail, ...prev].slice(0, 30));
        setLastEventTime(new Date().toLocaleTimeString());
        setPulse(true);
        setTimeout(() => setPulse(false), 1200);
      }
    };

    window.addEventListener("pax:analytics", handleLiveEvent);
    return () => window.removeEventListener("pax:analytics", handleLiveEvent);
  }, []);

  const handleClear = () => {
    clearStoredEvents();
    setEvents([]);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "product_view":
        return <Eye className="w-3.5 h-3.5 text-cyan-400" />;
      case "add_to_cart":
        return <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />;
      case "checkout_start":
        return <CreditCard className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case "product_view":
        return "bg-cyan-950/70 text-cyan-300 border-cyan-800/50";
      case "add_to_cart":
        return "bg-emerald-950/70 text-emerald-300 border-emerald-800/50";
      case "checkout_start":
        return "bg-amber-950/70 text-amber-300 border-amber-800/50";
      default:
        return "bg-purple-950/70 text-purple-300 border-purple-800/50";
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 z-40 max-w-xs sm:max-w-md w-[calc(100vw-2rem)] font-mono select-none">
      {/* Floating Trigger Pill */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0e0f14]/95 backdrop-blur-md border border-[#232530] hover:border-[#383a48] text-xs text-neutral-200 cursor-pointer shadow-2xl transition-all ${pulse ? "ring-2 ring-emerald-500/50 border-emerald-500" : ""
          }`}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${pulse ? "duration-300" : "duration-1000"
                }`}
            />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-white tracking-wide">
            Storefront Analytics
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#181922] text-emerald-400 border border-[#292b38]">
            {events.length} tracked
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-neutral-400">
          {lastEventTime && (
            <span className="text-[10px] text-neutral-500 hidden sm:inline">
              latest {lastEventTime}
            </span>
          )}
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Expanded Stream Drawer */}
      {isOpen && (
        <div className="mt-2 p-3.5 rounded-2xl bg-[#0b0c10]/95 backdrop-blur-xl border border-[#232530] shadow-2xl space-y-3 max-h-80 flex flex-col text-xs">
          <div className="flex items-center justify-between border-b border-[#1b1c24] pb-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Event Stream</span>
            </div>
            <button
              onClick={handleClear}
              className="text-neutral-500 hover:text-red-400 transition-colors flex items-center gap-1"
              title="Clear event log"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {events.length === 0 ? (
            <div className="py-6 text-center text-neutral-500 text-[11px] font-sans">
              No events recorded in this session yet. Browse products, add to
              bag, or proceed to checkout to see live stream!
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-xl bg-[#111218] border border-[#1d1f28] hover:border-[#2a2c3a] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getEventBadgeClass(
                        evt.event
                      )}`}
                    >
                      {getEventIcon(evt.event)}
                      {evt.event.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Event summary details */}
                  <div className="text-[11px] text-neutral-300 font-sans space-y-0.5">
                    {evt.event === "product_view" && (
                      <div>
                        <span className="font-semibold text-white">
                          {(evt.properties.productName as string) || "Product"}
                        </span>{" "}
                        <span className="text-neutral-500">
                          ({evt.properties.category as string})
                        </span>
                      </div>
                    )}

                    {evt.event === "add_to_cart" && (
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-emerald-300">
                          +{(evt.properties.quantity as number) || 1}x{" "}
                          {(evt.properties.productName as string) || "Item"}
                        </span>
                        <span className="text-neutral-400 font-mono text-[10px]">
                          ₦
                          {(
                            (evt.properties.totalValue as number) || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {evt.event === "checkout_start" && (
                      <div className="flex justify-between items-center text-amber-300">
                        <span>
                          Checkout started ({evt.properties.cartCount as number}{" "}
                          items)
                        </span>
                        <span className="font-mono text-[10px]">
                          ₦
                          {(
                            (evt.properties.subtotal as number) || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
