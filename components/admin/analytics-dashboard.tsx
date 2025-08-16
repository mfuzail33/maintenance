"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "../../lib/api"
import { Users, Home, CreditCard, TrendingUp, AlertCircle } from "lucide-react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DashboardStats {
  totalResidents: number
  activeResidents: number
  bannedResidents: number
  recentResidents: number
  totalPhases: number
  activePhases: number
  completedPhases: number
  totalPayments: number
  paidPayments: number
  unpaidPayments: number
  totalAnnouncements: number
  publishedAnnouncements: number
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashboardResponse, analyticsResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getAnalytics("dashboard"),
        ])

        if (dashboardResponse.success && analyticsResponse.success) {
          setStats({
            ...dashboardResponse.data,
            ...analyticsResponse.data,
          })
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-1" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Failed to load dashboard statistics</p>
      </div>
    )
  }

  const residentData = [
    { name: "Active", value: stats.activeResidents, color: "#8b5cf6" },
    { name: "Banned", value: stats.bannedResidents, color: "#dc2626" },
  ]

  const phaseData = [
    { name: "Active", value: stats.activePhases, color: "#8b5cf6" },
    { name: "Completed", value: stats.completedPhases, color: "#10b981" },
  ]

  const paymentData = [
    { name: "Paid", value: stats.paidPayments || 0, color: "#10b981" },
    { name: "Unpaid", value: stats.unpaidPayments || 0, color: "#dc2626" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResidents}</div>
            <p className="text-xs text-muted-foreground">{stats.recentResidents} new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Phases</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePhases}</div>
            <p className="text-xs text-muted-foreground">{stats.totalPhases} total phases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidPayments || 0}</div>
            <p className="text-xs text-muted-foreground">{stats.unpaidPayments || 0} pending payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedAnnouncements}</div>
            <p className="text-xs text-muted-foreground">{stats.totalAnnouncements} total announcements</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Resident Status</CardTitle>
            <CardDescription>Distribution of resident statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                active: { label: "Active", color: "#8b5cf6" },
                banned: { label: "Banned", color: "#dc2626" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={residentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {residentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phase Status</CardTitle>
            <CardDescription>Current phase distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                active: { label: "Active", color: "#8b5cf6" },
                completed: { label: "Completed", color: "#10b981" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={phaseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {phaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
            <CardDescription>Payment status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                paid: { label: "Paid", color: "#10b981" },
                unpaid: { label: "Unpaid", color: "#dc2626" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
