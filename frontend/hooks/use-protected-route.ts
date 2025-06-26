"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface UseProtectedRouteOptions {
  redirectTo?: string
  allowedRoles?: string[]
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  const { redirectTo = "/signin", allowedRoles } = options

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (allowedRoles && user) {
        const hasPermission = allowedRoles.includes(user.role)
        setIsAuthorized(hasPermission)

        if (!hasPermission) {
          router.push("/unauthorized")
          return
        }
      }

      setIsAuthorized(true)
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, allowedRoles])

  return {
    isLoading,
    isAuthenticated,
    isAuthorized,
    user,
  }
}

// Hook for admin-only routes
export function useAdminRoute() {
  return useProtectedRoute({
    allowedRoles: ["admin"],
    redirectTo: "/unauthorized",
  })
}

// Hook for landlord or admin routes
export function useHostRoute() {
  return useProtectedRoute({
    allowedRoles: ["landlord", "admin"],
    redirectTo: "/unauthorized",
  })
}

// Hook for authenticated users only (any role)
export function useAuthenticatedRoute() {
  return useProtectedRoute({
    redirectTo: "/signin",
  })
}
