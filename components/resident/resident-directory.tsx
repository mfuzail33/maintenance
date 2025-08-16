"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { api, type User, type Payment } from "../../lib/api"
import { Search, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ResidentDirectory() {
  const [residents, setResidents] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [searchTerm])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [residentsResponse, paymentsResponse] = await Promise.all([
        api.getAllResidents({ search: searchTerm || undefined }),
        api.getPayments(),
      ])

      if (residentsResponse.success) {
        setResidents(residentsResponse.data.residents)
      }

      if (paymentsResponse.success) {
        setPayments(paymentsResponse.data.payments)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch resident data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Group payments by resident and phase
  const getResidentPaymentSummary = (residentId: string) => {
    const residentPayments = payments.filter((payment) => payment.resident._id === residentId)

    const totalAmount = residentPayments.reduce((sum, payment) => sum + payment.totalAmount, 0)
    const totalPaid = residentPayments.reduce((sum, payment) => sum + payment.amountPaid, 0)
    const totalRemaining = residentPayments.reduce((sum, payment) => sum + payment.remainingAmount, 0)

    const paidCount = residentPayments.filter((payment) => payment.paymentStatus === "paid").length
    const partialCount = residentPayments.filter((payment) => payment.paymentStatus === "partial").length
    const unpaidCount = residentPayments.filter((payment) => payment.paymentStatus === "unpaid").length
    const overdueCount = residentPayments.filter((payment) => payment.isOverdue).length

    return {
      totalAmount,
      totalPaid,
      totalRemaining,
      paidCount,
      partialCount,
      unpaidCount,
      overdueCount,
      totalPhases: residentPayments.length,
    }
  }

  const getPaymentStatusBadge = (summary: ReturnType<typeof getResidentPaymentSummary>) => {
    if (summary.overdueCount > 0) {
      return <Badge variant="destructive">Overdue ({summary.overdueCount})</Badge>
    }
    if (summary.unpaidCount > 0) {
      return <Badge variant="outline">Pending ({summary.unpaidCount})</Badge>
    }
    if (summary.partialCount > 0) {
      return <Badge variant="default">Partial ({summary.partialCount})</Badge>
    }
    if (summary.paidCount === summary.totalPhases && summary.totalPhases > 0) {
      return <Badge variant="secondary">All Paid</Badge>
    }
    return <Badge variant="outline">No Payments</Badge>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resident Directory
          </CardTitle>
          <CardDescription>View all residents and their payment status across phases</CardDescription>
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
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Flat Number</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Phases</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading residents...
                    </TableCell>
                  </TableRow>
                ) : residents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No residents found
                    </TableCell>
                  </TableRow>
                ) : (
                  residents.map((resident) => {
                    const paymentSummary = getResidentPaymentSummary(resident.id)
                    return (
                      <TableRow key={resident.id}>
                        <TableCell className="font-medium">{resident.residentName}</TableCell>
                        <TableCell>{resident.flatNumber}</TableCell>
                        <TableCell>{getPaymentStatusBadge(paymentSummary)}</TableCell>
                        <TableCell>
                          {paymentSummary.totalAmount > 0 ? `$${paymentSummary.totalAmount.toLocaleString()}` : "—"}
                        </TableCell>
                        <TableCell>
                          {paymentSummary.totalPaid > 0 ? `$${paymentSummary.totalPaid.toLocaleString()}` : "—"}
                        </TableCell>
                        <TableCell>
                          {paymentSummary.totalRemaining > 0
                            ? `$${paymentSummary.totalRemaining.toLocaleString()}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {paymentSummary.totalPhases > 0 ? (
                              <div className="space-y-1">
                                <div>{paymentSummary.totalPhases} total</div>
                                {paymentSummary.paidCount > 0 && (
                                  <div className="text-green-600">{paymentSummary.paidCount} paid</div>
                                )}
                                {paymentSummary.partialCount > 0 && (
                                  <div className="text-yellow-600">{paymentSummary.partialCount} partial</div>
                                )}
                                {paymentSummary.unpaidCount > 0 && (
                                  <div className="text-gray-600">{paymentSummary.unpaidCount} pending</div>
                                )}
                                {paymentSummary.overdueCount > 0 && (
                                  <div className="text-red-600">{paymentSummary.overdueCount} overdue</div>
                                )}
                              </div>
                            ) : (
                              "No phases"
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {residents.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {residents.length} resident{residents.length !== 1 ? "s" : ""}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
