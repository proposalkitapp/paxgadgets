export interface BrandConfig {
  name: string;
  wordmark: string;
  tagline: string;
  market: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  navigation: {
    main: Array<{ label: string; href: string }>;
    footer: {
      shop: Array<{ label: string; href: string }>;
      support: Array<{ label: string; href: string }>;
      company: Array<{ label: string; href: string }>;
      legal: Array<{ label: string; href: string }>;
    };
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
  socials: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    primaryCtaHref: string;
    secondaryCta: string;
    secondaryCtaHref: string;
  };
}

export const brandConfig: BrandConfig = {
  name: "BRAND",
  wordmark: "BRAND",
  tagline: "High-Performance Consumer Technology",
  market: "Nigeria",
  currency: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
  },
  navigation: {
    main: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Categories", href: "/categories" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    footer: {
      shop: [
        { label: "All Products", href: "/shop" },
        { label: "Power & Charging", href: "/categories/power-charging" },
        { label: "Audio", href: "/categories/audio" },
        { label: "Mobile Devices", href: "/categories/mobile-devices" },
        { label: "Accessories", href: "/categories/accessories" },
      ],
      support: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/faqs" },
        { label: "Track Order", href: "/account/orders" },
        { label: "Shipping Policy", href: "/policies/shipping" },
        { label: "Returns & Warranty", href: "/policies/returns" },
      ],
      company: [
        { label: "About Us", href: "/about" },
        { label: "Brand Philosophy", href: "/about#philosophy" },
        { label: "Careers", href: "/about#careers" },
      ],
      legal: [
        { label: "Privacy Policy", href: "/policies/privacy" },
        { label: "Terms & Conditions", href: "/policies/terms" },
      ],
    },
  },
  contact: {
    email: "support@brandtech.ng",
    phone: "+234 (0) 800 000 0000",
    whatsapp: "+234 800 000 0000",
    address: "Victoria Island, Lagos, Nigeria",
  },
  socials: {
    twitter: "https://x.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  hero: {
    headline: "Power your world.",
    subheadline: "Technology engineered to keep you connected, powered and moving.",
    primaryCta: "Explore Power Bank",
    primaryCtaHref: "/products/charcoal-fast-charge-power-bank",
    secondaryCta: "Discover Products",
    secondaryCtaHref: "/shop",
  },
};
