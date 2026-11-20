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
  name: "Brand",
  wordmark: "BRAND",
  tagline: "Industrial Design & High-Density Power",
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
        { label: "Power & Charging", href: "/shop?category=power-charging" },
        { label: "Audio", href: "/shop?category=audio" },
        { label: "Mobile Devices", href: "/shop?category=mobile-devices" },
        { label: "Accessories", href: "/shop?category=accessories" },
      ],
      support: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/contact#faqs" },
        { label: "Track Order", href: "/account" },
        { label: "Shipping Policy", href: "/about" },
        { label: "Returns & Warranty", href: "/about" },
      ],
      company: [
        { label: "About Brand", href: "/about" },
        { label: "Design Philosophy", href: "/about" },
      ],
      legal: [
        { label: "Privacy Policy", href: "/about" },
        { label: "Terms of Service", href: "/about" },
      ],
    },
  },
  contact: {
    email: "concierge@brandtech.ng",
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
    headline: "Engineered Power. Pure Form.",
    subheadline: "A precision high-density power cell enveloped in tactile carbon matte with dual bi-directional fast charging.",
    primaryCta: "Explore Power Bank",
    primaryCtaHref: "/products/charcoal-fast-charge-power-bank",
    secondaryCta: "View Catalogue",
    secondaryCtaHref: "/shop",
  },
};
