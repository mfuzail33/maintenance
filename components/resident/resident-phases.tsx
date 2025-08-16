"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { api, type Phase } from "../../lib/api"
import { Search, Calendar, DollarSign, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ResidentPhases() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchPhases()
  }, [searchTerm, statusFilter])

  const fetchPhases = async () => {
    try {
      setLoading(true)
      const response = await api.getPhases({
        search: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      })
      if (response.success) {
        setPhases(response.data.phases)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch phases",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Development Phases</CardTitle>
          <CardDescription>Track the progress of community development projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search phases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : phases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No phases found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {phases.map((phase) => (
                <Card key={phase._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{phase.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{phase.createdBy.residentName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(phase.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(phase.status)}>{phase.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">{phase.description}</p>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{phase.completionPercentage}%</span>
                      </div>
                      <Progress value={phase.completionPercentage} className="h-2" />
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${phase.totalAmount.toLocaleString()}</span>
                      <span className="text-muted-foreground">total budget</span>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Started:</span>
                        <span>{new Date(phase.startDate).toLocaleDateString()}</span>
                      </div>
                      {phase.endDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Target End:</span>
                          <span>{new Date(phase.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Images */}
                    {phase.images && phase.images.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Project Images</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {phase.images.slice(0, 4).map((image, index) => (
                            <div key={index} className="aspect-video bg-muted rounded-md overflow-hidden">
                              <img
                                src={`/phase-diagram.png?height=120&width=200&query=phase ${phase.title} image ${index + 1}`}
                                alt={`${phase.title} image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {phase.images.length > 4 && (
                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">+{phase.images.length - 4} more</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {phase.notes && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Notes</h4>
                        <p className="text-sm text-muted-foreground">{phase.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
