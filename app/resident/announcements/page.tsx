"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ResidentAnnouncements } from "@/components/resident/resident-announcements"
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

export default function ResidentAnnouncementsPage() {
  return (
    <DashboardLayout title="Announcements" sidebarItems={sidebarItems} requiredRole="resident">
      <ResidentAnnouncements />
    </DashboardLayout>
  )
}
