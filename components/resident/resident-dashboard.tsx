"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api, type User, type Announcement } from "../../lib/api"
import { useAuth } from "../../contexts/auth-context"
import { Edit, Mail, Home, Calendar, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import UserIcon from "@/components/icons/user-icon" // Importing UserIcon

export function ResidentDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    residentName: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const [profileResponse, announcementsResponse] = await Promise.all([
        api.getProfile(),
        api.getAnnouncements({ limit: 5 }),
      ])

      if (profileResponse.success) {
        setProfile(profileResponse.data)
        setFormData({ residentName: profileResponse.data.residentName })
      }

      if (announcementsResponse.success) {
        setRecentAnnouncements(announcementsResponse.data.announcements)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await api.updateProfile(formData)
      if (response.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        setProfile(response.data)
        setIsEditDialogOpen(false)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Information</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" /> {/* Replaced User with UserIcon */}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" /> {/* Replaced User with UserIcon */}
                <span className="text-sm">{profile?.residentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Flat {profile?.flatNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Update your profile information</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.residentName}
                      onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input value={profile?.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Flat Number</Label>
                    <Input value={profile?.flatNumber} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Flat number cannot be changed</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateProfile}>Update Profile</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Badge variant={profile?.status === "active" ? "default" : "destructive"}>{profile?.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your account is currently {profile?.status === "active" ? "active and in good standing" : "restricted"}
              </p>
              {profile?.lastLogin && (
                <p className="text-xs text-muted-foreground">
                  Last login: {new Date(profile.lastLogin).toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                {recentAnnouncements.length} new announcement{recentAnnouncements.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-muted-foreground">Check the announcements section for updates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>Latest community updates and notices</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAnnouncements.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent announcements</p>
          ) : (
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                      {announcement.isSticky && <Badge variant="outline">Pinned</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{announcement.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {announcement.createdBy.residentName}</span>
                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              <div className="text-center">
                <Button variant="outline" asChild>
                  <a href="/resident/announcements">View All Announcements</a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
