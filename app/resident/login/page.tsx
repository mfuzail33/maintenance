"use client"

import { AuthProvider } from "@/contexts/auth-context"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { LoginForm } from "@/components/auth/login-form"

function ResidentLoginContent() {
  const { loading } = useAuthRedirect()

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

  return <LoginForm userType="resident" />
}

export default function ResidentLoginPage() {
  return (
    <AuthProvider>
      <ResidentLoginContent />
    </AuthProvider>
  )
}
