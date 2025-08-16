"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { AuthProvider } from "@/contexts/auth-context"

function AdminLoginContent() {
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

  return <LoginForm userType="admin" />
}

export default function AdminLoginPage() {
  return (
    <AuthProvider>
      <AdminLoginContent />
    </AuthProvider>
  )
}
