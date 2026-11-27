"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { trackCheckoutStart } from "@/lib/analytics";

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
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 text-neutral-900 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-neutral-950" />
              <h2 className="text-base font-bold tracking-tight text-neutral-950">Shopping Bag</h2>
              <span className="text-xs font-mono bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full font-medium border border-neutral-200">
                {totalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-4 text-neutral-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">Your bag is empty</h3>
                <p className="text-xs text-neutral-500 max-w-[220px] mb-6 font-normal">
                  Add the PAX fast-charge power bank to experience uninterrupted daily charging.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
                >
                  Explore Hardware
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 sm:p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200 flex gap-3.5 items-center"
                >
                  {/* Thumbnail using pb_images */}
                  <div className="relative w-16 h-16 rounded-lg bg-white border border-neutral-200/80 flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
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
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs font-mono font-bold text-neutral-950 mt-0.5">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-lg border border-neutral-200 bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 text-neutral-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 text-neutral-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors ml-auto"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-neutral-200 bg-neutral-50/60 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Estimated Delivery</span>
                  <span className="text-[11px] font-mono text-neutral-500">Calculated at checkout</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-950">
                  <span>Order Total</span>
                  <span className="font-mono text-base">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => {
                    trackCheckoutStart({
                      cartCount: totalItems,
                      subtotal,
                      items: cart.map((i) => ({
                        id: i.product.id,
                        name: i.product.name,
                        price: i.product.price,
                        quantity: i.quantity,
                        category: i.product.category,
                      })),
                    });
                    setIsCartOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase bg-neutral-950 text-white hover:bg-neutral-800 transition-colors min-h-[48px]"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors text-center font-medium"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
