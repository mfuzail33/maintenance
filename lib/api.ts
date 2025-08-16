const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

export interface User {
  id: string
  residentName: string
  email: string
  flatNumber: string
  role: "admin" | "resident"
  status: "active" | "banned"
  lastLogin?: string
  createdAt: string
}

export interface Phase {
  _id: string
  title: string
  description: string
  images: Array<{
    filename: string
    originalName: string
    path: string
    size: number
    uploadDate: string
  }>
  status: "active" | "completed" | "cancelled"
  totalAmount: number
  startDate: string
  endDate?: string
  notes?: string
  completionPercentage: number
  createdBy: {
    _id: string
    residentName: string
  }
  createdAt: string
}

export interface Payment {
  _id: string
  resident: {
    _id: string
    residentName: string
    flatNumber: string
  }
  phase: {
    _id: string
    title: string
  }
  paymentStatus: "unpaid" | "partial" | "paid"
  totalAmount: number
  amountPaid: number
  remainingAmount: number
  paymentDate?: string
  dueDate: string
  isOverdue: boolean
}

export interface Announcement {
  _id: string
  title: string
  description: string
  images: Array<{
    filename: string
    originalName: string
    path: string
    size: number
  }>
  priority: "low" | "medium" | "high" | "urgent"
  status: "draft" | "published" | "archived"
  isSticky: boolean
  tags: string[]
  viewCount: number
  createdBy: {
    _id: string
    residentName: string
  }
  createdAt: string
  publishDate?: string
  expiryDate?: string
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API request error:", error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async getCurrentUser() {
    return this.request<User>("/auth/me")
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  // Admin endpoints
  async createResident(data: { residentName: string; email: string; password: string; flatNumber: string }) {
    return this.request<User>("/admin/residents", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getResidents(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)
    if (params?.search) searchParams.append("search", params.search)

    return this.request<{ residents: User[]; pagination: any }>(`/admin/residents?${searchParams}`)
  }

  async updateResident(id: string, data: { residentName?: string; email?: string; flatNumber?: string }) {
    return this.request<User>(`/admin/residents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteResident(id: string) {
    return this.request(`/admin/residents/${id}`, {
      method: "DELETE",
    })
  }

  async toggleBanResident(id: string) {
    return this.request<User>(`/admin/residents/${id}/ban`, {
      method: "PUT",
    })
  }

  async getDashboardStats() {
    return this.request("/admin/dashboard-stats")
  }

  // Phases endpoints
  async getPhases(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)
    if (params?.search) searchParams.append("search", params.search)

    return this.request<{ phases: Phase[]; pagination: any }>(`/phases?${searchParams}`)
  }

  async getPhase(id: string) {
    return this.request<Phase>(`/phases/${id}`)
  }

  async createPhase(formData: FormData) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/phases`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return response.json()
  }

  async updatePhase(id: string, formData: FormData) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/phases/${id}`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return response.json()
  }

  async deletePhase(id: string) {
    return this.request(`/phases/${id}`, {
      method: "DELETE",
    })
  }

  // Payments endpoints
  async getPayments(params?: { page?: number; limit?: number; status?: string; phaseId?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)
    if (params?.phaseId) searchParams.append("phaseId", params.phaseId)

    return this.request<{ payments: Payment[]; pagination: any }>(`/payments?${searchParams}`)
  }

  async getPhasePayments(phaseId: string) {
    return this.request<{ payments: Payment[]; pagination: any }>(`/payments/phase/${phaseId}`)
  }

  async updatePayment(
    id: string,
    data: { amountPaid: number; paymentMethod?: string; transactionId?: string; notes?: string },
  ) {
    return this.request<Payment>(`/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Announcements endpoints
  async getAnnouncements(params?: {
    page?: number
    limit?: number
    status?: string
    priority?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)
    if (params?.priority) searchParams.append("priority", params.priority)
    if (params?.search) searchParams.append("search", params.search)

    return this.request<{ announcements: Announcement[]; pagination: any }>(`/announcements?${searchParams}`)
  }

  async getAnnouncement(id: string) {
    return this.request<Announcement>(`/announcements/${id}`)
  }

  async createAnnouncement(formData: FormData) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return response.json()
  }

  async updateAnnouncement(id: string, formData: FormData) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return response.json()
  }

  async deleteAnnouncement(id: string) {
    return this.request(`/announcements/${id}`, {
      method: "DELETE",
    })
  }

  // Resident endpoints
  async getProfile() {
    return this.request<User>("/resident/profile")
  }

  async updateProfile(data: { residentName: string }) {
    return this.request<User>("/resident/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async getAllResidents(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)

    return this.request<{ residents: User[]; pagination: any }>(`/resident/all-residents?${searchParams}`)
  }

  // Analytics endpoints
  async getAnalytics(type: "dashboard" | "financial" | "trends" | "residents") {
    return this.request(`/analytics/${type}`)
  }
}

export const api = new ApiClient()
