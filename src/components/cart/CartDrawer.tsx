"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, isCartOpen, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0f13] border-l border-[#23252b] text-neutral-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#1c1d22] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold tracking-wide">Shopping Bag</h2>
              <span className="text-xs font-mono bg-[#1a1c22] text-neutral-400 px-2 py-0.5 rounded-full border border-[#2b2d35]">
                {totalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1c1d22] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#16171d] border border-[#23252b] flex items-center justify-center mb-4 text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-medium text-neutral-200 mb-1">Your bag is empty</h3>
                <p className="text-xs text-neutral-500 max-w-[220px] mb-6">
                  Add our flagship power bank to experience uninterrupted high-speed charging.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-xs font-medium tracking-wide bg-[#1c1d23] hover:bg-[#252730] border border-[#2b2d36] text-neutral-200 transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl bg-[#131418] border border-[#202228] flex gap-3.5 items-center hover:border-[#2c2e37] transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg bg-[#0a0a0c] border border-[#1e2026] flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <Image
                      src={item.product.heroImage}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-neutral-200 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs font-mono font-semibold text-cyan-400 mt-0.5">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-md border border-[#24262d] bg-[#0c0d10]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-white text-neutral-400 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-neutral-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-white text-neutral-400 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-neutral-500 hover:text-red-400 transition-colors ml-auto"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Initiation */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#1c1d22] bg-[#0b0c0f] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-200">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Estimated Delivery</span>
                  <span className="text-[11px] text-neutral-500">Calculated at checkout</span>
                </div>
                <div className="pt-2 border-t border-[#1f2026] flex justify-between text-sm font-semibold text-neutral-100">
                  <span>Order Total</span>
                  <span className="font-mono text-cyan-400">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase bg-white text-black hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors text-center"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
