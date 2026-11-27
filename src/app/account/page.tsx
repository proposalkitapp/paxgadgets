"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Package, MapPin, Clock, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getOrders } from "@/lib/adminStore";
import { Order } from "@/types";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [customerProfile, setCustomerProfile] = useState<{
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  }>({
    fullName: "Verified Customer",
    email: "customer@paxgadgets.ng",
    phone: "+234 802 729 4234",
    address: "Plot 12, Adeola Odeku Street, Victoria Island",
    city: "Lagos Island",
    state: "Lagos",
  });

  useEffect(() => {
    const loadCustomerData = () => {
      const allOrders = getOrders();
      let currentEmail = "customer@paxgadgets.ng";

      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("pax_customer_profile");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.fullName || parsed.email) {
              setCustomerProfile((prev) => ({
                ...prev,
                ...parsed,
              }));
              if (parsed.email) currentEmail = parsed.email.toLowerCase();
            }
          } catch (e) {
            console.error("Failed to parse saved customer profile", e);
          }
        }
      }

      const customerOrders = allOrders.filter(
        (o) =>
          o.customer.email.toLowerCase() === currentEmail ||
          o.customer.fullName.toLowerCase().includes(customerProfile.fullName.toLowerCase())
      );
      setUserOrders(customerOrders.length > 0 ? customerOrders : allOrders.slice(0, 5));
    };

    loadCustomerData();

    window.addEventListener("pax_admin_store_updated", loadCustomerData);
    return () => window.removeEventListener("pax_admin_store_updated", loadCustomerData);
  }, [customerProfile.fullName]);

  const initials = customerProfile.fullName
    ? customerProfile.fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "PX";

  return (
    <div className="pt-28 pb-20 bg-[#fafafa] min-h-screen text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Customer Portal
            </span>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">
              My Account
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
              {initials}
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-900">{customerProfile.fullName}</div>
              <div className="text-xs text-neutral-500 font-mono">{customerProfile.email}</div>
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
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200"
              }`}
            >
              <Package className="w-4 h-4" />
              Order History
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === "addresses"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200"
              }`}
            >
              <MapPin className="w-4 h-4" />
              Addresses & Destination
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === "profile"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200"
              }`}
            >
              <User className="w-4 h-4" />
              Profile Details
            </button>
          </div>

          {/* Active Tab Content Area */}
          <div className="lg:col-span-9">
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <h2 className="text-base font-bold text-neutral-900">
                    Recent Hardware Orders ({userOrders.length})
                  </h2>
                  <Link
                    href="/shop"
                    className="text-xs font-mono text-neutral-900 hover:underline font-semibold"
                  >
                    Browse Catalogue &rarr;
                  </Link>
                </div>

                {userOrders.length === 0 ? (
                  <div className="p-12 rounded-2xl bg-white border border-neutral-200 text-center space-y-3 shadow-sm">
                    <Package className="w-8 h-8 text-neutral-400 mx-auto" />
                    <p className="text-sm font-semibold text-neutral-900">No Orders Found</p>
                    <p className="text-xs text-neutral-500">
                      You haven&apos;t placed any orders yet with this account.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
                    >
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-6 rounded-2xl bg-white border border-neutral-200/90 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs font-mono">
                        <div>
                          <span className="text-neutral-500">Order Ref: </span>
                          <span className="text-neutral-900 font-bold">{ord.id}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-neutral-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-900 border border-neutral-200">
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-neutral-900 font-medium">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-mono text-neutral-600">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-xs font-mono">
                        <span className="text-neutral-500">Total Paid</span>
                        <span className="text-sm font-bold text-neutral-900">
                          {formatPrice(ord.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
                <h2 className="text-base font-bold text-neutral-900">Default Delivery Address</h2>
                <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                  <div className="font-bold text-neutral-900">{customerProfile.fullName}</div>
                  <div className="text-neutral-600">{customerProfile.address}</div>
                  <div className="text-neutral-600">{customerProfile.city}, {customerProfile.state}</div>
                  <div className="text-neutral-500 font-mono pt-1">{customerProfile.phone}</div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
                <h2 className="text-base font-bold text-neutral-900">Customer Profile</h2>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-neutral-500 font-mono mb-1">Full Name</label>
                    <input
                      type="text"
                      readOnly
                      value={customerProfile.fullName}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 px-3.5 py-2.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-mono mb-1">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      value={customerProfile.email}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 px-3.5 py-2.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-mono mb-1">Phone Number</label>
                    <input
                      type="tel"
                      readOnly
                      value={customerProfile.phone}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 px-3.5 py-2.5 rounded-xl"
                    />
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
