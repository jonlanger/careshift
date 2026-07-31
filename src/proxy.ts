import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isSessionCookie } from "@/lib/auth";

const protectedPrefixes = ["/today", "/patients", "/shifts", "/brief"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = isSessionCookie(request.cookies.get(SESSION_COOKIE)?.value);
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if ((pathname === "/sign-in" || pathname === "/sign-up") && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/today";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/today/:path*",
    "/patients/:path*",
    "/shifts/:path*",
    "/brief/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
