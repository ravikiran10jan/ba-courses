import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/achievement", "/payment-history", "/referral"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const session = request.cookies.get("ba-courses-session")?.value;
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route)) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (adminRoutes.some((route) => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/achievement/:path*",
    "/payment-history/:path*",
    "/referral/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
