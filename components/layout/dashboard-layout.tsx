"use client"

import type React from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { ProtectedRoute } from "../auth/protected-route"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  sidebarItems: Array<{
    title: string
    href: string
    icon: React.ReactNode
  }>
  requiredRole?: "admin" | "resident"
}

export function DashboardLayout({ children, title, sidebarItems, requiredRole }: DashboardLayoutProps) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <div className="min-h-screen bg-background">
        <Header title={title} />
        <div className="flex">
          <aside className="w-64 border-r bg-muted/10">
            <Sidebar items={sidebarItems} />
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
