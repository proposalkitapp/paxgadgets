export type AnalyticsEventType =
  | "product_view"
  | "add_to_cart"
  | "checkout_start";

export interface ProductViewProperties {
  productId: string;
  productName: string;
  category: string;
  price: number;
  slug: string;
  currency?: string;
}

export interface AddToCartProperties {
  productId: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  totalValue: number;
  currency?: string;
}

export interface CheckoutStartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface CheckoutStartProperties {
  cartCount: number;
  subtotal: number;
  currency?: string;
  items: CheckoutStartItem[];
}

export interface AnalyticsEventRecord {
  id: string;
  event: AnalyticsEventType;
  properties: Record<string, unknown>;
  timestamp: string;
  url?: string;
}

const STORAGE_KEY = "pax_analytics_events_v1";
const MAX_STORED_EVENTS = 50;

/**
 * Persist event to localStorage for real-time observability and audit
 */
function recordClientEvent(record: AnalyticsEventRecord) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: AnalyticsEventRecord[] = raw ? JSON.parse(raw) : [];
    const updated = [record, ...existing].slice(0, MAX_STORED_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("[Analytics] Local storage write error", err);
  }
}

/**
 * Retrieve recent events from localStorage
 */
export function getStoredEvents(): AnalyticsEventRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearStoredEvents() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * Core event tracking dispatcher
 */
export function trackEvent(
  event: AnalyticsEventType,
  properties: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  const timestamp = new Date().toISOString();
  const eventRecord: AnalyticsEventRecord = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    event,
    properties: {
      ...properties,
      currency: (properties.currency as string) || "NGN",
    },
    timestamp,
    url: window.location.pathname,
  };

  // 1. Dispatch custom DOM event for in-app real-time listeners
  try {
    window.dispatchEvent(
      new CustomEvent("pax:analytics", { detail: eventRecord })
    );
  } catch {}

  // 2. Push to window.dataLayer (standard GA4 / GTM format)
  try {
    const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    if (Array.isArray(dataLayer)) {
      dataLayer.push({
        event: `pax_${event}`,
        ...eventRecord.properties,
        timestamp,
      });
    }
  } catch {}

  // 3. Save to localStorage for instant local inspection
  recordClientEvent(eventRecord);

  // 4. Send beacon / POST to backend analytics endpoint
  try {
    const payload = JSON.stringify(eventRecord);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", payload);
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Silently handle offline/aborted fetches
      });
    }
  } catch (err) {
    console.debug("[Analytics] Failed to dispatch beacon", err);
  }

  // Developer console notification
  console.info(`[Analytics] [${event.toUpperCase()}]`, eventRecord.properties);
}

/**
 * Track Product View
 */
export function trackProductView(properties: ProductViewProperties): void {
  trackEvent("product_view", properties as unknown as Record<string, unknown>);
}

/**
 * Track Cart Addition
 */
export function trackAddToCart(properties: AddToCartProperties): void {
  trackEvent("add_to_cart", properties as unknown as Record<string, unknown>);
}

/**
 * Track Checkout Start
 */
export function trackCheckoutStart(properties: CheckoutStartProperties): void {
  trackEvent("checkout_start", properties as unknown as Record<string, unknown>);
}
