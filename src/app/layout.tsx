import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { brandConfig } from "@/config/brand";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import AnalyticsInspector from "@/components/analytics/AnalyticsInspector";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  title: `${brandConfig.name} | High-Performance Consumer Technology`,
  description: "Official digital storefront for premium engineered power banks, acoustics, and consumer technology accessories in Nigeria.",
  keywords: ["power bank Nigeria", "fast charge power bank", "consumer technology", "audio gadgets Lagos"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#08090a] text-neutral-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
        <CartProvider>
          <Suspense fallback={<div className="h-16" />}>
            <Navbar />
          </Suspense>
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <AnalyticsInspector />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
