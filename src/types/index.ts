export type AvailabilityStatus = "Available" | "Coming Soon" | "Out of Stock" | "Discontinued";

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  image?: string;
  itemCount: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number; // in NGN
  originalPrice?: number;
  category: string;
  categorySlug: string;
  availabilityStatus: AvailabilityStatus;
  stockQuantity: number;
  featured: boolean;
  heroImage: string;
  images: string[];
  specifications: ProductSpecification[];
  features: string[];
  warranty?: string;
  deliveryInfo?: string;
  badge?: string;
  is3DAvailable?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  streetAddress: string;
  deliveryInstructions?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
}
