import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isSessionCookie } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = isSessionCookie(session);

  if (pathname.startsWith("/brief") && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if ((pathname === "/sign-in" || pathname === "/sign-up") && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/brief";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/brief/:path*", "/sign-in", "/sign-up"],
};
