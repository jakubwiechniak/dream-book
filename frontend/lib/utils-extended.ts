// Utility functions for common operations

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind CSS class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: string | Date, locale = "en-US"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date: string | Date, locale = "en-US"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const value = String(item[key])
    if (!groups[value]) {
      groups[value] = []
    }
    groups[value].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    if (aValue < bValue) return direction === "asc" ? -1 : 1
    if (aValue > bValue) return direction === "asc" ? 1 : -1
    return 0
  })
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || ""
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"]
  return imageExtensions.includes(getFileExtension(filename))
}

// URL utilities
export function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, unknown>
): string {
  const url = new URL(path, baseUrl)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

export function parseUrlParams(url: string): Record<string, string> {
  const urlObj = new URL(url)
  const params: Record<string, string> = {}

  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })

  return params
}

// Local storage utilities with error handling
export function setLocalStorage(key: string, value: unknown): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error("Error setting localStorage:", error)
  }
}

export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    }
  } catch (error) {
    console.error("Error getting localStorage:", error)
  }
  return defaultValue || null
}

export function removeLocalStorage(key: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
    }
  } catch (error) {
    console.error("Error removing localStorage:", error)
  }
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unexpected error occurred"
}

export function isApiError(
  error: unknown
): error is { message: string; status?: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  )
}

// Rating utilities
export function formatRating(rating: number, decimals = 1): string {
  return rating.toFixed(decimals)
}

export function getRatingStars(rating: number): {
  filled: number
  half: boolean
  empty: number
} {
  const filled = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - filled - (half ? 1 : 0)

  return { filled, half, empty }
}

// Search utilities
export function highlightText(text: string, query: string): string {
  if (!query) return text

  const regex = new RegExp(`(${query})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

export function fuzzySearch(items: string[], query: string): string[] {
  if (!query) return items

  const lowerQuery = query.toLowerCase()
  return items.filter((item) => item.toLowerCase().includes(lowerQuery))
}
