"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  Boxes,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import {
  getOrders,
  getDashboardOverviewStats,
  getDistributors,
  updateOrderStatus,
} from "@/lib/adminStore";
import { Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(() => getDashboardOverviewStats());
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = () => {
    setIsRefreshing(true);
    setStats(getDashboardOverviewStats());
    const all = getOrders();
    setRecentOrders(all.slice(0, 6));
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      setStats(getDashboardOverviewStats());
      setRecentOrders(getOrders().slice(0, 6));
    };

    window.addEventListener("pax_admin_store_updated", handleUpdate);
    return () => window.removeEventListener("pax_admin_store_updated", handleUpdate);
  }, []);

  const handleQuickStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-950/80 text-amber-300 border-amber-800/60";
      case "Confirmed":
      case "Processing":
        return "bg-cyan-950/80 text-cyan-300 border-cyan-800/60";
      case "Assigned":
      case "Out for Delivery":
        return "bg-blue-950/80 text-blue-300 border-blue-800/60";
      case "Delivered":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-800/60";
      case "Cancelled":
        return "bg-red-950/80 text-red-300 border-red-800/60";
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#181a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Store Operations Live Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Dashboard Overview
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time telemetry, incoming orders, and logistics distributor tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13151d] hover:bg-[#1a1d28] border border-[#222533] text-xs font-mono text-neutral-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-[0_0_15px_rgba(0,230,118,0.2)]"
          >
            <span>Process Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Alert banner if there are pending orders */}
      {stats.pendingOrders > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/50 via-[#15130f] to-[#121319] border border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-200">
                {stats.pendingOrders} Incoming Order{stats.pendingOrders > 1 ? "s" : ""} Requiring Attention
              </div>
              <div className="text-xs text-amber-300/70">
                New customer orders submitted that require admin status update and distributor assignment.
              </div>
            </div>
          </div>
          <Link
            href="/admin/orders?status=Pending"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl self-start sm:self-auto transition-colors shrink-0"
          >
            View Pending Orders
          </Link>
        </div>
      )}

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl bg-[#0c0d12] border border-[#1b1d27] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-2xl font-black text-white tracking-tight">
            {formatPrice(stats.totalRevenue)}
          </div>
          <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <span>Paid Customer Settlements</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-2xl bg-[#0c0d12] border border-[#1b1d27] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Total Orders
            </span>
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-2xl font-black text-white tracking-tight">
            {stats.totalOrders}
          </div>
          <div className="mt-2 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
            <span className="text-emerald-400">{stats.completedOrders} Delivered</span>
            <span>•</span>
            <span className="text-amber-400">{stats.pendingOrders} Pending</span>
          </div>
        </div>

        {/* In-Transit Deliveries */}
        <div className="p-6 rounded-2xl bg-[#0c0d12] border border-[#1b1d27] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Deliveries In-Flight
            </span>
            <div className="p-2 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-2xl font-black text-white tracking-tight">
            {stats.inTransitOrders}
          </div>
          <div className="mt-2 text-[11px] font-mono text-blue-400">
            {stats.activeDistributors} Active Logistics Partners
          </div>
        </div>

        {/* Catalog Stock Units */}
        <div className="p-6 rounded-2xl bg-[#0c0d12] border border-[#1b1d27] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Inventory Stock
            </span>
            <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-2xl font-black text-white tracking-tight">
            {stats.totalStockUnits} <span className="text-xs font-normal text-neutral-400">units</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-purple-400">
            Across {stats.totalProductsCount} Catalog Items
          </div>
        </div>
      </div>

      {/* Order Status Breakdown Bar */}
      <div className="p-6 rounded-2xl bg-[#0c0d12] border border-[#1b1d27] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Order Status Distribution (PRD §5.5)
          </h2>
          <span className="text-xs text-neutral-500 font-mono">
            {stats.totalOrders} total recorded customer orders
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[#11131a] border border-[#1c1f2b]">
            <div className="text-[11px] font-mono text-amber-400">Pending</div>
            <div className="text-lg font-bold text-white mt-1">{stats.pendingOrders}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#11131a] border border-[#1c1f2b]">
            <div className="text-[11px] font-mono text-cyan-400">Processing</div>
            <div className="text-lg font-bold text-white mt-1">{stats.processingOrders}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#11131a] border border-[#1c1f2b]">
            <div className="text-[11px] font-mono text-blue-400">In Transit</div>
            <div className="text-lg font-bold text-white mt-1">{stats.inTransitOrders}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#11131a] border border-[#1c1f2b]">
            <div className="text-[11px] font-mono text-emerald-400">Delivered</div>
            <div className="text-lg font-bold text-white mt-1">{stats.completedOrders}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#11131a] border border-[#1c1f2b]">
            <div className="text-[11px] font-mono text-red-400">Cancelled</div>
            <div className="text-lg font-bold text-white mt-1">{stats.cancelledOrders}</div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl bg-[#0c0d12] border border-[#1b1d27] overflow-hidden">
        <div className="p-5 border-b border-[#181a24] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Customer Orders</h2>
            <p className="text-xs text-neutral-400">Latest orders submitted by storefront shoppers.</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All ({stats.totalOrders})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101218] border-b border-[#1a1d28] font-mono text-neutral-400 uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Reference</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Destination</th>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Distributor</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171922]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#11131b] transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-white">
                    {order.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{order.customer.fullName}</div>
                    <div className="font-mono text-[11px] text-neutral-500">{order.customer.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-neutral-300">
                    <div>{order.customer.city}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{order.customer.state}</div>
                  </td>
                  <td className="px-5 py-4 text-neutral-300">
                    <span className="font-semibold text-white">{order.items[0]?.quantity}x</span>{" "}
                    {order.items[0]?.name.slice(0, 24)}...
                    {order.items.length > 1 && (
                      <span className="text-neutral-500 text-[10px] ml-1 font-mono">
                        +{order.items.length - 1} more
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-white">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-[11px] font-mono font-semibold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono">
                    {order.assignedDistributorName ? (
                      <span className="text-neutral-300 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-cyan-400" />
                        {order.assignedDistributorName.slice(0, 16)}
                      </span>
                    ) : (
                      <span className="text-amber-400/80 text-[11px] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/orders?open=${order.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#151722] hover:bg-[#1f2232] border border-[#262a3b] text-neutral-200 text-xs font-medium transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          href="/admin/orders"
          className="p-5 rounded-2xl bg-[#0c0d12] hover:bg-[#12141c] border border-[#1b1d27] transition-all group flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              PRD §3.2 & §4.2
            </div>
            <div className="text-base font-bold text-white mt-1 group-hover:text-emerald-300">
              Order Management
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Update 7 statuses, view customer info, and assign deliveries.
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/products"
          className="p-5 rounded-2xl bg-[#0c0d12] hover:bg-[#12141c] border border-[#1b1d27] transition-all group flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              PRD §3.2 & §5.1
            </div>
            <div className="text-base font-bold text-white mt-1 group-hover:text-cyan-300">
              Product Catalogue
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Add new power banks, manage prices, stock, and availability.
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/distributors"
          className="p-5 rounded-2xl bg-[#0c0d12] hover:bg-[#12141c] border border-[#1b1d27] transition-all group flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider">
              PRD §3.2 & §4.3
            </div>
            <div className="text-base font-bold text-white mt-1 group-hover:text-purple-300">
              Distributor Network
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Register couriers, view coverage zones, and track active deliveries.
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
