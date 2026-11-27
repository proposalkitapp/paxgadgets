import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { brandConfig } from "@/config/brand";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  title: `${brandConfig.name} | Portable Power & Industrial Hardware`,
  description: "Precision-engineered portable power banks with fast-charging Li-Polymer cells, digital metering, and unibody charcoal alloy.",
  keywords: ["power bank Nigeria", "fast charge power bank", "PAX Gadgets", "portable charger Lagos"],
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
      <body className="min-h-full flex flex-col bg-[#fafafa] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
        <CartProvider>
          <Suspense fallback={<div className="h-16" />}>
            <Navbar />
          </Suspense>
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
