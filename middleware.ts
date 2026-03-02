import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Single auth page: /signin. All auth actions redirect here; backend handles session.
// Dashboard and auth-protected tools redirect unauthenticated users in auth-context/layout.
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signin",
    "/signup",
    "/login",
  ],
};
