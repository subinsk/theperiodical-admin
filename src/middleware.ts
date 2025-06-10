import { withAuth } from "next-auth/middleware"
import { NextResponse, type NextRequest } from "next/server"
import type { NextRequestWithAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req: NextRequestWithAuth): NextResponse {
    // Additional custom logic can go here if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }): boolean => {
        const { pathname }: { pathname: string } = req.nextUrl

        // Allow access to auth pages when not authenticated
        if (pathname.startsWith('/auth/')) {
          return true
        }

        // Protect dashboard routes - require authentication
        if (pathname.startsWith('/dashboard')) {
          return Boolean(token)
        }

        // Allow access to other pages
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Or be more specific with the routes you want to protect
    // '/dashboard/:path*',
    // '/auth/:path*'
  ]
}