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
  name: "PAX Gadgets",
  wordmark: "PAX",
  tagline: "Industrial Design & High-Density Consumer Tech",
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
        { label: "All Gadgets", href: "/shop" },
        { label: "Power & Charging", href: "/shop?category=power-charging" },
        { label: "Audio & Earpods", href: "/shop?category=audio" },
        { label: "Cameras & Imaging", href: "/shop?category=cameras" },
        { label: "Gimbals & Stabilization", href: "/shop?category=gimbals" },
        { label: "Wearables & Tech", href: "/shop?category=wearables" },
        { label: "Gear & Accessories", href: "/shop?category=accessories" },
      ],
      support: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs & Support", href: "/contact#faqs" },
        { label: "Track Order", href: "/account" },
        { label: "Shipping Policy", href: "/about" },
        { label: "Warranty & Servicing", href: "/about" },
      ],
      company: [
        { label: "About PAX", href: "/about" },
        { label: "Design Philosophy", href: "/about" },
      ],
      legal: [
        { label: "Privacy Policy", href: "/about" },
        { label: "Terms of Service", href: "/about" },
      ],
    },
  },
  contact: {
    email: "support@paxgadgets.ng",
    phone: "+234 700 729 4234",
    whatsapp: "+234 812 345 7294",
    address: "Plot 12, Adeola Odeku Street, Victoria Island, Lagos, Nigeria",
  },
  socials: {
    twitter: "https://x.com/paxgadgets",
    instagram: "https://instagram.com/paxgadgets",
    linkedin: "https://linkedin.com/company/paxgadgets",
  },
  hero: {
    headline: "Engineered Hardware. Pure Performance.",
    subheadline:
      "Precision-milled power banks, spatial acoustics, 4K cameras, and motorized stabilizers. Built with aerospace-grade alloys and intelligent circuitry for high-intensity creators across Nigeria.",
    primaryCta: "Explore Catalogue",
    primaryCtaHref: "/shop",
    secondaryCta: "Hardware Ecosystem",
    secondaryCtaHref: "/categories",
  },
};
