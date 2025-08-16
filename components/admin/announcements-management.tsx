"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { api, type Announcement } from "../../lib/api"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    isSticky: false,
    tags: "",
    expiryDate: "",
  })
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAnnouncements()
  }, [searchTerm, statusFilter, priorityFilter])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await api.getAnnouncements({
        search: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        priority: priorityFilter === "all" ? undefined : priorityFilter,
      })
      if (response.success) {
        setAnnouncements(response.data.announcements)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnnouncement = async () => {
    try {
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("priority", formData.priority)
      formDataObj.append("isSticky", formData.isSticky.toString())
      formDataObj.append("status", "published")
      if (formData.tags) formDataObj.append("tags", formData.tags)
      if (formData.expiryDate) formDataObj.append("expiryDate", formData.expiryDate)

      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formDataObj.append("images", selectedFiles[i])
        }
      }

      const response = await api.createAnnouncement(formDataObj)
      if (response.success) {
        toast({
          title: "Success",
          description: "Announcement created successfully",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchAnnouncements()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create announcement",
        variant: "destructive",
      })
    }
  }

  const handleUpdateAnnouncement = async () => {
    if (!selectedAnnouncement) return

    try {
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("priority", formData.priority)
      formDataObj.append("isSticky", formData.isSticky.toString())
      if (formData.tags) formDataObj.append("tags", formData.tags)
      if (formData.expiryDate) formDataObj.append("expiryDate", formData.expiryDate)

      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formDataObj.append("images", selectedFiles[i])
        }
      }

      const response = await api.updateAnnouncement(selectedAnnouncement._id, formDataObj)
      if (response.success) {
        toast({
          title: "Success",
          description: "Announcement updated successfully",
        })
        setIsEditDialogOpen(false)
        resetForm()
        fetchAnnouncements()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update announcement",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    try {
      const response = await api.deleteAnnouncement(id)
      if (response.success) {
        toast({
          title: "Success",
          description: "Announcement deleted successfully",
        })
        fetchAnnouncements()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      isSticky: false,
      tags: "",
      expiryDate: "",
    })
    setSelectedFiles(null)
    setSelectedAnnouncement(null)
  }

  const openEditDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      description: announcement.description,
      priority: announcement.priority,
      isSticky: announcement.isSticky,
      tags: announcement.tags.join(", "),
      expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate).toISOString().split("T")[0] : "",
    })
    setIsEditDialogOpen(true)
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Announcements Management</CardTitle>
          <CardDescription>Create and manage community announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search announcements..."
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>Create a new community announcement</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter announcement description"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="maintenance, community, urgent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isSticky"
                      checked={formData.isSticky}
                      onCheckedChange={(checked) => setFormData({ ...formData, isSticky: checked as boolean })}
                    />
                    <Label htmlFor="isSticky">Pin this announcement</Label>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="images">Images</Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setSelectedFiles(e.target.files)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading announcements...
                    </TableCell>
                  </TableRow>
                ) : announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No announcements found
                    </TableCell>
                  </TableRow>
                ) : (
                  announcements.map((announcement) => (
                    <TableRow key={announcement._id}>
                      <TableCell className="font-medium">
                        {announcement.title}
                        {announcement.isSticky && (
                          <Badge variant="outline" className="ml-2">
                            Pinned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            announcement.status === "published"
                              ? "default"
                              : announcement.status === "draft"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {announcement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{announcement.viewCount}</TableCell>
                      <TableCell>{new Date(announcement.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(announcement)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update announcement information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter announcement description"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="maintenance, community, urgent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isSticky"
                checked={formData.isSticky}
                onCheckedChange={(checked) => setFormData({ ...formData, isSticky: checked as boolean })}
              />
              <Label htmlFor="edit-isSticky">Pin this announcement</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-images">Add Images</Label>
              <Input
                id="edit-images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAnnouncement}>Update Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
