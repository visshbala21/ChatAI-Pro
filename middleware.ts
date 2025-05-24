import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect chat and settings routes
        if (req.nextUrl.pathname.startsWith("/chat") || 
            req.nextUrl.pathname.startsWith("/settings") ||
            req.nextUrl.pathname.startsWith("/api/chat") ||
            req.nextUrl.pathname.startsWith("/api/conversations")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/chat/:path*",
    "/settings/:path*",
    "/api/chat/:path*",
    "/api/conversations/:path*"
  ]
} 