"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ResidentDirectory } from "@/components/resident/resident-directory"
import { User, Megaphone, Calendar, Users } from "lucide-react"

const sidebarItems = [
  {
    title: "Profile",
    href: "/resident/dashboard",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    title: "Announcements",
    href: "/resident/announcements",
    icon: <Megaphone className="mr-2 h-4 w-4" />,
  },
  {
    title: "Phases",
    href: "/resident/phases",
    icon: <Calendar className="mr-2 h-4 w-4" />,
  },
  {
    title: "Residents",
    href: "/resident/residents",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
]

export default function ResidentDirectoryPage() {
  return (
    <DashboardLayout title="Resident Directory" sidebarItems={sidebarItems} requiredRole="resident">
      <ResidentDirectory />
    </DashboardLayout>
  )
}
