// API client with authentication interceptors for Flask backend

import {
  getAccessToken,
  refreshAccessToken,
  setTokens,
  clearTokens,
  isTokenExpired,
} from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface RequestConfig extends RequestInit {
  requireAuth?: boolean
}

class APIClient {
  private baseURL: string
  private isRefreshing = false
  private refreshSubscribers: Array<(token: string) => void> = []

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback)
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  private async handleTokenRefresh(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.subscribeTokenRefresh(resolve)
      })
    }

    this.isRefreshing = true

    try {
      const { access_token } = await refreshAccessToken()
      setTokens(access_token, getAccessToken() || "")
      this.onRefreshed(access_token)
      this.isRefreshing = false
      return access_token
    } catch (error) {
      this.isRefreshing = false
      clearTokens()
      if (typeof window !== "undefined") {
        window.location.href = "/signin"
      }
      throw error
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requireAuth = false, ...requestConfig } = config
    const url = `${this.baseURL}${endpoint}`

    // Setup headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(requestConfig.headers as Record<string, string>),
    }

    // Add auth header if required
    if (requireAuth) {
      let token = getAccessToken()

      if (token && isTokenExpired(token)) {
        token = await this.handleTokenRefresh()
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    const response = await fetch(url, {
      ...requestConfig,
      headers,
    })

    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401 && requireAuth) {
      try {
        const newToken = await this.handleTokenRefresh()
        const newHeaders = { ...headers, Authorization: `Bearer ${newToken}` }

        // Retry the request with new token
        const retryResponse = await fetch(url, {
          ...requestConfig,
          headers: newHeaders,
        })

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${retryResponse.status}`)
        }

        return retryResponse.json()
      } catch (error) {
        clearTokens()
        if (typeof window !== "undefined") {
          window.location.href = "/signin"
        }
        throw error
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return response.json()
    }

    return response.text() as unknown as T
  }

  // HTTP methods
  async get<T>(endpoint: string, requireAuth = false): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "GET",
      requireAuth,
    })
  }

  async post<T>(
    endpoint: string,
    data?: Record<string, unknown>,
    requireAuth = false
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    })
  }

  async put<T>(
    endpoint: string,
    data?: Record<string, unknown>,
    requireAuth = false
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    })
  }

  async patch<T>(
    endpoint: string,
    data?: Record<string, unknown>,
    requireAuth = false
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    })
  }

  async delete<T>(endpoint: string, requireAuth = false): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "DELETE",
      requireAuth,
    })
  }

  // File upload method
  async upload<T>(
    endpoint: string,
    formData: FormData,
    requireAuth = true
  ): Promise<T> {
    let token = getAccessToken()

    if (token && isTokenExpired(token)) {
      token = await this.handleTokenRefresh()
    }

    const headers: Record<string, string> = {}
    if (requireAuth && token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    return response.json()
  }
}

// Create and export the API client instance
export const apiClient = new APIClient(API_BASE_URL)

// Export commonly used API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post("/auth/login", credentials),

  register: (userData: {
    email: string
    password: string
    name: string
    role?: string
  }) => apiClient.post("/auth/register", userData),

  logout: () => apiClient.post("/auth/logout", {}, true),

  refreshToken: () => apiClient.post("/auth/refresh", {}, true),

  getCurrentUser: () => apiClient.get("/auth/me", true),

  updateProfile: (data: Record<string, unknown>) =>
    apiClient.patch("/auth/profile", data, true),
}

export const hotelsAPI = {
  getAll: (params?: Record<string, string | number>) => {
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : ""
    return apiClient.get(`/api/listings${queryString}`)
  },

  getById: (id: string) => apiClient.get(`/api/listings/${id}`),

  search: (searchParams: Record<string, unknown>) =>
    apiClient.post("/api/listings/search", searchParams),

  create: (hotelData: Record<string, unknown>) =>
    apiClient.post("/api/listings", hotelData, true),

  update: (id: string, hotelData: Record<string, unknown>) =>
    apiClient.put(`/api/listings/${id}`, hotelData, true),

  delete: (id: string) => apiClient.delete(`/api/listings/${id}`, true),
}

export const bookingsAPI = {
  getAll: () => apiClient.get("/bookings", true),

  getById: (id: string) => apiClient.get(`/bookings/${id}`, true),

  create: (bookingData: Record<string, unknown>) =>
    apiClient.post("/bookings", bookingData, true),

  update: (id: string, bookingData: Record<string, unknown>) =>
    apiClient.put(`/bookings/${id}`, bookingData, true),

  cancel: (id: string) => apiClient.delete(`/bookings/${id}`, true),
}

export const reviewsAPI = {
  getByHotel: (hotelId: string) => apiClient.get(`/hotels/${hotelId}/reviews`),

  create: (reviewData: Record<string, unknown>) =>
    apiClient.post("/reviews", reviewData, true),

  update: (id: string, reviewData: Record<string, unknown>) =>
    apiClient.put(`/reviews/${id}`, reviewData, true),

  delete: (id: string) => apiClient.delete(`/reviews/${id}`, true),
}

export const adminAPI = {
  getUsers: () => apiClient.get("/api/admin/users/", true),

  updateUser: (userId: string, data: { role?: string; is_active?: boolean }) =>
    apiClient.patch(`/api/admin/users/${userId}/`, data, true),

  updateUserRole: (userId: string, role: string) =>
    apiClient.patch(`/api/admin/users/${userId}/`, { role }, true),

  activateUser: (userId: string) =>
    apiClient.post(`/api/admin/users/${userId}/activate/`, {}, true),

  deactivateUser: (userId: string) =>
    apiClient.post(`/api/admin/users/${userId}/deactivate/`, {}, true),

  updateUserStatus: (userId: string, isActive: boolean) =>
    isActive 
      ? apiClient.post(`/api/admin/users/${userId}/activate/`, {}, true)
      : apiClient.post(`/api/admin/users/${userId}/deactivate/`, {}, true),

  getAnalytics: () => apiClient.get("/api/admin/analytics/", true),

  // Hotel management
  getHotels: () => apiClient.get("/api/hotels/", true),

  createHotel: (hotelData: {
    title: string;
    description: string;
    price_per_night: number;
    location: string;
    property_type: string;
    latitude: number;
    longitude: number;
    image_url: string;
  }) => apiClient.post("/api/hotels/", hotelData, true),

  deleteHotel: (hotelId: string) => apiClient.delete(`/api/hotels/${hotelId}/`, true),
}

export default apiClient
