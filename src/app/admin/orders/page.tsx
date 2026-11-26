"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Search,
  Filter,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Eye,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  User,
  X,
  FileText,
  AlertCircle,
  Send,
} from "lucide-react";
import {
  getOrders,
  getDistributors,
  updateOrderStatus,
  assignOrderDistributor,
} from "@/lib/adminStore";
import { Order, OrderStatus, Distributor } from "@/types";
import { formatPrice } from "@/lib/utils";

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Assigned",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function OrdersContent() {
  const searchParams = useSearchParams();
  const initialOpenId = searchParams.get("open") || "";
  const initialStatusFilter = (searchParams.get("status") as OrderStatus) || "All";

  const [orders, setOrders] = useState<Order[]>(() => getOrders());
  const [distributors, setDistributors] = useState<Distributor[]>(() => getDistributors());
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatusFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (!initialOpenId) return null;
    return getOrders().find((o) => o.id === initialOpenId) || null;
  });

  // Form states inside order modal
  const [editStatus, setEditStatus] = useState<OrderStatus>(() => {
    if (!initialOpenId) return "Pending";
    const match = getOrders().find((o) => o.id === initialOpenId);
    return match ? match.status : "Pending";
  });
  const [editDistributorId, setEditDistributorId] = useState<string>(() => {
    if (!initialOpenId) return "";
    const match = getOrders().find((o) => o.id === initialOpenId);
    return match?.assignedDistributorId || "";
  });
  const [editNote, setEditNote] = useState<string>("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");

  const openOrderModal = (order: Order) => {
    setActiveOrder(order);
    setEditStatus(order.status);
    setEditDistributorId(order.assignedDistributorId || "");
    setEditNote("");
    setSaveSuccessMsg("");
  };

  useEffect(() => {
    const handleUpdate = () => {
      setOrders(getOrders());
      setDistributors(getDistributors());
    };

    window.addEventListener("pax_admin_store_updated", handleUpdate);
    return () => window.removeEventListener("pax_admin_store_updated", handleUpdate);
  }, []);

  const handleSaveChanges = () => {
    if (!activeOrder) return;

    let updated = false;

    // Status update
    if (editStatus !== activeOrder.status) {
      updateOrderStatus(activeOrder.id, editStatus, editNote || undefined);
      updated = true;
    }

    // Distributor assignment
    if (editDistributorId !== (activeOrder.assignedDistributorId || "")) {
      const selectedDist = distributors.find((d) => d.id === editDistributorId);
      if (selectedDist) {
        assignOrderDistributor(activeOrder.id, selectedDist.id, selectedDist.name);
        updated = true;
      }
    }

    if (updated || editNote) {
      const allUpdated = getOrders();
      const refetched = allUpdated.find((o) => o.id === activeOrder.id);
      if (refetched) {
        setActiveOrder(refetched);
      }
      setSaveSuccessMsg("Order successfully updated!");
      setTimeout(() => setSaveSuccessMsg(""), 3000);
    }
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customer.fullName.toLowerCase().includes(q) ||
      order.customer.phone.toLowerCase().includes(q) ||
      order.customer.city.toLowerCase().includes(q) ||
      order.customer.state.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#181a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <span>PRD Section 3.2 & 5.5</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Order Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track orders, update customer delivery stages, and assign partner distributors.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 bg-[#0e1017] px-3.5 py-2 rounded-xl border border-[#1b1e2a]">
          <Package className="w-4 h-4 text-emerald-400" />
          <span>{orders.length} Total Orders</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, customer, phone, city..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0e1017] border border-[#1e2230] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
          />
        </div>

        {/* Status Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedStatus("All")}
            className={`px-3 py-1.5 rounded-lg font-mono font-medium whitespace-nowrap transition-colors ${selectedStatus === "All"
                ? "bg-white text-black font-bold"
                : "bg-[#0e1017] text-neutral-400 hover:text-white border border-[#1c1f2b]"
              }`}
          >
            All ({orders.length})
          </button>
          {ORDER_STATUSES.map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-mono whitespace-nowrap transition-colors flex items-center gap-1.5 ${isSelected
                    ? "bg-emerald-500 text-black font-bold"
                    : "bg-[#0e1017] text-neutral-400 hover:text-white border border-[#1c1f2b]"
                  }`}
              >
                <span>{status}</span>
                <span className="text-[10px] opacity-75 font-bold">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#0c0d12] border border-[#1b1d27] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101218] border-b border-[#1a1d28] font-mono text-neutral-400 uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Customer & Contact</th>
                <th className="px-5 py-3.5">Destination</th>
                <th className="px-5 py-3.5">Items Ordered</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Distributor</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171922]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-neutral-500 font-mono">
                    No orders match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => openOrderModal(order)}
                    className="hover:bg-[#12141d] transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-white group-hover:text-emerald-400">
                      {order.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{order.customer.fullName}</div>
                      <div className="font-mono text-[11px] text-neutral-400">{order.customer.phone}</div>
                      <div className="text-[10px] text-neutral-500">{order.customer.email}</div>
                    </td>
                    <td className="px-5 py-4 text-neutral-300">
                      <div>{order.customer.city}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{order.customer.state}</div>
                    </td>
                    <td className="px-5 py-4 text-neutral-300">
                      <div className="font-medium text-white">
                        {order.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-white">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-mono font-semibold border ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono">
                      {order.assignedDistributorName ? (
                        <span className="text-neutral-200 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{order.assignedDistributorName}</span>
                        </span>
                      ) : (
                        <span className="text-amber-400/90 text-[11px] italic bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/30">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-[#151722] group-hover:bg-emerald-500 group-hover:text-black border border-[#262a3b] text-neutral-200 text-xs font-medium transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Management Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0d0f15] border border-[#202433] rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1b1e2a] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
                    Order Telemetry
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadgeClass(activeOrder.status)}`}>
                    {activeOrder.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1 font-mono">
                  {activeOrder.id}
                </h2>
                <div className="text-xs text-neutral-500 font-mono mt-0.5">
                  Placed on {new Date(activeOrder.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => setActiveOrder(null)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-[#161822] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <div className="mt-6 space-y-6 text-xs">
              {/* Customer Information (PRD §3.2) */}
              <div className="p-4 rounded-2xl bg-[#11131a] border border-[#1b1e2b] space-y-3">
                <div className="font-bold text-white font-mono uppercase text-[11px] text-neutral-400 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customer & Delivery Destination</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-neutral-500 font-mono text-[10px]">Full Name</div>
                    <div className="text-sm font-semibold text-white">{activeOrder.customer.fullName}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 font-mono text-[10px]">Phone Number</div>
                    <div className="text-sm font-semibold text-white font-mono">{activeOrder.customer.phone}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 font-mono text-[10px]">Email</div>
                    <div className="text-neutral-300 font-mono">{activeOrder.customer.email}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 font-mono text-[10px]">Destination City / State</div>
                    <div className="text-neutral-300 font-semibold">{activeOrder.customer.city}, {activeOrder.customer.state}</div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 font-mono text-[10px]">Street Address</div>
                  <div className="text-neutral-200 mt-0.5">{activeOrder.customer.address}</div>
                </div>
                {activeOrder.customer.instructions && (
                  <div className="p-2.5 rounded-lg bg-[#161822] text-amber-300/90 text-[11px] border border-amber-900/30">
                    <span className="font-bold">Instructions: </span>
                    {activeOrder.customer.instructions}
                  </div>
                )}
              </div>

              {/* Line Items (PRD §5.5) */}
              <div className="p-4 rounded-2xl bg-[#11131a] border border-[#1b1e2b] space-y-3">
                <div className="font-bold text-white font-mono uppercase text-[11px] text-neutral-400 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Products Ordered</span>
                </div>
                <div className="divide-y divide-[#181a24]">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white text-xs">{item.name}</div>
                        <div className="text-neutral-500 font-mono text-[11px]">
                          Category: {item.category} • Quantity: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-white">{formatPrice(item.price * item.quantity)}</div>
                        <div className="text-[10px] text-neutral-500">{formatPrice(item.price)} each</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#181a24] space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(activeOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Delivery Dispatch Fee</span>
                    <span>{formatPrice(activeOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold text-sm pt-1 border-t border-[#1a1d28]">
                    <span>Total Settled</span>
                    <span>{formatPrice(activeOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Administrative Actions & Assignment (PRD §3.2 & §4.2) */}
              <div className="p-4 rounded-2xl bg-[#11131a] border border-[#1b1e2b] space-y-4">
                <div className="font-bold text-white font-mono uppercase text-[11px] text-emerald-400 flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Update Status & Assign Distributor</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1.5">
                      Order Fulfillment Status (PRD §5.5)
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#161822] border border-[#232738] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Distributor Dropdown */}
                  <div>
                    <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1.5">
                      Assign Delivery Distributor (PRD §4.2)
                    </label>
                    <select
                      value={editDistributorId}
                      onChange={(e) => setEditDistributorId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#161822] border border-[#232738] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">-- No Distributor Assigned --</option>
                      {distributors.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {dist.name} ({dist.coverageArea})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Internal Admin Note */}
                <div>
                  <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1.5">
                    Internal Dispatch Notes / Tracking Details
                  </label>
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="e.g. Dispatched with tracking slip #7492; gate access authorized"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#161822] border border-[#232738] text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                  {activeOrder.notes && (
                    <div className="mt-1 text-[11px] text-neutral-500 font-mono">
                      Current notes: {activeOrder.notes}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveOrder(null)}
                    className="px-4 py-2 rounded-xl bg-[#151722] hover:bg-[#1e202e] text-neutral-300 font-mono text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono shadow-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-neutral-400 font-mono text-xs">
          Loading Order Management Console...
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
