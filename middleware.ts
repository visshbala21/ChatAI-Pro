import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For now, let's disable middleware to avoid auth issues
  // We'll handle auth checks in the components instead
  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/settings/:path*"],
}
