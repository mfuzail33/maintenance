"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "resident"
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredRole, redirectTo }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to appropriate login
        const loginPath = requiredRole === "admin" ? "/admin/login" : "/resident/login"
        router.push(redirectTo || loginPath)
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        // Wrong role, redirect to appropriate dashboard
        const dashboardPath = user.role === "admin" ? "/admin/dashboard" : "/resident/dashboard"
        router.push(dashboardPath)
        return
      }

      if (user.status === "banned") {
        // User is banned, redirect to login with error
        router.push("/resident/login?error=banned")
        return
      }
    }
  }, [user, loading, requiredRole, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || (requiredRole && user.role !== requiredRole) || user.status === "banned") {
    return null
  }

  return <>{children}</>
}
