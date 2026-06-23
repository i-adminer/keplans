import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth/session";

const COOKIE_NAME = process.env.COOKIE_NAME || "keplans_auth";

// Public routes that don't require auth
const publicRoutes = [
  "/",
  "/plans",
  "/product",
  "/contact-us",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/payment/verify",
  "/api/admin/seed",
];

// Admin-only routes
const adminRoutes = ["/hp-admin"];

// Auth routes (redirect if already authenticated)
const authRoutes = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/hp-admin/signin",
  "/hp-admin/verify-otp",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  // Check if it's an auth route (check this first!)
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session) {
    if (session.role === "admin") {
      return NextResponse.redirect(new URL("/hp-admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Allow public routes and auth routes (already handled above)
  if (isPublicRoute || isAuthRoute) {
    return NextResponse.next();
  }

  // Check if route requires admin
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Protect admin routes
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/hp-admin/signin", request.url));
    }
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect all other routes (customer area)
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
