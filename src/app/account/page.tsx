"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Package, MapPin, LogOut, CheckCircle2, Clock, ChevronRight, ShoppingBag } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");

  // Sample order for demonstrative account management
  const orders = [
    {
      reference: "ORD-84920194",
      date: "Nov 19, 2026",
      items: [
        {
          name: "Futuristic Charcoal Fast-Charge Power Bank",
          quantity: 1,
          price: 32500,
        },
      ],
      total: 35000,
      paymentStatus: "Paid",
      deliveryStatus: "Processing",
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#090a0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Customer Portal
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white mt-1">
              My Account
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center font-bold font-mono text-sm">
              DT
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Daniel Tech</div>
              <div className="text-xs text-neutral-500 font-mono">daniel@example.com</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Tabs */}
          <div className="lg:col-span-3 space-y-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === "orders"
                  ? "bg-white text-black"
                  : "bg-[#0e0f14] text-neutral-400 hover:text-white border border-[#1f2128]"
              }`}
            >
              <Package className="w-4 h-4" />
              Order History
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === "addresses"
                  ? "bg-white text-black"
                  : "bg-[#0e0f14] text-neutral-400 hover:text-white border border-[#1f2128]"
              }`}
            >
              <MapPin className="w-4 h-4" />
              Saved Addresses
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === "profile"
                  ? "bg-white text-black"
                  : "bg-[#0e0f14] text-neutral-400 hover:text-white border border-[#1f2128]"
              }`}
            >
              <User className="w-4 h-4" />
              Profile Details
            </button>

            <Link
              href="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-500 hover:text-red-400 transition-colors pt-4"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
          </div>

          {/* Tab Content Panel */}
          <div className="lg:col-span-9">
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white mb-2">Order History</h2>

                {orders.map((order) => (
                  <div
                    key={order.reference}
                    className="p-6 rounded-2xl bg-[#0e0f14] border border-[#1f2128] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#181920] pb-4 gap-2 text-xs">
                      <div>
                        <span className="text-neutral-500 font-mono">Reference: </span>
                        <span className="font-mono font-bold text-white">{order.reference}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          {order.paymentStatus}
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {order.deliveryStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-neutral-200">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-mono text-neutral-400">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#181920] flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-500">Total Charged</span>
                      <span className="text-sm font-bold text-cyan-400">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white mb-2">Primary Delivery Address</h2>
                <div className="p-6 rounded-2xl bg-[#0e0f14] border border-[#1f2128] text-xs space-y-2">
                  <div className="font-semibold text-white text-sm">Daniel Tech</div>
                  <div className="text-neutral-400">
                    Plot 12, Adeola Odeku Street, Victoria Island, Lagos State, Nigeria
                  </div>
                  <div className="text-neutral-500 font-mono">+234 800 000 0000</div>
                  <div className="pt-3">
                    <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                      Default Delivery Location
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="p-6 rounded-2xl bg-[#0e0f14] border border-[#1f2128] space-y-4 text-xs">
                <h2 className="text-base font-bold text-white mb-2">Personal Credentials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-500 font-mono block mb-1">Full Name</label>
                    <div className="p-3 rounded-lg bg-[#121318] text-white">Daniel Tech</div>
                  </div>
                  <div>
                    <label className="text-neutral-500 font-mono block mb-1">Authenticated Email</label>
                    <div className="p-3 rounded-lg bg-[#121318] text-white">daniel@example.com</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
