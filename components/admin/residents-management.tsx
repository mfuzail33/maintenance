"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { api, type User } from "../../lib/api"
import { Plus, Search, Edit, Trash2, Ban, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ResidentsManagement() {
  const [residents, setResidents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedResident, setSelectedResident] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    residentName: "",
    email: "",
    password: "",
    flatNumber: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchResidents()
  }, [searchTerm, statusFilter])

  const fetchResidents = async () => {
    try {
      setLoading(true)
      const response = await api.getResidents({
        search: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      })
      if (response.success) {
        setResidents(response.data.residents)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch residents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateResident = async () => {
    try {
      const response = await api.createResident(formData)
      if (response.success) {
        toast({
          title: "Success",
          description: "Resident created successfully",
        })
        setIsCreateDialogOpen(false)
        setFormData({ residentName: "", email: "", password: "", flatNumber: "" })
        fetchResidents()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create resident",
        variant: "destructive",
      })
    }
  }

  const handleUpdateResident = async () => {
    if (!selectedResident) return

    try {
      const response = await api.updateResident(selectedResident.id, {
        residentName: formData.residentName,
        email: formData.email,
        flatNumber: formData.flatNumber,
      })
      if (response.success) {
        toast({
          title: "Success",
          description: "Resident updated successfully",
        })
        setIsEditDialogOpen(false)
        setSelectedResident(null)
        setFormData({ residentName: "", email: "", password: "", flatNumber: "" })
        fetchResidents()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update resident",
        variant: "destructive",
      })
    }
  }

  const handleDeleteResident = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resident?")) return

    try {
      const response = await api.deleteResident(id)
      if (response.success) {
        toast({
          title: "Success",
          description: "Resident deleted successfully",
        })
        fetchResidents()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete resident",
        variant: "destructive",
      })
    }
  }

  const handleToggleBan = async (id: string) => {
    try {
      const response = await api.toggleBanResident(id)
      if (response.success) {
        toast({
          title: "Success",
          description: `Resident ${response.data.status === "banned" ? "banned" : "unbanned"} successfully`,
        })
        fetchResidents()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update resident status",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (resident: User) => {
    setSelectedResident(resident)
    setFormData({
      residentName: resident.residentName,
      email: resident.email,
      password: "",
      flatNumber: resident.flatNumber,
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Residents Management</CardTitle>
          <CardDescription>Manage resident accounts, permissions, and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search residents..."
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
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resident
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Resident</DialogTitle>
                  <DialogDescription>Add a new resident to the system</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.residentName}
                      onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                      placeholder="Enter resident name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="flatNumber">Flat Number</Label>
                    <Input
                      id="flatNumber"
                      value={formData.flatNumber}
                      onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                      placeholder="Enter flat number"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateResident}>Create Resident</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Flat Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading residents...
                    </TableCell>
                  </TableRow>
                ) : residents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No residents found
                    </TableCell>
                  </TableRow>
                ) : (
                  residents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell className="font-medium">{resident.residentName}</TableCell>
                      <TableCell>{resident.email}</TableCell>
                      <TableCell>{resident.flatNumber}</TableCell>
                      <TableCell>
                        <Badge variant={resident.status === "active" ? "default" : "destructive"}>
                          {resident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(resident.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(resident)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleToggleBan(resident.id)}>
                            {resident.status === "banned" ? (
                              <UserCheck className="h-4 w-4" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteResident(resident.id)}>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resident</DialogTitle>
            <DialogDescription>Update resident information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.residentName}
                onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                placeholder="Enter resident name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-flatNumber">Flat Number</Label>
              <Input
                id="edit-flatNumber"
                value={formData.flatNumber}
                onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                placeholder="Enter flat number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateResident}>Update Resident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
