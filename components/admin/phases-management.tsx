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
import { api, type Phase, type Payment } from "../../lib/api"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PhasesManagement() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPaymentsDialogOpen, setIsPaymentsDialogOpen] = useState(false)
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalAmount: "",
    endDate: "",
    notes: "",
  })
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
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

  const fetchPhasePayments = async (phaseId: string) => {
    try {
      const response = await api.getPhasePayments(phaseId)
      if (response.success) {
        setPayments(response.data.payments)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch phase payments",
        variant: "destructive",
      })
    }
  }

  const handleCreatePhase = async () => {
    try {
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("totalAmount", formData.totalAmount)
      if (formData.endDate) formDataObj.append("endDate", formData.endDate)
      if (formData.notes) formDataObj.append("notes", formData.notes)

      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formDataObj.append("images", selectedFiles[i])
        }
      }

      const response = await api.createPhase(formDataObj)
      if (response.success) {
        toast({
          title: "Success",
          description: "Phase created successfully",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchPhases()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create phase",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePhase = async () => {
    if (!selectedPhase) return

    try {
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("totalAmount", formData.totalAmount)
      if (formData.endDate) formDataObj.append("endDate", formData.endDate)
      if (formData.notes) formDataObj.append("notes", formData.notes)

      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formDataObj.append("images", selectedFiles[i])
        }
      }

      const response = await api.updatePhase(selectedPhase._id, formDataObj)
      if (response.success) {
        toast({
          title: "Success",
          description: "Phase updated successfully",
        })
        setIsEditDialogOpen(false)
        resetForm()
        fetchPhases()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update phase",
        variant: "destructive",
      })
    }
  }

  const handleDeletePhase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this phase?")) return

    try {
      const response = await api.deletePhase(id)
      if (response.success) {
        toast({
          title: "Success",
          description: "Phase deleted successfully",
        })
        fetchPhases()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete phase",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      totalAmount: "",
      endDate: "",
      notes: "",
    })
    setSelectedFiles(null)
    setSelectedPhase(null)
  }

  const openEditDialog = (phase: Phase) => {
    setSelectedPhase(phase)
    setFormData({
      title: phase.title,
      description: phase.description,
      totalAmount: phase.totalAmount.toString(),
      endDate: phase.endDate ? new Date(phase.endDate).toISOString().split("T")[0] : "",
      notes: phase.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const openPaymentsDialog = (phase: Phase) => {
    setSelectedPhase(phase)
    fetchPhasePayments(phase._id)
    setIsPaymentsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Phases Management</CardTitle>
          <CardDescription>Manage development phases and track payment status</CardDescription>
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
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Phase
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Phase</DialogTitle>
                  <DialogDescription>Add a new development phase</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter phase title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter phase description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      <Input
                        id="totalAmount"
                        type="number"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                        placeholder="Enter total amount"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes (optional)"
                      rows={2}
                    />
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
                  <Button onClick={handleCreatePhase}>Create Phase</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading phases...
                    </TableCell>
                  </TableRow>
                ) : phases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No phases found
                    </TableCell>
                  </TableRow>
                ) : (
                  phases.map((phase) => (
                    <TableRow key={phase._id}>
                      <TableCell className="font-medium">{phase.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            phase.status === "active"
                              ? "default"
                              : phase.status === "completed"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {phase.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${phase.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{phase.completionPercentage}%</TableCell>
                      <TableCell>{new Date(phase.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openPaymentsDialog(phase)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(phase)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeletePhase(phase._id)}>
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
            <DialogTitle>Edit Phase</DialogTitle>
            <DialogDescription>Update phase information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter phase title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter phase description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-totalAmount">Total Amount</Label>
                <Input
                  id="edit-totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  placeholder="Enter total amount"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes (optional)"
                rows={2}
              />
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
            <Button onClick={handleUpdatePhase}>Update Phase</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payments Dialog */}
      <Dialog open={isPaymentsDialogOpen} onOpenChange={setIsPaymentsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Phase Payments - {selectedPhase?.title}</DialogTitle>
            <DialogDescription>Payment status for all residents in this phase</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Flat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.resident.residentName}</TableCell>
                    <TableCell>{payment.resident.flatNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.paymentStatus === "paid"
                            ? "secondary"
                            : payment.paymentStatus === "partial"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {payment.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${payment.amountPaid.toLocaleString()}</TableCell>
                    <TableCell>${payment.remainingAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(payment.dueDate).toLocaleDateString()}
                      {payment.isOverdue && (
                        <Badge variant="destructive" className="ml-2">
                          Overdue
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
