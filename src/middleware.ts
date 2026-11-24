import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "./lib/adminAuth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin")) {
    // Allow public access ONLY to the admin login page
    if (pathname === "/admin/login") {
      // If user is ALREADY authenticated as admin and visits /admin/login, redirect them directly to /admin
      const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
      if (sessionCookie) {
        const adminSession = await verifyAdminSessionToken(sessionCookie);
        if (adminSession) {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
      }
      return NextResponse.next();
    }

    // Check for admin session cookie
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      // No cookie present: strictly deny access and redirect to /admin/login
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("unauthorized", "1");
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify cryptographic token
    const adminSession = await verifyAdminSessionToken(sessionCookie);
    if (!adminSession) {
      // Invalid or expired token: strictly deny access, delete corrupt cookie, redirect
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("expired", "1");
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(ADMIN_COOKIE_NAME);
      return res;
    }

    // Admin verified! Allow access.
    return NextResponse.next();
  }

  // Protect admin API endpoints except /api/admin/auth
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth")) {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const adminSession = await verifyAdminSessionToken(sessionCookie);

    if (!adminSession) {
      return NextResponse.json(
        { error: "Forbidden: Administrative credentials required." },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
