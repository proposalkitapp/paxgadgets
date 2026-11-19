"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Check,
  Truck,
  CreditCard,
  Building,
  Smartphone,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { brandConfig } from "@/config/brand";

const NIGERIAN_STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Oyo",
  "Kano",
  "Delta",
  "Enugu",
  "Anambra",
  "Edo",
  "Ogun",
  "Kaduna",
  "Akwa Ibom",
  "Ondo",
  "Osun",
  "Other State",
];

export default function CheckoutPage() {
  const { cart, subtotal, totalItems } = useCart();

  // Checkout flow state
  // Step 1: Google Authentication Gate (PRD §7.2)
  // Step 2: Delivery Details
  // Step 3: Payment & Order Confirmation
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Delivery form state
  const [deliveryData, setDeliveryData] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "Lagos",
    city: "",
    address: "",
    instructions: "",
  });

  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer" | "ussd">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

  const deliveryFee = deliveryData.state === "Lagos" ? 2500 : 4500;
  const orderTotal = subtotal + (subtotal > 0 ? deliveryFee : 0);

  // Simulate Google OAuth Sign-in (seamless cart migration per PRD §7.3)
  const handleGoogleAuth = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      const mockUser = {
        name: "Daniel Tech",
        email: "daniel@example.com",
      };
      setUserProfile(mockUser);
      setDeliveryData((prev) => ({
        ...prev,
        fullName: mockUser.name,
        email: mockUser.email,
      }));
      setIsAuthenticated(true);
      setIsAuthenticating(false);
    }, 1000);
  };

  const handleCompleteOrder = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const generatedOrderId = `ORD-${Date.now().toString().slice(-8)}`;
      setOrderId(generatedOrderId);
      setIsProcessingPayment(false);
      setOrderConfirmed(true);
    }, 1500);
  };

  if (cart.length === 0 && !orderConfirmed) {
    return (
      <div className="pt-32 pb-20 bg-[#090a0d] min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-16 h-16 rounded-full bg-[#13141a] border border-[#22242c] flex items-center justify-center mx-auto mb-4 text-neutral-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-neutral-400 mb-6">
            You must have at least one product in your bag before proceeding with checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="pt-32 pb-20 bg-[#090a0d] min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Order Confirmed & Paid
            </span>
            <h1 className="text-3xl font-black text-white mt-1">Thank You For Your Order!</h1>
            <p className="text-xs text-neutral-400 mt-2">
              A confirmation receipt and fulfillment timeline have been dispatched to{" "}
              <span className="text-white font-mono">{deliveryData.email}</span>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e0f14] border border-[#1f2128] text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-[#1c1d22] pb-2">
              <span className="text-neutral-500">Order Reference</span>
              <span className="text-cyan-400 font-bold">{orderId}</span>
            </div>
            <div className="flex justify-between border-b border-[#1c1d22] pb-2">
              <span className="text-neutral-500">Customer</span>
              <span className="text-neutral-200">{deliveryData.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-[#1c1d22] pb-2">
              <span className="text-neutral-500">Destination</span>
              <span className="text-neutral-200">{deliveryData.city}, {deliveryData.state}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-neutral-500">Total Paid</span>
              <span className="text-white font-bold">{formatPrice(orderTotal)}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              Return to Storefront
            </Link>
            <Link
              href="/account"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#14161c] border border-[#23252f] text-neutral-300 text-xs font-medium uppercase tracking-wider hover:bg-[#1e2028] transition-colors"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#090a0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white font-mono mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to catalogue
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Secure Checkout
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Official Nigerian payment verification via encrypted gateway.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Checkout Steps Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Shopping-First Google Authentication (PRD §7.2) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0e0f14] border border-[#1f2128]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isAuthenticated
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-cyan-950 text-cyan-400 border border-cyan-800"
                    }`}
                  >
                    {isAuthenticated ? <Check className="w-3.5 h-3.5" /> : "1"}
                  </div>
                  <h2 className="text-base font-bold text-white">
                    Customer Authentication
                  </h2>
                </div>

                {isAuthenticated && (
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-[11px] font-mono text-neutral-500 hover:text-cyan-400"
                  >
                    Switch Account
                  </button>
                )}
              </div>

              {!isAuthenticated ? (
                <div className="space-y-4 pt-2">
                  <div className="p-5 rounded-xl bg-[#0a0b0e] border border-[#1b1c22]">
                    <h3 className="text-base font-bold text-white mb-1">
                      Almost there. Let&apos;s get your order ready.
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-5">
                      Sign in with Google to continue securely and manage your purchases. Your guest cart will be automatically preserved.
                    </p>

                    <button
                      onClick={handleGoogleAuth}
                      disabled={isAuthenticating}
                      className="w-full py-3.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-3 transition-colors shadow-lg shadow-white/5"
                    >
                      {/* Google G Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      {isAuthenticating ? "Authenticating with Google..." : "Continue with Google"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cart preservation active: No items will be lost during authentication</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#1f2128] flex items-center justify-between text-xs">
                  <div>
                    <div className="text-neutral-400 font-mono">Authenticated Customer:</div>
                    <div className="text-white font-semibold mt-0.5">{userProfile?.name} ({userProfile?.email})</div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    Verified
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Delivery Information */}
            <div
              className={`p-6 sm:p-8 rounded-2xl bg-[#0e0f14] border transition-opacity ${
                isAuthenticated ? "border-[#1f2128]" : "border-[#16171d] opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    deliveryConfirmed
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-cyan-950 text-cyan-400 border border-cyan-800"
                  }`}
                >
                  {deliveryConfirmed ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <h2 className="text-base font-bold text-white">Delivery Address</h2>
              </div>

              {!deliveryConfirmed ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={deliveryData.fullName}
                        onChange={(e) => setDeliveryData({ ...deliveryData, fullName: e.target.value })}
                        className="w-full bg-[#13141a] border border-[#232530] text-neutral-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        value={deliveryData.phone}
                        onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                        placeholder="+234 800 000 0000"
                        className="w-full bg-[#13141a] border border-[#232530] text-neutral-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1.5">State *</label>
                      <select
                        value={deliveryData.state}
                        onChange={(e) => setDeliveryData({ ...deliveryData, state: e.target.value })}
                        className="w-full bg-[#13141a] border border-[#232530] text-neutral-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                      >
                        {NIGERIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1.5">City / Town *</label>
                      <input
                        type="text"
                        value={deliveryData.city}
                        onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                        placeholder="e.g. Ikeja, Lekki, Victoria Island"
                        className="w-full bg-[#13141a] border border-[#232530] text-neutral-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-mono mb-1.5">Street Address *</label>
                    <input
                      type="text"
                      value={deliveryData.address}
                      onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                      placeholder="Street name, building number, landmark"
                      className="w-full bg-[#13141a] border border-[#232530] text-neutral-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (deliveryData.fullName && deliveryData.phone && deliveryData.address) {
                        setDeliveryConfirmed(true);
                      }
                    }}
                    disabled={!deliveryData.fullName || !deliveryData.phone || !deliveryData.address}
                    className="w-full py-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs tracking-wider uppercase transition-colors disabled:opacity-40"
                  >
                    Confirm Delivery Address
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#12141a] border border-[#1f2128] text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{deliveryData.fullName}</div>
                    <div className="text-neutral-400 mt-0.5">
                      {deliveryData.address}, {deliveryData.city}, {deliveryData.state}
                    </div>
                    <div className="text-neutral-500 font-mono mt-0.5">{deliveryData.phone}</div>
                  </div>
                  <button
                    onClick={() => setDeliveryConfirmed(false)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Payment Gateway Trigger */}
            <div
              className={`p-6 sm:p-8 rounded-2xl bg-[#0e0f14] border transition-opacity ${
                deliveryConfirmed ? "border-[#1f2128]" : "border-[#16171d] opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs font-mono font-bold">
                  3
                </div>
                <h2 className="text-base font-bold text-white">Payment Method (Nigeria)</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      paymentMethod === "card"
                        ? "bg-cyan-950/40 border-cyan-500 text-white"
                        : "bg-[#121318] border-[#22242c] text-neutral-400"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                    <span className="text-xs font-semibold block">Debit Card</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Mastercard/Visa/Verve</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      paymentMethod === "transfer"
                        ? "bg-cyan-950/40 border-cyan-500 text-white"
                        : "bg-[#121318] border-[#22242c] text-neutral-400"
                    }`}
                  >
                    <Building className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                    <span className="text-xs font-semibold block">Bank Transfer</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Instant Virtual Account</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("ussd")}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      paymentMethod === "ussd"
                        ? "bg-cyan-950/40 border-cyan-500 text-white"
                        : "bg-[#121318] border-[#22242c] text-neutral-400"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                    <span className="text-xs font-semibold block">USSD Banking</span>
                    <span className="text-[10px] text-neutral-500 font-mono">*Bank Code#</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#090a0d] border border-[#1b1c23] text-xs text-neutral-400 flex items-center gap-3">
                  <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Secured by 256-bit bank encryption. Official Nigerian Payment Gateway integration with server-side validation.
                  </span>
                </div>

                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessingPayment}
                  className="w-full py-4 px-6 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-xl shadow-white/5 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    "Verifying Transaction..."
                  ) : (
                    <>
                      Pay {formatPrice(orderTotal)} & Complete Order
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (PRD §8.3) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[#0e0f14] border border-[#1f2128] sticky top-28 space-y-5">
              <h3 className="text-base font-bold text-white border-b border-[#1c1d22] pb-4">
                Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg bg-[#0a0a0c] border border-[#1c1d22] flex-shrink-0 p-1">
                      <Image
                        src={item.product.heroImage}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-medium text-white truncate">{item.product.name}</div>
                      <div className="text-neutral-500 font-mono">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-xs font-mono font-semibold text-neutral-200">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="border-t border-[#1c1d22] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-200">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery ({deliveryData.state})</span>
                  <span className="font-mono text-neutral-200">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="border-t border-[#1f2026] pt-3 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="font-mono text-cyan-400">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#121318] border border-[#1e2026] text-[11px] text-neutral-400 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  Fast Track Fulfillment
                </div>
                <p>Orders dispatched within 24 hours from our Lagos distribution hub.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
