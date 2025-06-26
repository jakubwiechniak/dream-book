// Extended types for Flask backend integration

import { User } from "./auth"

export interface Hotel {
  id: string
  title: string
  description: string
  price_per_night: number
  location: string
  latitude?: number
  longitude?: number
  image_url: string
  images?: string[]
  amenities?: string[]
  max_guests: number
  bedrooms: number
  bathrooms: number
  rating?: number
  reviews_count?: number
  created_at: string
  updated_at?: string
  owner_id: string
  owner?: User
  is_available: boolean
}

export interface Booking {
  id: string
  hotel_id: string
  hotel?: Hotel
  user_id: string
  user?: User
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_status: "pending" | "paid" | "refunded"
  special_requests?: string
  created_at: string
  updated_at?: string
}

export interface Review {
  id: string
  hotel_id: string
  hotel?: Hotel
  user_id: string
  user?: User
  booking_id?: string
  rating: number
  comment: string
  cleanliness?: number
  communication?: number
  checkin?: number
  accuracy?: number
  location?: number
  value?: number
  created_at: string
  updated_at?: string
}

export interface SearchFilters {
  location?: string
  check_in?: string
  check_out?: string
  guests?: number
  min_price?: number
  max_price?: number
  amenities?: string[]
  property_type?: string
  rating?: number
  sort_by?: "price_asc" | "price_desc" | "rating" | "newest"
  page?: number
  limit?: number
}

export interface SearchResponse {
  hotels: Hotel[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  avatar_url?: string
  bio?: string
  location?: string
  date_of_birth?: string
  preferred_language?: string
  currency?: string
  role: "guest" | "landlord" | "admin"
  is_active: boolean
  email_verified: boolean
  phone_verified: boolean
  created_at: string
  updated_at?: string

  // Statistics
  total_bookings?: number
  total_properties?: number
  total_reviews?: number
  average_rating?: number

  // Settings
  notifications?: {
    email_bookings: boolean
    email_promotions: boolean
    push_bookings: boolean
    push_messages: boolean
  }
}

export interface Amenity {
  id: string
  name: string
  category: string
  icon?: string
}

export interface PropertyType {
  id: string
  name: string
  description: string
}

export interface Notification {
  id: string
  user_id: string
  type: "booking" | "payment" | "review" | "system"
  title: string
  message: string
  is_read: boolean
  created_at: string
  data?: Record<string, unknown>
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Form interfaces
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirm_password: string
  name: string
  role?: "guest" | "landlord"
  terms_accepted: boolean
}

export interface BookingForm {
  hotel_id: string
  check_in: string
  check_out: string
  guests: number
  special_requests?: string
}

export interface ReviewForm {
  hotel_id: string
  booking_id?: string
  rating: number
  comment: string
  cleanliness?: number
  communication?: number
  checkin?: number
  accuracy?: number
  location?: number
  value?: number
}

export interface HotelForm {
  title: string
  description: string
  price_per_night: number
  location: string
  latitude?: number
  longitude?: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  property_type: string
  images?: FileList
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}

// Error types
export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  message: string
  status: number
  errors?: ValidationError[]
}

// Admin interfaces
export interface AdminStats {
  total_users: number
  total_hotels: number
  total_bookings: number
  total_revenue: number
  recent_signups: number
  recent_bookings: number
  active_users: number
  occupancy_rate: number
}

export interface AdminUser extends UserProfile {
  last_login?: string
  login_count: number
  properties_count: number
  bookings_count: number
}

// Payment interfaces
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "bank_transfer"
  last4?: string
  brand?: string
  exp_month?: number
  exp_year?: number
  is_default: boolean
}
