import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

// Default admin credentials (can be overridden by environment variables)
const VALID_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@paxgadgets.com").toLowerCase();
const VALID_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "paxadmin2026";
const MASTER_SECURITY_PIN = process.env.ADMIN_MASTER_PIN || "2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, pin } = body;

    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedPassword = (password || "").trim();
    const normalizedPin = (pin || "").trim();

    // Verification check: email+password OR master PIN
    const isEmailValid = normalizedEmail === VALID_ADMIN_EMAIL;
    const isPasswordValid = normalizedPassword === VALID_ADMIN_PASSWORD;
    const isPinValid = normalizedPin === MASTER_SECURITY_PIN;

    const isAuthorized = (isEmailValid && isPasswordValid) || (isPinValid && (isEmailValid || !email));

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Invalid administrative credentials or security passcode." },
        { status: 401 }
      );
    }

    // Generate secure cryptographically-signed token
    const token = await createAdminSessionToken({
      id: "pax_superadmin_01",
      email: VALID_ADMIN_EMAIL,
      name: "Pax Executive Administrator",
    });

    const res = NextResponse.json({
      success: true,
      message: "Administrative session established.",
      user: {
        email: VALID_ADMIN_EMAIL,
        name: "Pax Executive Administrator",
        role: "admin",
      },
    });

    // Set HTTP-only secure cookie
    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (error) {
    console.error("[Admin Auth API] Sign-in error:", error);
    return NextResponse.json(
      { error: "Server authentication error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(cookie);

  if (!session) {
    return NextResponse.json(
      { authenticated: false, error: "No active admin session found." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}

export async function DELETE() {
  const res = NextResponse.json({
    success: true,
    message: "Admin session revoked.",
  });

  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return res;
}
