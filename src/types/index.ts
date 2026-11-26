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

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Assigned"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type PaymentMethodType = "card" | "transfer" | "ussd";
export type PaymentStatusType = "Paid" | "Pending" | "Failed";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  heroImage?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  instructions?: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  assignedDistributorId?: string;
  assignedDistributorName?: string;
  notes?: string;
}

export type DistributorStatus = "Active" | "Standby" | "Suspended";
export type DistributorVehicle = "Van" | "Motorbike" | "Fleet" | "Express Courier";

export interface Distributor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  coverageArea: string;
  vehicleType: DistributorVehicle;
  status: DistributorStatus;
  activeOrdersCount: number;
  completedDeliveries: number;
  joinedDate: string;
  passcode?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "superadmin";
  lastLogin?: string;
}
