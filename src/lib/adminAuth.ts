export const ADMIN_COOKIE_NAME = "pax_admin_session";

export interface AdminSessionData {
  id: string;
  email: string;
  name: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

const DEFAULT_SECRET = "pax_gadgets_enterprise_admin_master_secret_2026";

/**
 * Creates a simple base64url encoded signature using subtle crypto
 */
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Signs an admin session payload
 */
export async function createAdminSessionToken(
  adminInfo: { id?: string; email: string; name?: string }
): Promise<string> {
  const now = Date.now();
  const payload: AdminSessionData = {
    id: adminInfo.id || "admin_master_01",
    email: adminInfo.email,
    name: adminInfo.name || "Pax Executive Admin",
    role: "admin",
    issuedAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadStr = JSON.stringify(payload);
  const payloadBase64 = typeof btoa !== "undefined"
    ? btoa(payloadStr)
    : Buffer.from(payloadStr).toString("base64");

  const key = await getCryptoKey(process.env.ADMIN_JWT_SECRET || DEFAULT_SECRET);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadBase64));
  const signatureHex = bufferToHex(signatureBuffer);

  return `${payloadBase64}.${signatureHex}`;
}

/**
 * Validates the admin session token
 */
export async function verifyAdminSessionToken(
  token: string | null | undefined
): Promise<AdminSessionData | null> {
  if (!token || !token.includes(".")) {
    return null;
  }

  try {
    const [payloadBase64, providedSigHex] = token.split(".");
    if (!payloadBase64 || !providedSigHex) return null;

    const key = await getCryptoKey(process.env.ADMIN_JWT_SECRET || DEFAULT_SECRET);
    const enc = new TextEncoder();
    const expectedSigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadBase64));
    const expectedSigHex = bufferToHex(expectedSigBuffer);

    if (expectedSigHex !== providedSigHex) {
      return null;
    }

    const payloadJson = typeof atob !== "undefined"
      ? atob(payloadBase64)
      : Buffer.from(payloadBase64, "base64").toString("utf-8");

    const payload = JSON.parse(payloadJson) as AdminSessionData;

    // Check expiration
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return null;
    }

    if (payload.role !== "admin") {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("[AdminAuth] Token verification failed:", err);
    return null;
  }
}
