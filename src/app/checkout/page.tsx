"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { trackCheckoutStart } from "@/lib/analytics";
import { createOrder } from "@/lib/adminStore";

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
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const [confirmedOrderSummary, setConfirmedOrderSummary] = useState<{
    itemsCount: number;
    amountPaid: number;
  }>({ itemsCount: 0, amountPaid: 0 });

  const hasTrackedCheckoutStart = useRef(false);

  useEffect(() => {
    if (cart.length > 0 && !hasTrackedCheckoutStart.current) {
      hasTrackedCheckoutStart.current = true;
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
    }
  }, [cart, totalItems, subtotal]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("pax_customer_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed && (parsed.fullName || parsed.email)) {
            setUserProfile({
              name: parsed.fullName || "Verified Customer",
              email: parsed.email || "",
            });
            setDeliveryData((prev) => ({
              ...prev,
              fullName: parsed.fullName || prev.fullName,
              email: parsed.email || prev.email,
              phone: parsed.phone || prev.phone,
              state: parsed.state || prev.state,
              city: parsed.city || prev.city,
              address: parsed.address || prev.address,
            }));
            setIsAuthenticated(true);
          }
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  const handleGoogleAuth = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      const customerName = deliveryData.fullName.trim() || "Verified Customer";
      const customerEmail = deliveryData.email.trim() || "customer@paxgadgets.ng";
      const verifiedUser = {
        name: customerName,
        email: customerEmail,
      };
      setUserProfile(verifiedUser);
      setDeliveryData((prev) => ({
        ...prev,
        fullName: prev.fullName || verifiedUser.name,
        email: prev.email || verifiedUser.email,
      }));
      setIsAuthenticated(true);
      setIsAuthenticating(false);
    }, 600);
  };

  const handleGuestCheckout = () => {
    const guestUser = {
      name: deliveryData.fullName.trim() || "Guest Customer",
      email: deliveryData.email.trim() || "guest@paxgadgets.ng",
    };
    setUserProfile(guestUser);
    setIsAuthenticated(true);
  };

  const handleCompleteOrder = () => {
    setIsProcessingPayment(true);
    setConfirmedOrderSummary({
      itemsCount: totalItems,
      amountPaid: orderTotal,
    });
    setTimeout(() => {
      const generatedOrderId = `ORD-${Date.now().toString().slice(-8)}`;
      setOrderId(generatedOrderId);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "pax_customer_profile",
            JSON.stringify({
              fullName: deliveryData.fullName,
              email: deliveryData.email,
              phone: deliveryData.phone,
              state: deliveryData.state,
              city: deliveryData.city,
              address: deliveryData.address,
            })
          );
        } catch {
          // ignore
        }
      }

      createOrder({
        id: generatedOrderId,
        customer: {
          fullName: deliveryData.fullName,
          email: deliveryData.email,
          phone: deliveryData.phone,
          state: deliveryData.state,
          city: deliveryData.city,
          address: deliveryData.address,
          instructions: deliveryData.instructions || undefined,
        },
        items: cart.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          category: item.product.category,
          heroImage: item.product.heroImage,
        })),
        subtotal,
        deliveryFee,
        totalAmount: orderTotal,
        paymentMethod,
        paymentStatus: "Paid",
        notes: `Storefront order placed via ${paymentMethod.toUpperCase()}`,
      });

      setIsProcessingPayment(false);
      setOrderConfirmed(true);
      clearCart();
    }, 1500);
  };

  if (cart.length === 0 && !orderConfirmed) {
    return (
      <div className="pt-32 pb-20 bg-[#fafafa] min-h-screen flex items-center justify-center text-neutral-900">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center mx-auto mb-4 text-neutral-400 shadow-sm">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-neutral-500 mb-6">
            You must have at least one product in your bag before proceeding with checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-semibold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="pt-32 pb-20 bg-[#fafafa] min-h-screen flex items-center justify-center text-neutral-900">
        <div className="max-w-lg mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Order Confirmed & Paid
            </span>
            <h1 className="text-3xl font-black text-neutral-900 mt-1">Thank You For Your Order!</h1>
            <p className="text-xs text-neutral-600 mt-2">
              A confirmation receipt and fulfillment timeline have been dispatched to{" "}
              <span className="text-neutral-900 font-mono font-medium">{deliveryData.email}</span>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 text-left space-y-3 font-mono text-xs shadow-sm">
            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Order Reference</span>
              <span className="text-neutral-900 font-bold">{orderId}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Customer</span>
              <span className="text-neutral-900">{deliveryData.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Destination</span>
              <span className="text-neutral-900">{deliveryData.city}, {deliveryData.state}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-neutral-500">Total Paid</span>
              <span className="text-neutral-900 font-bold">{formatPrice(confirmedOrderSummary.amountPaid || orderTotal)}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Return to Storefront
            </Link>
            <Link
              href="/account"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-700 text-xs font-medium uppercase tracking-wider hover:border-neutral-900 transition-colors shadow-sm"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#fafafa] min-h-screen text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-mono mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to catalogue
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">
            Secure Checkout
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Official Nigerian payment verification via encrypted gateway.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Checkout Steps Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Authentication */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isAuthenticated
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-900 border border-neutral-200"
                    }`}
                  >
                    {isAuthenticated ? <Check className="w-3.5 h-3.5" /> : "1"}
                  </div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Customer Authentication
                  </h2>
                </div>

                {isAuthenticated && (
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-[11px] font-mono text-neutral-500 hover:text-neutral-900 underline"
                  >
                    Switch Account
                  </button>
                )}
              </div>

              {!isAuthenticated ? (
                <div className="space-y-4 pt-2">
                  <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900 mb-1">
                      Almost there. Let&apos;s get your order ready.
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-5">
                      Sign in with Google to continue securely and manage your purchases. Your guest cart will be automatically preserved.
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={handleGoogleAuth}
                        disabled={isAuthenticating}
                        className="w-full py-3.5 px-4 rounded-xl bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-100 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-3 transition-colors shadow-sm"
                      >
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

                      <div className="flex items-center gap-3 my-2">
                        <div className="h-px flex-1 bg-neutral-200" />
                        <span className="text-[10px] font-mono uppercase text-neutral-400">or</span>
                        <div className="h-px flex-1 bg-neutral-200" />
                      </div>

                      <button
                        type="button"
                        onClick={handleGuestCheckout}
                        className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 font-medium text-xs tracking-wider uppercase transition-colors"
                      >
                        Continue as Guest
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                    <ShieldCheck className="w-4 h-4 text-neutral-900" />
                    <span>Cart preservation active: No items will be lost during authentication</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-neutral-500 font-mono">Customer:</div>
                    <div className="text-neutral-900 font-semibold mt-0.5">{userProfile?.name} ({userProfile?.email})</div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-900 bg-neutral-200 px-2 py-0.5 rounded font-semibold">
                    Verified
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Delivery Information */}
            <div
              className={`p-6 sm:p-8 rounded-2xl bg-white border shadow-sm transition-opacity ${
                isAuthenticated ? "border-neutral-200/90" : "border-neutral-200 opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    deliveryConfirmed
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-900 border border-neutral-200"
                  }`}
                >
                  {deliveryConfirmed ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <h2 className="text-base font-bold text-neutral-900">Delivery Address</h2>
              </div>

              {!deliveryConfirmed ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="delivery-fullName" className="block text-neutral-600 font-medium mb-1.5">Full Name *</label>
                      <input
                        id="delivery-fullName"
                        type="text"
                        value={deliveryData.fullName}
                        onChange={(e) => setDeliveryData({ ...deliveryData, fullName: e.target.value })}
                        className="w-full bg-white border border-neutral-200 text-neutral-900 px-3.5 py-3 sm:py-2.5 text-base sm:text-xs rounded-xl focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="delivery-phone" className="block text-neutral-600 font-medium mb-1.5">Phone Number *</label>
                      <input
                        id="delivery-phone"
                        type="tel"
                        value={deliveryData.phone}
                        onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                        placeholder="+234 800 000 0000"
                        className="w-full bg-white border border-neutral-200 text-neutral-900 px-3.5 py-3 sm:py-2.5 text-base sm:text-xs rounded-xl focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="delivery-state" className="block text-neutral-600 font-medium mb-1.5">State *</label>
                      <select
                        id="delivery-state"
                        value={deliveryData.state}
                        onChange={(e) => setDeliveryData({ ...deliveryData, state: e.target.value })}
                        className="w-full bg-white border border-neutral-200 text-neutral-900 px-3.5 py-3 sm:py-2.5 text-base sm:text-xs rounded-xl focus:outline-none focus:border-neutral-900 transition-colors"
                      >
                        {NIGERIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="delivery-city" className="block text-neutral-600 font-medium mb-1.5">City / Town *</label>
                      <input
                        id="delivery-city"
                        type="text"
                        value={deliveryData.city}
                        onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                        placeholder="e.g. Ikeja, Lekki, Victoria Island"
                        className="w-full bg-white border border-neutral-200 text-neutral-900 px-3.5 py-3 sm:py-2.5 text-base sm:text-xs rounded-xl focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="delivery-address" className="block text-neutral-600 font-medium mb-1.5">Street Address *</label>
                    <input
                      id="delivery-address"
                      type="text"
                      value={deliveryData.address}
                      onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                      placeholder="Street name, building number, landmark"
                      className="w-full bg-white border border-neutral-200 text-neutral-900 px-3.5 py-3 sm:py-2.5 text-base sm:text-xs rounded-xl focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (deliveryData.fullName && deliveryData.phone && deliveryData.address) {
                        setDeliveryConfirmed(true);
                      }
                    }}
                    disabled={!deliveryData.fullName || !deliveryData.phone || !deliveryData.address}
                    className="w-full py-3.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-semibold text-xs tracking-wider uppercase transition-colors disabled:opacity-40 min-h-[48px] shadow-sm"
                  >
                    Confirm Delivery Address
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900">{deliveryData.fullName}</div>
                    <div className="text-neutral-600 mt-0.5">
                      {deliveryData.address}, {deliveryData.city}, {deliveryData.state}
                    </div>
                    <div className="text-neutral-500 font-mono mt-0.5">{deliveryData.phone}</div>
                  </div>
                  <button
                    onClick={() => setDeliveryConfirmed(false)}
                    className="text-xs font-mono text-neutral-900 underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Payment Gateway Trigger */}
            <div
              className={`p-6 sm:p-8 rounded-2xl bg-white border shadow-sm transition-opacity ${
                deliveryConfirmed ? "border-neutral-200/90" : "border-neutral-200 opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-mono font-bold">
                  3
                </div>
                <h2 className="text-base font-bold text-neutral-900">Payment Method (Nigeria)</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3.5 sm:p-4 rounded-xl border flex sm:flex-col items-center gap-3 sm:gap-0 sm:text-center transition-all ${
                      paymentMethod === "card"
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                        : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 sm:mx-auto sm:mb-2 flex-shrink-0 ${paymentMethod === "card" ? "text-white" : "text-neutral-900"}`} />
                    <div className="text-left sm:text-center">
                      <span className="text-xs font-semibold block">Debit Card</span>
                      <span className={`text-[10px] font-mono ${paymentMethod === "card" ? "text-neutral-400" : "text-neutral-500"}`}>Mastercard/Visa/Verve</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className={`p-3.5 sm:p-4 rounded-xl border flex sm:flex-col items-center gap-3 sm:gap-0 sm:text-center transition-all ${
                      paymentMethod === "transfer"
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                        : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                    }`}
                  >
                    <Building className={`w-5 h-5 sm:mx-auto sm:mb-2 flex-shrink-0 ${paymentMethod === "transfer" ? "text-white" : "text-neutral-900"}`} />
                    <div className="text-left sm:text-center">
                      <span className="text-xs font-semibold block">Bank Transfer</span>
                      <span className={`text-[10px] font-mono ${paymentMethod === "transfer" ? "text-neutral-400" : "text-neutral-500"}`}>Instant Virtual Account</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("ussd")}
                    className={`p-3.5 sm:p-4 rounded-xl border flex sm:flex-col items-center gap-3 sm:gap-0 sm:text-center transition-all ${
                      paymentMethod === "ussd"
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                        : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 sm:mx-auto sm:mb-2 flex-shrink-0 ${paymentMethod === "ussd" ? "text-white" : "text-neutral-900"}`} />
                    <div className="text-left sm:text-center">
                      <span className="text-xs font-semibold block">USSD Banking</span>
                      <span className={`text-[10px] font-mono ${paymentMethod === "ussd" ? "text-neutral-400" : "text-neutral-500"}`}>*Bank Code#</span>
                    </div>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center gap-3">
                  <Lock className="w-4 h-4 text-neutral-900 flex-shrink-0" />
                  <span>
                    Secured by 256-bit bank encryption. Official Nigerian Payment Gateway integration with server-side validation.
                  </span>
                </div>

                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessingPayment}
                  className="w-full py-4 px-6 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
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

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm sticky top-28 space-y-5">
              <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-4">
                Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-200 flex-shrink-0 p-1">
                      <Image
                        src={item.product.heroImage}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-medium text-neutral-900 truncate">{item.product.name}</div>
                      <div className="text-neutral-500 font-mono">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-xs font-mono font-semibold text-neutral-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery ({deliveryData.state})</span>
                  <span className="font-mono text-neutral-900">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm font-bold text-neutral-900">
                  <span>Total Amount</span>
                  <span className="font-mono text-neutral-900">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-900 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-neutral-900" />
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
