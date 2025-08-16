"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ResidentsManagement } from "@/components/admin/residents-management"
import { BarChart3, Users, Calendar, Megaphone } from "lucide-react"

const sidebarItems = [
  {
    title: "Analytics",
    href: "/admin/dashboard",
    icon: <BarChart3 className="mr-2 h-4 w-4" />,
  },
  {
    title: "Residents",
    href: "/admin/residents",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Phases",
    href: "/admin/phases",
    icon: <Calendar className="mr-2 h-4 w-4" />,
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: <Megaphone className="mr-2 h-4 w-4" />,
  },
]

export default function AdminResidentsPage() {
  return (
    <DashboardLayout title="Residents Management" sidebarItems={sidebarItems} requiredRole="admin">
      <ResidentsManagement />
    </DashboardLayout>
  )
}
