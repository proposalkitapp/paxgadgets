"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User, Search, Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import AIProductAdvisorModal from "@/components/ai/AIProductAdvisorModal";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [advisorOpen, setAdvisorOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/distributordelivering")) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-neutral-200/90 py-3 shadow-xs"
            : "bg-white/80 backdrop-blur-xs py-4.5 border-b border-neutral-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Wordmark */}
            <div className="flex items-center gap-8">
              <Link href="/" className="group flex items-center gap-2">
                <span className="text-base font-black tracking-[0.25em] text-neutral-950 uppercase group-hover:text-neutral-700 transition-colors">
                  {brandConfig.wordmark}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-6">
                {brandConfig.navigation.main.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-xs font-medium tracking-wider uppercase transition-colors hover:text-neutral-950 ${
                        isActive ? "text-neutral-950 font-semibold flex items-center gap-1.5" : "text-neutral-500"
                      }`}
                    >
                      {isActive && <span className="w-1 h-1 rounded-full bg-neutral-900" />}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Specification Advisor Button */}
              <button
                onClick={() => setAdvisorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 transition-all text-xs font-mono font-medium min-h-[36px]"
                aria-label="Open Hardware Advisor"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
                <span className="hidden sm:inline">Advisor</span>
                <span className="text-[10px] sm:hidden font-bold">AI</span>
              </button>

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Search catalogue"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Shopping Bag Icon with Minimal Badge Counter */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-9 h-9 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Open shopping bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] font-bold font-mono flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className="w-9 h-9 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors hidden sm:flex items-center justify-center text-xs font-medium"
                aria-label="Customer Account"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full md:hidden transition-colors"
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
              className="mt-3 pt-3 border-t border-neutral-200 flex items-center gap-3"
            >
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search power banks, capacities, technology..."
                aria-label="Search input"
                className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-neutral-500 hover:text-neutral-800 font-mono"
              >
                ESC
              </button>
            </form>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-white flex flex-col">
          <div className="p-5 flex items-center justify-between border-b border-neutral-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-black tracking-widest text-neutral-950 uppercase flex items-center gap-2"
            >
              <span>{brandConfig.wordmark}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-neutral-600 hover:text-neutral-950"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAdvisorOpen(true);
              }}
              className="w-full flex items-center justify-between py-3 text-base font-semibold text-neutral-900 border-b border-neutral-100"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neutral-700" />
                Specification Advisor
              </span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </button>

            {brandConfig.navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-base font-medium text-neutral-800 border-b border-neutral-100"
              >
                {item.label}
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </Link>
            ))}

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-3 text-base font-medium text-neutral-800 border-b border-neutral-100"
            >
              <User className="w-5 h-5 text-neutral-600" />
              Customer Account
            </Link>
          </div>

          <div className="p-6 border-t border-neutral-200 text-xs text-neutral-500 flex flex-col gap-1 font-mono">
            <span>{brandConfig.market} Official Storefront</span>
            <span>{brandConfig.contact.email}</span>
          </div>
        </div>
      )}

      {/* AI Product Advisor Modal */}
      <AIProductAdvisorModal
        isOpen={advisorOpen}
        onClose={() => setAdvisorOpen(false)}
      />
    </>
  );
}
