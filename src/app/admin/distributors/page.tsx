"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  Package,
  Activity,
  UserCheck,
  ShieldCheck,
  Navigation,
} from "lucide-react";
import {
  getDistributors,
  addDistributor,
  updateDistributor,
  getOrders,
} from "@/lib/adminStore";
import { Distributor, DistributorStatus, DistributorVehicle, Order } from "@/types";

const VEHICLE_OPTIONS: DistributorVehicle[] = [
  "Motorbike",
  "Van",
  "Fleet",
  "Express Courier",
];

export default function AdminDistributorsPage() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    coverageArea: "",
    vehicleType: "Motorbike" as DistributorVehicle,
    status: "Active" as DistributorStatus,
  });

  const [notification, setNotification] = useState("");

  const loadData = () => {
    setDistributors(getDistributors());
    setOrders(getOrders());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      setDistributors(getDistributors());
      setOrders(getOrders());
    };
    window.addEventListener("pax_admin_store_updated", handleUpdate);
    return () => window.removeEventListener("pax_admin_store_updated", handleUpdate);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      contactPerson: "",
      phone: "+234 ",
      email: "",
      coverageArea: "Lagos (Mainland, Ikeja)",
      vehicleType: "Motorbike",
      status: "Active",
    });
    setIsAddModalOpen(true);
  };

  const handleCreateDistributor = (e: React.FormEvent) => {
    e.preventDefault();

    const created = addDistributor({
      name: formData.name,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      coverageArea: formData.coverageArea,
      vehicleType: formData.vehicleType,
      status: formData.status,
    });

    showNotification(`Distributor "${created.name}" registered successfully.`);
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (distId: string, currentStatus: DistributorStatus) => {
    const nextStatus: DistributorStatus =
      currentStatus === "Active" ? "Standby" : "Active";
    updateDistributor(distId, { status: nextStatus });
    showNotification(`Distributor status changed to ${nextStatus}.`);
  };

  const filteredDistributors = distributors.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.contactPerson.toLowerCase().includes(q) ||
      d.coverageArea.toLowerCase().includes(q) ||
      d.phone.toLowerCase().includes(q)
    );
  });

  const activeCount = distributors.filter((d) => d.status === "Active").length;
  const totalCompleted = distributors.reduce((sum, d) => sum + d.completedDeliveries, 0);
  const totalActiveAssigned = distributors.reduce((sum, d) => sum + d.activeOrdersCount, 0);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#181a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
            <span>PRD Section 3.2, 3.3 & 4.3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Distributor Network
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Registered courier agents, regional coverage zones, and assigned delivery activity.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Distributor</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c0d12] border border-[#1b1d27]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Registered Partners</span>
            <Truck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 text-2xl font-black text-white">{distributors.length}</div>
          <div className="mt-1 text-[11px] font-mono text-emerald-400">
            {activeCount} Active on Dispatch
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0d12] border border-[#1b1d27]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>In-Flight Assigned</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 text-2xl font-black text-white">{totalActiveAssigned}</div>
          <div className="mt-1 text-[11px] font-mono text-cyan-400">
            Active Packages on Road
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0d12] border border-[#1b1d27]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Total Fulfilled Deliveries</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-2xl font-black text-white">{totalCompleted}</div>
          <div className="mt-1 text-[11px] font-mono text-neutral-400">
            Recorded Completed Shipments
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search distributor name, contact, area..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0e1017] border border-[#1e2230] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 font-mono transition-colors"
        />
      </div>

      {/* Distributors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDistributors.map((dist) => {
          const assignedOrders = orders.filter((o) => o.assignedDistributorId === dist.id);

          return (
            <div
              key={dist.id}
              className="p-6 rounded-2xl bg-[#0c0d12] border border-[#1b1d27] space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white uppercase">
                      {dist.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        dist.status === "Active"
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/60"
                          : "bg-neutral-800 text-neutral-400 border-neutral-700"
                      }`}
                    >
                      {dist.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{dist.coverageArea}</span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-[#141620] border border-[#222533] text-[11px] font-mono text-purple-300">
                  {dist.vehicleType}
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#171922] text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Contact:</span>
                  <span className="text-white font-medium">{dist.contactPerson}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-neutral-500" />
                  <span>{dist.phone}</span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 text-neutral-500" />
                  <span className="text-neutral-400">{dist.email}</span>
                </div>
              </div>

              {/* Stats badges */}
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-neutral-500 text-[10px] block">Active Deliveries</span>
                    <span className="text-cyan-400 font-bold text-sm">
                      {assignedOrders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length} orders
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">Completed Total</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {dist.completedDeliveries} delivered
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(dist.id, dist.status)}
                    className="px-3 py-1.5 rounded-lg bg-[#151722] hover:bg-[#1e202e] border border-[#252838] text-xs font-mono text-neutral-300 hover:text-white transition-colors"
                  >
                    Set {dist.status === "Active" ? "Standby" : "Active"}
                  </button>
                  <button
                    onClick={() => setSelectedDistributor(dist)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-mono font-medium transition-colors"
                  >
                    Activity
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Distributor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d0f15] border border-[#202433] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1b1e2a] pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-purple-400 font-bold">
                  Logistics Network
                </span>
                <h2 className="text-xl font-bold text-white mt-1">Register Delivery Partner</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDistributor} className="mt-6 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                  Company / Agency Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Cargo Couriers"
                  className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Contact Officer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Samuel Eze"
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Direct Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                  Email Dispatch Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="dispatch@apexcourier.ng"
                  className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                  Coverage Area / Corridor (PRD §3.2) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.coverageArea}
                  onChange={(e) => setFormData({ ...formData, coverageArea: e.target.value })}
                  placeholder="e.g. Lagos (Ikeja, Maryland, Anthony, Magodo)"
                  className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicleType: e.target.value as DistributorVehicle,
                      })
                    }
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 font-sans"
                  >
                    {VEHICLE_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase text-[10px] mb-1">
                    Operational Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as DistributorStatus,
                      })
                    }
                    className="w-full px-3 py-2.5 bg-[#141620] border border-[#232738] rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 font-sans"
                  >
                    <option value="Active">Active</option>
                    <option value="Standby">Standby</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#1b1e2a]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#141620] hover:bg-[#1e202e] text-neutral-300 font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono shadow-lg transition-colors"
                >
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Distributor Activity Modal */}
      {selectedDistributor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d0f15] border border-[#202433] rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1b1e2a] pb-4">
              <div>
                <span className="font-mono text-xs uppercase text-purple-400 font-bold">
                  Distributor Activity Log (PRD §3.2)
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  {selectedDistributor.name}
                </h2>
                <div className="text-xs text-neutral-500 font-mono">
                  {selectedDistributor.coverageArea}
                </div>
              </div>
              <button
                onClick={() => setSelectedDistributor(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-xs font-mono uppercase text-neutral-400">
                Assigned Orders on Dispatch
              </h3>
              {orders.filter((o) => o.assignedDistributorId === selectedDistributor.id).length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-neutral-500 bg-[#12141c] rounded-xl border border-[#1d202b]">
                  No orders currently assigned to this distributor.
                </div>
              ) : (
                orders
                  .filter((o) => o.assignedDistributorId === selectedDistributor.id)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl bg-[#12141c] border border-[#1e212d] text-xs font-mono flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">{order.id}</div>
                        <div className="text-neutral-400 text-[11px]">
                          {order.customer.fullName} • {order.customer.city}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#1b1e2a] flex justify-end">
              <button
                onClick={() => setSelectedDistributor(null)}
                className="px-4 py-2 rounded-xl bg-[#141620] hover:bg-[#1e202e] text-neutral-300 font-mono text-xs"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
