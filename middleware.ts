import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req: NextRequest & { nextauth: any }) {
    const { pathname } = req.nextUrl;

    console.log("🔍 [MIDDLEWARE] Accessing:", pathname);

    if (pathname.startsWith("/admin")) {
      const token = req.nextauth.token;

      if (!token) {
        console.log("❌ [MIDDLEWARE] No token - redirecting to signin");
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }

      if (token.role !== "ADMIN") {
        console.log("❌ [MIDDLEWARE] User role:", token.role, "- not admin");
        return NextResponse.redirect(new URL("/", req.url));
      }

      console.log("✅ [MIDDLEWARE] Admin access granted");
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
