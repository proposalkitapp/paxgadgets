"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Bell,
  RefreshCw,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { brandConfig } from "@/config/brand";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, isLoading, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render children directly without the dashboard chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // If client loads a protected admin page and auth finished loading with no user, force to login
    if (!isLoading && !adminUser && !isLoginPage) {
      router.replace("/admin/login?unauthorized=1");
    }
  }, [adminUser, isLoading, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090c] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
        <div className="font-mono text-xs text-neutral-400">Verifying administrative security credentials...</div>
      </div>
    );
  }

  if (!adminUser) {
    return null; // Will redirect in useEffect
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: Package },
    { label: "Products", href: "/admin/products", icon: Boxes },
    { label: "Distributors", href: "/admin/distributors", icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-neutral-100 flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-black">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-[#0b0c10] border-r border-[#1a1c24] shrink-0 sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#181a22]">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-[0.2em] text-white uppercase">
              {brandConfig.wordmark}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#00e676]" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50 text-emerald-400">
              Admin
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 mt-1 flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>Store Operations Hub</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(0,230,118,0.25)] font-bold"
                    : "text-neutral-400 hover:text-white hover:bg-[#13151c]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-neutral-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Storefront Link & Sign Out Footer */}
        <div className="p-4 border-t border-[#181a22] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-neutral-400 hover:text-white hover:bg-[#13151c] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              <span>Customer Store</span>
            </span>
            <span className="text-[10px] text-neutral-600 uppercase">Live</span>
          </Link>

          <div className="px-3.5 py-2.5 rounded-xl bg-[#121319] border border-[#1d1f28] flex items-center justify-between">
            <div className="truncate mr-2">
              <div className="text-xs font-semibold text-white truncate">
                {adminUser.name}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 truncate">
                {adminUser.email}
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out of Admin"
              className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0b0c10] border-b border-[#181a22] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black tracking-widest text-white uppercase">
            {brandConfig.wordmark}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/40">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-[#13151c] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col pt-16">
          <div className="p-5 flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500 text-black font-bold"
                      : "text-neutral-300 hover:bg-[#13151c]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[#181a22] space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white text-xs font-mono"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Customer Storefront</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
