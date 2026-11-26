"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  Search,
  Package,
  AlertTriangle,
  LogOut,
  ChevronRight,
  ExternalLink,
  Check,
  X,
  BatteryCharging,
  ArrowRight,
  UserCheck,
  FileText,
  BadgeAlert,
  Send,
} from "lucide-react";
import {
  getDistributors,
  getDistributorSession,
  setDistributorSession,
  authenticateDistributor,
  getOrders,
  updateOrderStatus,
  markDistributorOrderOutForDelivery,
  markDistributorOrderDelivered,
  markDistributorOrderProcessing,
} from "@/lib/adminStore";
import { Distributor, Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function DistributorDeliveringPage() {
  // Authentication & Session
  const [currentDistributor, setCurrentDistributor] = useState<Distributor | null>(() => {
    const distList = getDistributors();
    const savedSession = getDistributorSession();
    if (savedSession) {
      return distList.find((d) => d.id === savedSession.id) || savedSession;
    }
    return null;
  });
  const [isAuthChecking, setIsAuthChecking] = useState(false);

  // Login form state
  const [loginId, setLoginId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [availableDistributors, setAvailableDistributors] = useState<Distributor[]>(() => getDistributors());

  // Distributor portal state
  const [allOrders, setAllOrders] = useState<Order[]>(() => getOrders());
  const [activeTab, setActiveTab] = useState<"all" | "assigned" | "transit" | "delivered">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<Order | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial load
  useEffect(() => {
    const handleUpdate = () => {
      setAllOrders(getOrders());
      const updatedDistList = getDistributors();
      setAvailableDistributors(updatedDistList);
      const savedSession = getDistributorSession();
      if (savedSession) {
        const fresh = updatedDistList.find((d) => d.id === savedSession.id);
        if (fresh) setCurrentDistributor(fresh);
      }
    };

    window.addEventListener("pax_admin_store_updated", handleUpdate);
    return () => window.removeEventListener("pax_admin_store_updated", handleUpdate);
  }, []);

  // Handle Login
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");

    if (!loginId.trim() || !passcode.trim()) {
      setLoginError("Please enter your Distributor ID and Security PIN.");
      return;
    }

    const authenticated = authenticateDistributor(loginId, passcode);
    if (authenticated) {
      setCurrentDistributor(authenticated);
      showToast(`Welcome, ${authenticated.contactPerson}! Delivery terminal online.`);
    } else {
      setLoginError("Invalid Distributor ID or Security PIN. Try using Demo Accounts below.");
    }
  };

  // Quick Demo Login
  const handleQuickDemoLogin = (dist: Distributor) => {
    setLoginId(dist.id);
    setPasscode(dist.passcode || "1234");
    const authenticated = authenticateDistributor(dist.id, dist.passcode || "1234");
    if (authenticated) {
      setCurrentDistributor(authenticated);
      showToast(`Logged in as ${authenticated.contactPerson} (${authenticated.name}).`);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setDistributorSession(null);
    setCurrentDistributor(null);
    setLoginId("");
    setPasscode("");
    setSelectedOrderForDetails(null);
    setSelectedOrderForDelivery(null);
    showToast("Terminal session terminated.");
  };

  // Filter orders for the current distributor
  const assignedOrders = useMemo(() => {
    if (!currentDistributor) return [];
    return allOrders.filter(
      (order) =>
        order.assignedDistributorId === currentDistributor.id ||
        order.assignedDistributorName?.toLowerCase() === currentDistributor.name.toLowerCase()
    );
  }, [allOrders, currentDistributor]);

  // Tab filtering
  const filteredOrders = useMemo(() => {
    let list = assignedOrders;

    if (activeTab === "assigned") {
      list = list.filter((o) => o.status === "Assigned" || o.status === "Pending" || o.status === "Processing");
    } else if (activeTab === "transit") {
      list = list.filter((o) => o.status === "Out for Delivery");
    } else if (activeTab === "delivered") {
      list = list.filter((o) => o.status === "Delivered");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.customer.city.toLowerCase().includes(q) ||
          o.customer.address.toLowerCase().includes(q)
      );
    }

    return list;
  }, [assignedOrders, activeTab, searchQuery]);

  // Key metrics
  const metrics = useMemo(() => {
    const total = assignedOrders.length;
    const pendingCount = assignedOrders.filter(
      (o) => o.status === "Assigned" || o.status === "Pending" || o.status === "Processing"
    ).length;
    const inTransitCount = assignedOrders.filter((o) => o.status === "Out for Delivery").length;
    const deliveredCount = assignedOrders.filter((o) => o.status === "Delivered").length;
    const rate = total > 0 ? Math.round((deliveredCount / total) * 100) : 100;

    const earningsTotal = assignedOrders
      .filter((o) => o.status === "Delivered")
      .reduce((acc, curr) => acc + (curr.deliveryFee || 2500), 0);

    return {
      total,
      pendingCount,
      inTransitCount,
      deliveredCount,
      rate,
      earningsTotal,
    };
  }, [assignedOrders]);

  // Action: Mark Out for Delivery
  const handleDepartHub = (orderId: string) => {
    markDistributorOrderOutForDelivery(orderId);
    showToast(`Order ${orderId} is now OUT FOR DELIVERY.`);
    if (selectedOrderForDetails?.id === orderId) {
      setSelectedOrderForDetails((prev) => (prev ? { ...prev, status: "Out for Delivery" } : null));
    }
  };

  // Action: Mark Processing
  const handleMarkProcessing = (orderId: string) => {
    markDistributorOrderProcessing(orderId);
    showToast(`Order ${orderId} moved to Processing / Hub Staging.`);
    if (selectedOrderForDetails?.id === orderId) {
      setSelectedOrderForDetails((prev) => (prev ? { ...prev, status: "Processing" } : null));
    }
  };

  // Action: Confirm Delivery Submit
  const handleConfirmDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDelivery) return;

    if (!recipientName.trim()) {
      alert("Please provide the recipient's name who received the package.");
      return;
    }

    setIsSubmittingDelivery(true);
    setTimeout(() => {
      markDistributorOrderDelivered(
        selectedOrderForDelivery.id,
        recipientName.trim(),
        deliveryNote.trim() || undefined
      );

      setIsSubmittingDelivery(false);
      showToast(`Order ${selectedOrderForDelivery.id} marked DELIVERED to ${recipientName}!`);
      setSelectedOrderForDelivery(null);
      setRecipientName("");
      setDeliveryNote("");
    }, 600);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#07080a] flex items-center justify-center text-neutral-400">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 animate-pulse text-emerald-400" />
          <span className="text-xs font-mono tracking-widest uppercase">Connecting to Logistics Mesh...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: UNAUTHENTICATED DISTRIBUTOR GATE
  // ==========================================
  if (!currentDistributor) {
    return (
      <div className="min-h-screen bg-[#060709] text-neutral-200 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
        {/* Top security header bar */}
        <header className="border-b border-[#14151b] bg-[#090a0e]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
            <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              PAX INTERNAL LOGISTICS • SECURE GATEWAY
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Direct Courier Access Only
          </span>
        </header>

        {/* Main login card */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
          <div className="w-full max-w-lg space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0d12] border border-[#1b1c24] shadow-2xl relative overflow-hidden">
              {/* Subtle glowing ambient gradient */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white uppercase">
                    Distributor Delivering Portal
                  </h1>
                  <p className="text-xs text-neutral-400 font-mono">
                    Restricted Area • Active Couriers & Fleet Partners
                  </p>
                </div>
              </div>

              {/* Customer Access Restriction Notice (PRD requirement) */}
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-amber-300 text-xs flex items-start gap-2.5 mb-6">
                <BadgeAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-1">
                  <span className="font-semibold block">Customer Buying Notice:</span>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed font-light">
                    This section is strictly reserved for authorized logistics distributors delivering orders.
                    Customers browsing or buying gadgets must use the{" "}
                    <Link href="/shop" className="underline font-medium text-white hover:text-emerald-400">
                      Customer Storefront
                    </Link>{" "}
                    or track purchases via{" "}
                    <Link href="/account" className="underline font-medium text-white hover:text-emerald-400">
                      My Account
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-xs flex items-center gap-2 mb-4 font-mono">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                    Distributor ID, Email or Phone *
                  </label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="e.g. DST-LAG-01 or adekunle@paxlogistics.ng"
                    className="w-full bg-[#111218] border border-[#22242f] text-sm text-neutral-100 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                    Security Passcode / PIN *
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter 4-digit PIN (Default: 1234)"
                    className="w-full bg-[#111218] border border-[#22242f] text-sm text-neutral-100 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,230,118,0.25)] min-h-[46px]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Authenticate Terminal Access
                </button>
              </form>

              {/* Demo Quick Connect options */}
              <div className="mt-6 pt-5 border-t border-[#181922]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase text-neutral-400">
                    Registered Distributor Accounts (Select to Connect)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">PIN: 1234</span>
                </div>

                <div className="space-y-2">
                  {availableDistributors.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleQuickDemoLogin(d)}
                      className="w-full p-2.5 rounded-xl bg-[#12131a] hover:bg-[#181a24] border border-[#1f202b] hover:border-emerald-500/50 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            {d.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c1e28] text-neutral-400">
                            {d.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {d.contactPerson} • {d.vehicleType} • {d.coverageArea}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-neutral-600 font-mono">
              PAX Gadgets Nigeria • Encrypted Operational Link: <code className="text-neutral-400">/distributordelivering</code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#14151b] px-6 py-4 text-center text-xs text-neutral-500 font-mono">
          Protected Administrative Route • Role: Logistics Distributor (PRD §3.3 & §4.3)
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED DISTRIBUTOR PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#07080a] text-neutral-200">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0b0e]/95 backdrop-blur-md border-b border-[#181922] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Terminal Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-white uppercase">
                  PAX LOGISTICS • DISTRIBUTOR HUB
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00e676]" />
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {currentDistributor.name} ({currentDistributor.id}) • {currentDistributor.vehicleType}
              </div>
            </div>
          </div>

          {/* Right Controls: Shift duty toggle & Logout */}
          <div className="flex items-center gap-3">
            {/* Shift duty button */}
            <button
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${isOnDuty
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
                : "bg-neutral-900 border-neutral-700 text-neutral-400"
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnDuty ? "bg-emerald-400" : "bg-neutral-500"}`} />
              <span>{isOnDuty ? "Status: ON DUTY" : "Status: STANDBY"}</span>
            </button>

            {/* Courier Profile Info */}
            <div className="hidden md:flex flex-col text-right text-xs">
              <span className="text-white font-medium">{currentDistributor.contactPerson}</span>
              <span className="text-[11px] text-neutral-500 font-mono">{currentDistributor.phone}</span>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#14151c] hover:bg-red-950/50 hover:text-red-400 border border-[#22242f] hover:border-red-800 text-neutral-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Coverage Area Banner */}
        <div className="p-4 rounded-xl bg-[#0d0e14] border border-[#1b1d26] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-neutral-300">
            <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-white">Active Operational Sector: </span>
              <span className="text-neutral-400">{currentDistributor.coverageArea}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-neutral-500 font-mono text-[11px]">
            <span>Fleet ID: {currentDistributor.id}</span>
            <span>•</span>
            <span>Lifetime Deliveries: {currentDistributor.completedDeliveries}</span>
          </div>
        </div>

        {/* KPI Performance Cards Bar (PRD §3.3) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Assigned / Pending Orders */}
          <div className="p-5 rounded-2xl bg-[#0d0e14] border border-[#1a1c24] relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Assigned Orders</span>
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{metrics.pendingCount}</div>
            <p className="text-[11px] text-neutral-500 mt-1">Staged & awaiting route departure</p>
          </div>

          {/* Card 2: Out for Delivery */}
          <div className="p-5 rounded-2xl bg-[#0d0e14] border border-[#1a1c24] relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">In Transit</span>
              <Truck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">{metrics.inTransitCount}</div>
            <p className="text-[11px] text-neutral-500 mt-1">Actively en route to customer</p>
          </div>

          {/* Card 3: Delivered Today */}
          <div className="p-5 rounded-2xl bg-[#0d0e14] border border-[#1a1c24] relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Delivered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{metrics.deliveredCount}</div>
            <p className="text-[11px] text-neutral-500 mt-1">Successfully signed & verified</p>
          </div>

          {/* Card 4: Fulfill Rate & Remittance */}
          <div className="p-5 rounded-2xl bg-[#0d0e14] border border-[#1a1c24] relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Earned Remittance</span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {formatPrice(metrics.earningsTotal)}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1 font-mono">Fulfillment rate: {metrics.rate}%</p>
          </div>
        </div>

        {/* Filter Tabs & Search Controls */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0d12] border border-[#1a1b23] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#12131a] border border-[#1f202b]">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "all"
                  ? "bg-white text-black shadow"
                  : "text-neutral-400 hover:text-white"
                  }`}
              >
                All Assigned ({assignedOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("assigned")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "assigned"
                  ? "bg-amber-400 text-black shadow"
                  : "text-neutral-400 hover:text-amber-400"
                  }`}
              >
                Pending ({metrics.pendingCount})
              </button>
              <button
                onClick={() => setActiveTab("transit")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "transit"
                  ? "bg-cyan-400 text-black shadow"
                  : "text-neutral-400 hover:text-cyan-400"
                  }`}
              >
                Out for Delivery ({metrics.inTransitCount})
              </button>
              <button
                onClick={() => setActiveTab("delivered")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "delivered"
                  ? "bg-emerald-400 text-black shadow"
                  : "text-neutral-400 hover:text-emerald-400"
                  }`}
              >
                Delivered ({metrics.deliveredCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, customer, phone, address..."
                className="w-full bg-[#12131a] border border-[#21232e] text-xs text-neutral-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-400 font-mono transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Assigned Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0c0d12] border border-[#1a1b23] space-y-3">
            <Package className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Assigned Orders in this View</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              There are currently no orders matching the filter for your courier terminal. When new orders are placed or
              assigned, they will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isDelivered = order.status === "Delivered";
              const isOutForDelivery = order.status === "Out for Delivery";
              const isPending = order.status === "Assigned" || order.status === "Pending" || order.status === "Processing";

              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${order.customer.address}, ${order.customer.city}, ${order.customer.state}, Nigeria`
              )}`;

              const cleanPhone = order.customer.phone.replace(/[^0-9+]/g, "");
              const whatsappGreeting = encodeURIComponent(
                `Hello ${order.customer.fullName}, this is ${currentDistributor.contactPerson} from ${currentDistributor.name} (PAX Logistics). I am handling your delivery for Order Ref ${order.id}.`
              );
              const whatsappUrl = `https://wa.me/${cleanPhone.replace("+", "")}?text=${whatsappGreeting}`;

              return (
                <div
                  key={order.id}
                  className={`p-5 sm:p-6 rounded-2xl bg-[#0c0d12] border transition-all ${isOutForDelivery
                    ? "border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                    : isDelivered
                      ? "border-emerald-950/60 opacity-90"
                      : "border-[#1b1c25] hover:border-[#272935]"
                    }`}
                >
                  {/* Top Bar: Order ID, Date & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#181922] gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold font-mono text-white">{order.id}</span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })},{" "}
                        {new Date(order.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDelivered
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : isOutForDelivery
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse"
                            : "bg-amber-950/80 text-amber-400 border border-amber-800/80"
                          }`}
                      >
                        {isDelivered && <Check className="w-3 h-3" />}
                        {isOutForDelivery && <Truck className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        {order.status}
                      </span>

                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#161720] text-neutral-400 border border-[#232532]">
                        {order.paymentStatus === "Paid" ? "Prepaid Order" : "Payment Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Middle Section: Customer & Delivery Address Grid */}
                  <div className="py-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Left side: Customer Destination */}
                    <div className="lg:col-span-7 space-y-3">
                      <div>
                        <div className="text-[11px] font-mono uppercase text-neutral-500">Recipient Information</div>
                        <div className="text-base font-bold text-white mt-0.5">{order.customer.fullName}</div>
                        <div className="text-xs text-neutral-400 font-mono mt-0.5">{order.customer.email}</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#101117] border border-[#1b1c24] space-y-1.5 text-xs">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-neutral-200 font-medium leading-relaxed">
                              {order.customer.address}
                            </div>
                            <div className="text-neutral-400 font-mono text-[11px]">
                              {order.customer.city}, {order.customer.state}
                            </div>
                          </div>
                        </div>

                        {order.customer.instructions && (
                          <div className="mt-2 pt-2 border-t border-[#181922] text-[11px] text-amber-300/90 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                            <span>
                              <strong>Special Instruction:</strong> {order.customer.instructions}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick Contact & Navigation Triggers */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="px-3 py-2 rounded-xl bg-[#14161f] hover:bg-[#1f212e] border border-[#242634] text-xs font-mono text-neutral-200 flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Call: {order.customer.phone}</span>
                        </a>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-[#14161f] hover:bg-[#1f212e] border border-[#242634] text-xs font-mono text-neutral-200 flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-[#14161f] hover:bg-[#1f212e] border border-[#242634] text-xs font-mono text-cyan-400 flex items-center gap-1.5 transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>GPS Route Map</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      </div>
                    </div>

                    {/* Right side: Package Contents & Pricing */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="text-[11px] font-mono uppercase text-neutral-500">Package Contents</div>
                      <div className="space-y-2 p-3.5 rounded-xl bg-[#101117] border border-[#1b1c24]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            <div className="relative w-10 h-10 rounded-lg bg-[#07080a] border border-[#1e2029] p-1 flex-shrink-0">
                              <Image
                                src={item.heroImage || "/assets/products/powerbank-hero.png"}
                                alt={item.name}
                                fill
                                sizes="40px"
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium truncate">{item.name}</div>
                              <div className="text-[11px] text-neutral-500 font-mono">
                                Qty: <strong className="text-emerald-400">{item.quantity}</strong> unit(s) •{" "}
                                {item.category}
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2 border-t border-[#181922] flex items-center justify-between text-xs">
                          <span className="text-neutral-500 font-mono">Order Value:</span>
                          <span className="text-white font-bold font-mono">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>

                      {/* Lithium Battery Safety Warning */}
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0d0e13] border border-[#191a22] text-[11px] text-neutral-400 font-mono">
                        <BatteryCharging className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>High-capacity lithium gadget. Handle with care, keep dry.</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-[#181922] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-[11px] font-mono text-neutral-500">
                      {isDelivered && (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Delivered & Closed
                        </span>
                      )}
                      {isOutForDelivery && (
                        <span className="text-cyan-400 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5" />
                          Delivery in progress — courier active on route
                        </span>
                      )}
                      {isPending && (
                        <span className="text-amber-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Ready for dispatch pickup at regional hub
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* View full docket button */}
                      <button
                        onClick={() => setSelectedOrderForDetails(order)}
                        className="px-3.5 py-2 rounded-xl bg-[#14151e] hover:bg-[#1b1c28] border border-[#212330] text-xs font-mono text-neutral-300 transition-colors"
                      >
                        Inspect Docket
                      </button>

                      {/* Flow Step 1: Start Route */}
                      {isPending && (
                        <button
                          onClick={() => handleDepartHub(order.id)}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          Depart Hub (Out for Delivery)
                        </button>
                      )}

                      {/* Flow Step 2: Mark Delivered Modal Trigger */}
                      {isOutForDelivery && (
                        <button
                          onClick={() => {
                            setSelectedOrderForDelivery(order);
                            setRecipientName(order.customer.fullName);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,230,118,0.25)]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirm Package Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ================================================= */}
      {/* MODAL 1: CONFIRM DELIVERY DIALOG (PRD §3.3 & §4.3) */}
      {/* ================================================= */}
      {selectedOrderForDelivery && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c0d12] border border-[#222432] rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrderForDelivery(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Delivery Handover</h3>
                <p className="text-xs text-neutral-400 font-mono">Order {selectedOrderForDelivery.id}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111218] border border-[#1e202a] text-xs space-y-1 font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Customer Destination:</span>
                <span className="text-white font-semibold">{selectedOrderForDelivery.customer.fullName}</span>
              </div>
              <div className="text-[11px] text-neutral-500 truncate">
                {selectedOrderForDelivery.customer.address}, {selectedOrderForDelivery.customer.city}
              </div>
            </div>

            <form onSubmit={handleConfirmDeliverySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  Recipient Name (Person who received package) *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Daniel Tech (Self), or Security Gate Guard"
                  required
                  className="w-full bg-[#12131a] border border-[#21232e] text-neutral-100 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-400 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">Delivery Notes / Handover Remark</label>
                <textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Handed directly to customer at front desk. Signed delivery slip."
                  rows={3}
                  className="w-full bg-[#12131a] border border-[#21232e] text-neutral-100 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-400 font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDelivery(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#15161f] border border-[#222430] text-neutral-400 hover:text-white font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDelivery || !recipientName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
                >
                  {isSubmittingDelivery ? "Recording Delivery..." : "Submit Delivery Proof"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MODAL 2: ORDER DOCKET INSPECTION MODAL            */}
      {/* ================================================= */}
      {selectedOrderForDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0c0d12] border border-[#222432] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrderForDetails(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-[#181922] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400">Official Delivery Docket</span>
                <h2 className="text-xl font-black text-white mt-0.5">{selectedOrderForDetails.id}</h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#141620] border border-[#262838] text-white">
                {selectedOrderForDetails.status}
              </span>
            </div>

            {/* Recipient & Courier Logistics Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#111218] border border-[#1e202a] space-y-1.5">
                <div className="text-neutral-500 uppercase text-[10px]">Customer Destination</div>
                <div className="text-white font-bold text-sm">{selectedOrderForDetails.customer.fullName}</div>
                <div className="text-neutral-300">{selectedOrderForDetails.customer.phone}</div>
                <div className="text-neutral-400 leading-relaxed pt-1">
                  {selectedOrderForDetails.customer.address}, {selectedOrderForDetails.customer.city},{" "}
                  {selectedOrderForDetails.customer.state}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111218] border border-[#1e202a] space-y-1.5">
                <div className="text-neutral-500 uppercase text-[10px]">Assigned Dispatch Partner</div>
                <div className="text-white font-bold text-sm">
                  {selectedOrderForDetails.assignedDistributorName || currentDistributor.name}
                </div>
                <div className="text-neutral-300">Courier ID: {currentDistributor.id}</div>
                <div className="text-neutral-400">Vehicle Type: {currentDistributor.vehicleType}</div>
                <div className="text-emerald-400 pt-1">Sector: {currentDistributor.coverageArea}</div>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-neutral-500">Manifest Items Breakdown</div>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {selectedOrderForDetails.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#111218] border border-[#1e202a] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-[#07080a] border border-[#222432] p-1 flex-shrink-0">
                        <Image
                          src={it.heroImage || "/assets/products/powerbank-hero.png"}
                          alt={it.name}
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{it.name}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          {it.category} • Quantity: <strong className="text-white">{it.quantity}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-neutral-300">{formatPrice(it.price * it.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#090a0d] border border-[#1a1b24] flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Total Invoice Amount:</span>
                <span className="text-emerald-400 font-bold">{formatPrice(selectedOrderForDetails.totalAmount)}</span>
              </div>
            </div>

            {/* Quick Status Modifiers */}
            <div className="pt-2 border-t border-[#181922] flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-neutral-500 font-mono">
                Operational Terminal: {currentDistributor.name}
              </div>

              <div className="flex items-center gap-2">
                {selectedOrderForDetails.status !== "Out for Delivery" &&
                  selectedOrderForDetails.status !== "Delivered" && (
                    <button
                      onClick={() => handleDepartHub(selectedOrderForDetails.id)}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase"
                    >
                      Set Out for Delivery
                    </button>
                  )}

                {selectedOrderForDetails.status !== "Delivered" && (
                  <button
                    onClick={() => {
                      setSelectedOrderForDelivery(selectedOrderForDetails);
                      setRecipientName(selectedOrderForDetails.customer.fullName);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase"
                  >
                    Mark Delivered
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrderForDetails(null)}
                  className="px-3.5 py-2 rounded-xl bg-[#161822] text-neutral-300 text-xs font-mono"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
