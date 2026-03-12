import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ACCESS_TOKEN_STORAGE_KEY } from "@/lib/auth-constants";
import { getUserRoleFromToken } from "@/lib/jwt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(AUTH_ACCESS_TOKEN_STORAGE_KEY)?.value;

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

  // If accessing protected route without token, redirect to home for Google sign-in
  if ((isAdminRoute || isManagerRoute) && !accessToken) {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("redirect", pathname);
    homeUrl.searchParams.set("auth", "google");
    return NextResponse.redirect(homeUrl);
  }

  // Check role-based access
  if (accessToken) {
    const role = getUserRoleFromToken(accessToken);

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
