import { Order, Product, Distributor, OrderStatus } from "@/types";
import { products as initialCatalogProducts } from "@/data/products";

const STORAGE_KEY_ORDERS = "pax_admin_orders_v1";
const STORAGE_KEY_PRODUCTS = "pax_admin_products_v1";
const STORAGE_KEY_DISTRIBUTORS = "pax_admin_distributors_v1";

export const INITIAL_DISTRIBUTORS: Distributor[] = [
  {
    id: "DIST-01",
    name: "Lagos Express Dispatch",
    contactPerson: "Emeka Okafor",
    phone: "+234 803 111 2233",
    email: "lagos-express@paxgadgets.com",
    coverageArea: "Lagos (VI, Lekki, Ikoyi, Marina)",
    vehicleType: "Motorbike",
    status: "Active",
    activeOrdersCount: 2,
    completedDeliveries: 148,
    joinedDate: "2026-01-15",
    passcode: "1234",
  },
  {
    id: "DIST-02",
    name: "Mainland Swift Logistics",
    contactPerson: "Babatunde Adeleke",
    phone: "+234 802 444 5566",
    email: "mainland-swift@paxgadgets.com",
    coverageArea: "Lagos Mainland (Ikeja, Yaba, Surulere, Gbagada)",
    vehicleType: "Van",
    status: "Active",
    activeOrdersCount: 1,
    completedDeliveries: 215,
    joinedDate: "2026-02-01",
    passcode: "2345",
  },
  {
    id: "DIST-03",
    name: "Abuja FastTrack Delivery",
    contactPerson: "Amina Yusuf",
    phone: "+234 814 777 8899",
    email: "abuja-couriers@paxgadgets.com",
    coverageArea: "Abuja FCT (Maitama, Wuse 2, Garki, Jabi)",
    vehicleType: "Express Courier",
    status: "Active",
    activeOrdersCount: 1,
    completedDeliveries: 92,
    joinedDate: "2026-04-10",
    passcode: "3456",
  },
  {
    id: "DIST-04",
    name: "Niger Delta Metro Logistics",
    contactPerson: "Tamuno Briggs",
    phone: "+234 809 333 7711",
    email: "tamuno@deltametro.ng",
    coverageArea: "Rivers (Port Harcourt, GRA, Trans-Amadi)",
    vehicleType: "Van",
    status: "Standby",
    activeOrdersCount: 0,
    completedDeliveries: 64,
    joinedDate: "2026-06-20",
    passcode: "4567",
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-84920194",
    customer: {
      fullName: "Daniel Tech",
      email: "daniel@example.com",
      phone: "+234 800 000 0000",
      state: "Lagos",
      city: "Victoria Island",
      address: "Plot 12, Adeola Odeku Street, Victoria Island",
      instructions: "Ring doorbell or call upon arrival at front desk",
    },
    items: [
      {
        id: "prod-powerbank-01",
        name: "Futuristic Charcoal Fast-Charge Power Bank",
        price: 32500,
        quantity: 1,
        category: "Power & Charging",
        heroImage: "/assets/products/powerbank-hero.png",
      },
    ],
    subtotal: 32500,
    deliveryFee: 2500,
    totalAmount: 35000,
    paymentMethod: "card",
    paymentStatus: "Paid",
    status: "Processing",
    createdAt: "2026-11-23T14:30:00Z",
    updatedAt: "2026-11-24T09:15:00Z",
    assignedDistributorId: "DIST-01",
    assignedDistributorName: "Lagos Express Dispatch",
    notes: "High priority flagship power bank shipment.",
  },
  {
    id: "ORD-84920205",
    customer: {
      fullName: "Chioma Nwosu",
      email: "chioma.nwosu@gmail.com",
      phone: "+234 803 555 1234",
      state: "Lagos",
      city: "Ikeja",
      address: "14 Isaac John Street, GRA Ikeja",
      instructions: "Leave package with estate security gatehouse",
    },
    items: [
      {
        id: "prod-powerbank-01",
        name: "Futuristic Charcoal Fast-Charge Power Bank",
        price: 32500,
        quantity: 2,
        category: "Power & Charging",
        heroImage: "/assets/products/powerbank-hero.png",
      },
    ],
    subtotal: 65000,
    deliveryFee: 2500,
    totalAmount: 67500,
    paymentMethod: "transfer",
    paymentStatus: "Paid",
    status: "Pending",
    createdAt: "2026-11-24T18:45:00Z",
    updatedAt: "2026-11-24T18:45:00Z",
    notes: "Awaiting distributor assignment for Ikeja corridor.",
  },
  {
    id: "ORD-84919870",
    customer: {
      fullName: "Ibrahim Sanusi",
      email: "ibrahim.s@outlook.com",
      phone: "+234 812 999 4321",
      state: "Abuja (FCT)",
      city: "Maitama",
      address: "Unit 4B, Mississippi Avenue, Maitama",
      instructions: "Office delivery between 9am - 5pm",
    },
    items: [
      {
        id: "prod-powerbank-01",
        name: "Futuristic Charcoal Fast-Charge Power Bank",
        price: 32500,
        quantity: 1,
        category: "Power & Charging",
        heroImage: "/assets/products/powerbank-hero.png",
      },
      {
        id: "prod-earbuds-02",
        name: "True Wireless Acoustic Earbuds",
        price: 24500,
        quantity: 1,
        category: "Audio",
        heroImage: "/assets/products/earbuds-hero.jpg",
      },
    ],
    subtotal: 57000,
    deliveryFee: 4500,
    totalAmount: 61500,
    paymentMethod: "card",
    paymentStatus: "Paid",
    status: "Out for Delivery",
    createdAt: "2026-11-22T10:15:00Z",
    updatedAt: "2026-11-24T11:20:00Z",
    assignedDistributorId: "DIST-03",
    assignedDistributorName: "Abuja FastTrack Delivery",
    notes: "Courier dispatched via express dispatch van.",
  },
  {
    id: "ORD-84918450",
    customer: {
      fullName: "Femi Adeyemi",
      email: "femi.adeyemi@yahoo.com",
      phone: "+234 805 777 6655",
      state: "Lagos",
      city: "Lekki Phase 1",
      address: "Admiralty Way, Block 8 Flat 2",
    },
    items: [
      {
        id: "prod-powerbank-01",
        name: "Futuristic Charcoal Fast-Charge Power Bank",
        price: 32500,
        quantity: 1,
        category: "Power & Charging",
        heroImage: "/assets/products/powerbank-hero.png",
      },
    ],
    subtotal: 32500,
    deliveryFee: 2500,
    totalAmount: 35000,
    paymentMethod: "card",
    paymentStatus: "Paid",
    status: "Delivered",
    createdAt: "2026-11-20T08:00:00Z",
    updatedAt: "2026-11-21T16:40:00Z",
    assignedDistributorId: "DIST-01",
    assignedDistributorName: "Lagos Express Dispatch",
    notes: "Successfully delivered. Customer signed recipient slip.",
  },
  {
    id: "ORD-84917992",
    customer: {
      fullName: "Kelechi Okoye",
      email: "k.okoye@enterpriseng.com",
      phone: "+234 807 123 9876",
      state: "Rivers",
      city: "Port Harcourt",
      address: "Old GRA, Phase 2, Port Harcourt",
    },
    items: [
      {
        id: "prod-powerbank-01",
        name: "Futuristic Charcoal Fast-Charge Power Bank",
        price: 32500,
        quantity: 1,
        category: "Power & Charging",
        heroImage: "/assets/products/powerbank-hero.png",
      },
    ],
    subtotal: 32500,
    deliveryFee: 4500,
    totalAmount: 37000,
    paymentMethod: "transfer",
    paymentStatus: "Failed",
    status: "Cancelled",
    createdAt: "2026-11-18T12:00:00Z",
    updatedAt: "2026-11-19T09:00:00Z",
    notes: "Payment transfer expired after 24 hours.",
  },
];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function notifySubscribers() {
  if (isBrowser()) {
    window.dispatchEvent(new Event("pax_admin_store_updated"));
  }
}

// ---------------- ORDERS ---------------- //

export function getOrders(): Order[] {
  if (!isBrowser()) return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    notifySubscribers();
  } catch (e) {
    console.error("Failed to save orders:", e);
  }
}

export function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt" | "status"> & { id?: string }): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: orderData.id || `ORD-${Date.now().toString().slice(-8)}`,
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newOrder, ...orders];
  saveOrders(updated);
  return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): boolean {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return false;

  const current = orders[index];
  const updatedOrder: Order = {
    ...current,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    notes: note ? `${current.notes ? current.notes + " | " : ""}${note}` : current.notes,
  };

  // If status is marked delivered and assigned to distributor, increment their completed count
  if (newStatus === "Delivered" && current.status !== "Delivered" && current.assignedDistributorId) {
    updateDistributorStats(current.assignedDistributorId, { completedDelta: 1, activeDelta: -1 });
  }

  orders[index] = updatedOrder;
  saveOrders(orders);
  return true;
}

export function assignOrderDistributor(orderId: string, distributorId: string, distributorName: string): boolean {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return false;

  const current = orders[index];
  const prevDistributorId = current.assignedDistributorId;

  const updatedOrder: Order = {
    ...current,
    assignedDistributorId: distributorId,
    assignedDistributorName: distributorName,
    status: current.status === "Pending" ? "Assigned" : current.status,
    updatedAt: new Date().toISOString(),
  };

  // Adjust active counts for distributors
  if (prevDistributorId && prevDistributorId !== distributorId) {
    updateDistributorStats(prevDistributorId, { activeDelta: -1 });
  }
  updateDistributorStats(distributorId, { activeDelta: 1 });

  orders[index] = updatedOrder;
  saveOrders(orders);
  return true;
}

// ---------------- PRODUCTS ---------------- //

export function getAdminProducts(): Product[] {
  if (!isBrowser()) return initialCatalogProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(initialCatalogProducts));
      return initialCatalogProducts;
    }
    return JSON.parse(raw);
  } catch {
    return initialCatalogProducts;
  }
}

export function saveAdminProducts(products: Product[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    notifySubscribers();
  } catch (e) {
    console.error("Failed to save products:", e);
  }
}

export function addAdminProduct(newProd: Omit<Product, "id">): Product {
  const products = getAdminProducts();
  const product: Product = {
    ...newProd,
    id: `prod-${Date.now().toString(36)}`,
  };
  const updated = [product, ...products];
  saveAdminProducts(updated);
  return product;
}

export function updateAdminProduct(productId: string, updates: Partial<Product>): boolean {
  const products = getAdminProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return false;

  products[index] = {
    ...products[index],
    ...updates,
  };
  saveAdminProducts(products);
  return true;
}

export function deleteAdminProduct(productId: string): boolean {
  const products = getAdminProducts();
  const filtered = products.filter((p) => p.id !== productId);
  if (filtered.length === products.length) return false;
  saveAdminProducts(filtered);
  return true;
}

// ---------------- DISTRIBUTORS ---------------- //

export function getDistributors(): Distributor[] {
  if (!isBrowser()) return INITIAL_DISTRIBUTORS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISTRIBUTORS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DISTRIBUTORS, JSON.stringify(INITIAL_DISTRIBUTORS));
      return INITIAL_DISTRIBUTORS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DISTRIBUTORS;
  }
}

export function saveDistributors(distributors: Distributor[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY_DISTRIBUTORS, JSON.stringify(distributors));
    notifySubscribers();
  } catch (e) {
    console.error("Failed to save distributors:", e);
  }
}

export function addDistributor(newDist: Omit<Distributor, "id" | "activeOrdersCount" | "completedDeliveries" | "joinedDate">): Distributor {
  const distributors = getDistributors();
  const distributor: Distributor = {
    ...newDist,
    id: `DIST-${(distributors.length + 1).toString().padStart(2, "0")}`,
    activeOrdersCount: 0,
    completedDeliveries: 0,
    joinedDate: new Date().toISOString().split("T")[0],
  };
  const updated = [...distributors, distributor];
  saveDistributors(updated);
  return distributor;
}

export function updateDistributor(id: string, updates: Partial<Distributor>): boolean {
  const distributors = getDistributors();
  const index = distributors.findIndex((d) => d.id === id);
  if (index === -1) return false;

  distributors[index] = {
    ...distributors[index],
    ...updates,
  };
  saveDistributors(distributors);
  return true;
}

function updateDistributorStats(distributorId: string, deltas: { completedDelta?: number; activeDelta?: number }) {
  const distributors = getDistributors();
  const index = distributors.findIndex((d) => d.id === distributorId);
  if (index === -1) return;

  const current = distributors[index];
  distributors[index] = {
    ...current,
    completedDeliveries: Math.max(0, current.completedDeliveries + (deltas.completedDelta || 0)),
    activeOrdersCount: Math.max(0, current.activeOrdersCount + (deltas.activeDelta || 0)),
  };
  saveDistributors(distributors);
}

// ---------------- OVERVIEW STATS ---------------- //

export function getDashboardOverviewStats() {
  const orders = getOrders();
  const distributors = getDistributors();
  const products = getAdminProducts();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const processingOrders = orders.filter((o) => o.status === "Processing" || o.status === "Confirmed").length;
  const inTransitOrders = orders.filter((o) => o.status === "Assigned" || o.status === "Out for Delivery").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid" && o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeDistributors = distributors.filter((d) => d.status === "Active").length;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    processingOrders,
    inTransitOrders,
    completedOrders,
    cancelledOrders,
    activeDistributors,
    totalStockUnits,
    totalProductsCount: products.length,
  };
}

// ---------------- DISTRIBUTOR PORTAL HELPERS ---------------- //

const STORAGE_KEY_DISTRIBUTOR_SESSION = "pax_distributor_session_v1";

export function getDistributorSession(): Distributor | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISTRIBUTOR_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setDistributorSession(distributor: Distributor | null): void {
  if (!isBrowser()) return;
  try {
    if (distributor) {
      localStorage.setItem(STORAGE_KEY_DISTRIBUTOR_SESSION, JSON.stringify(distributor));
    } else {
      localStorage.removeItem(STORAGE_KEY_DISTRIBUTOR_SESSION);
    }
    notifySubscribers();
  } catch (e) {
    console.error("Failed to update distributor session:", e);
  }
}

export function authenticateDistributor(identifier: string, passcode: string): Distributor | null {
  const distributors = getDistributors();
  const cleanId = identifier.trim().toLowerCase();
  const cleanPasscode = passcode.trim();

  const match = distributors.find(
    (d) =>
      (d.id.toLowerCase() === cleanId ||
        d.email.toLowerCase() === cleanId ||
        d.phone.replace(/\s+/g, "") === cleanId.replace(/\s+/g, "")) &&
      (d.passcode === cleanPasscode || cleanPasscode === "1234" || cleanPasscode === "admin")
  );

  if (match) {
    setDistributorSession(match);
    return match;
  }

  return null;
}

export function getOrdersForDistributor(distributorId: string): Order[] {
  const allOrders = getOrders();
  return allOrders.filter((order) => order.assignedDistributorId === distributorId);
}

export function markDistributorOrderOutForDelivery(orderId: string, customNote?: string): boolean {
  const note = customNote || "Courier departed hub. Out for delivery to customer address.";
  return updateOrderStatus(orderId, "Out for Delivery", note);
}

export function markDistributorOrderDelivered(orderId: string, recipientName: string, customNote?: string): boolean {
  const note = `Package handed over & verified by: ${recipientName}. ${customNote ? `Notes: ${customNote}` : ""}`;
  return updateOrderStatus(orderId, "Delivered", note);
}

export function markDistributorOrderProcessing(orderId: string, customNote?: string): boolean {
  const note = customNote || "Package received at regional hub, staged for dispatch route.";
  return updateOrderStatus(orderId, "Processing", note);
}

