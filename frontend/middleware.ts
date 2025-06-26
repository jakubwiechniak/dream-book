import { NextRequest, NextResponse } from "next/server"

// Routes that require authentication
const protectedRoutes = [
  "/profile",
  "/favorites",
  "/bookings",
  "/stays",
  "/admin",
]

// Admin-only routes
const adminRoutes = ["/admin"]

// Helper function to get token from cookies
function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get("access_token")?.value || null
}

// Helper function to check if JWT token is expired
function isJWTExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = getTokenFromRequest(request)
  const isAuthenticated = token && !isJWTExpired(token)

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if the route is admin-only
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // If it's a protected route and user is not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/signin", request.url)
    signInUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If it's an admin route, check if user has admin role
  if (isAdminRoute && isAuthenticated) {
    // In a real app, you'd decode the JWT to check the role
    // For now, we'll let the component handle the role check
    // You might want to add role checking here if the role is in the JWT
  }

  // If user is authenticated and trying to access signin/signup, redirect to profile
  if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}
