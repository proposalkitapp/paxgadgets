"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User, Search, Menu, X, ArrowUpRight } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#08090a]/85 backdrop-blur-md border-b border-[#181920] py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Wordmark with signature jewel emerald dot */}
            <div className="flex items-center gap-8">
              <Link href="/" className="group flex items-center gap-2">
                <span className="text-base font-black tracking-[0.2em] text-white uppercase group-hover:text-neutral-300 transition-colors">
                  {brandConfig.wordmark}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-7">
                {brandConfig.navigation.main.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-xs font-medium tracking-wider uppercase transition-colors hover:text-white ${
                        isActive ? "text-white font-semibold flex items-center gap-1.5" : "text-neutral-400"
                      }`}
                    >
                      {isActive && <span className="w-1 h-1 rounded-full bg-emerald-400" />}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-[#131418] rounded-full transition-colors"
                aria-label="Search all products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Shopping Bag Icon with Emerald Badge Counter */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-neutral-400 hover:text-white hover:bg-[#131418] rounded-full transition-colors"
                aria-label="Open shopping bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 text-black text-[10px] font-bold font-mono flex items-center justify-center shadow-[0_0_8px_#00e676]">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className="p-2 text-neutral-400 hover:text-white hover:bg-[#131418] rounded-full transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
                aria-label="Customer Account"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-[#131418] rounded-full md:hidden transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Quick Search Dropdown */}
          {searchOpen && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                }
              }}
              className="mt-3 pt-3 border-t border-[#181920] flex items-center gap-3"
            >
              <Search className="w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search power banks, capacities, technology..."
                aria-label="Search input"
                className="w-full bg-transparent text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-neutral-500 hover:text-neutral-300 font-mono"
              >
                ESC
              </button>
            </form>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/90 backdrop-blur-xl flex flex-col">
          <div className="p-5 flex items-center justify-between border-b border-[#181920]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-black tracking-widest text-white uppercase flex items-center gap-2"
            >
              <span>{brandConfig.wordmark}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00e676]" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-4">
            {brandConfig.navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-lg font-medium text-neutral-200 border-b border-[#14151a]"
              >
                {item.label}
                <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </Link>
            ))}

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-3 text-lg font-medium text-emerald-400 border-b border-[#14151a]"
            >
              <User className="w-5 h-5" />
              Customer Account
            </Link>
          </div>

          <div className="p-6 border-t border-[#181920] text-xs text-neutral-500 flex flex-col gap-1 font-mono">
            <span>{brandConfig.market} Official Storefront</span>
            <span>{brandConfig.contact.email}</span>
          </div>
        </div>
      )}
    </>
  );
}
