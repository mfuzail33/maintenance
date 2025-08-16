"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api, type User } from "../lib/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isResident: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api
        .getCurrentUser()
        .then((response) => {
          if (response.success && response.data) {
            setUser(response.data)
          } else {
            localStorage.removeItem("token")
          }
        })
        .catch(() => {
          localStorage.removeItem("token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token)
        setUser(response.data.user)

        // Redirect based on role
        if (response.data.user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/resident/dashboard")
        }
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/resident/login")
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === "admin",
    isResident: user?.role === "resident",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
