import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { USER_ROLE } from "./lib/types";

export const middleware = withAuth(
  function middleware(req: NextRequest & { nextauth: any }) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/admin")) {
      const token = req.nextauth.token;

      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }

      if (token.role !== USER_ROLE.ADMIN) {
        return NextResponse.redirect(new URL("/", req.url));
      }
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
