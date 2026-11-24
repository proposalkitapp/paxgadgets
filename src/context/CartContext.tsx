"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Product, CartItem } from "@/types";
import { trackAddToCart } from "@/lib/analytics";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "brand_guest_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to read guest cart from localStorage", e);
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to persist guest cart to localStorage", e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.availabilityStatus !== "Available") {
      return;
    }

    // Trigger analytics for cart additions across storefront
    trackAddToCart({
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      quantity,
      totalValue: product.price * quantity,
    });

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        const currentQty = nextCart[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, product.stockQuantity);
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: newQty,
        };
        return nextCart;
      }
      return [...prevCart, { product, quantity: Math.min(quantity, product.stockQuantity) }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stockQuantity;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
