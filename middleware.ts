import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req: NextRequest & { nextauth: any }) {
    // Check if user is authenticated
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Check if accessing admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (req.nextauth.token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
