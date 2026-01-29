import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface DecodedToken {
  sub: string;
  email?: string;
  role?: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    const padded = padding ? base64 + "=".repeat(4 - padding) : base64;

    // In Node.js environment, use Buffer instead of atob
    const decoded = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(decoded) as DecodedToken;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

function getUserRole(token: string): string | null {
  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }

  if (decoded.role) {
    return decoded.role;
  }

  if (
    decoded.roles &&
    Array.isArray(decoded.roles) &&
    decoded.roles.length > 0
  ) {
    return decoded.roles[0];
  }

  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get access token from cookies or local storage (we'll use cookies for server-side)
  const accessToken = request.cookies.get("vocafy:accessToken")?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/register",
    "/",
    "/contact",
    "/introduction",
  ];

  // Static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protected routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isManagerRoute = pathname.startsWith("/manager");

  // If accessing protected route without token, redirect to login
  if ((isAdminRoute || isManagerRoute) && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  if (accessToken) {
    const role = getUserRole(accessToken);

    // Admin routes - only ADMIN can access
    if (isAdminRoute && role !== "ADMIN") {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Manager routes - MANAGER or ADMIN can access
    if (isManagerRoute && role !== "MANAGER" && role !== "ADMIN") {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }
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
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|images).*)",
  ],
};
