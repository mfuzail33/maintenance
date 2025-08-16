"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/auth-context"

export function useAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // User is already logged in, redirect to appropriate dashboard
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/resident/dashboard")
      }
    }
  }, [user, loading, router])

  return { user, loading }
}
