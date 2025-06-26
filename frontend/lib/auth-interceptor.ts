// Enhanced API client with automatic token refresh
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  isTokenExpired,
  refreshAccessToken,
} from "./auth"

class APIClient {
  private baseURL: string
  private isRefreshing = false
  private refreshPromise: Promise<string | null> | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  }

  private async makeRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    let token = getAccessToken()

    // Check if token needs refresh
    if (token && isTokenExpired(token)) {
      token = await this.refreshTokenIfNeeded()
    }

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers,
    })

    // If we get 401, try to refresh token once
    if (response.status === 401 && token && !this.isRefreshing) {
      const newToken = await this.refreshTokenIfNeeded()
      if (newToken) {
        return this.makeRequest(url, options)
      }
    }

    return response
  }

  private async refreshTokenIfNeeded(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh()

    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const { access_token } = await refreshAccessToken()
      setTokens(access_token, getRefreshToken() || "")
      return access_token
    } catch (error) {
      console.error("Token refresh failed:", error)
      clearTokens()
      // Redirect to login if needed
      if (typeof window !== "undefined") {
        window.location.href = "/signin"
      }
      return null
    }
  }

  async post(url: string, data?: unknown): Promise<Response> {
    return this.makeRequest(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async get(
    url: string,
    options: { timeout?: number } = {}
  ): Promise<Response> {
    const { timeout = 10000, ...requestOptions } = options

    if (timeout) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const response = await this.makeRequest(url, {
          method: "GET",
          signal: controller.signal,
          ...requestOptions,
        })
        clearTimeout(timeoutId)
        return response
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }

    return this.makeRequest(url, { method: "GET", ...requestOptions })
  }

  async put(url: string, data?: unknown): Promise<Response> {
    return this.makeRequest(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete(url: string): Promise<Response> {
    return this.makeRequest(url, { method: "DELETE" })
  }
}

export const apiClient = new APIClient()
