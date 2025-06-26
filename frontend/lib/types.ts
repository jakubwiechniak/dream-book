export interface Stay {
  id: string
  propertyName: string
  propertyType: string
  location: string
  checkIn: string
  checkOut: string
  nights: number
  guestName?: string
  hostName?: string
  guestImageUrl?: string
  hostImageUrl?: string
  imageUrl: string
  rating?: number
  status: "completed" | "upcoming"
  hasReviewed?: boolean
}

export interface Review {
  id: string
  stayId: string
  overallRating: number
  cleanliness: number
  communication: number
  checkIn: number
  accuracy: number
  comment: string
  createdAt: string
}

export interface Listing {
  id: number
  title: string
  description: string
  price_per_night: string
  location: string
  property_type?: "listing" | "hotel"
  latitude?: string | null
  longitude?: string | null
  image_url?: string | null
  created_at: string
  owner: number
  owner_username: string
}

export interface Hotel {
  id: number
  title: string
  description: string
  price_per_night: string
  location: string
  property_type?: "listing" | "hotel"
  latitude: string
  longitude: string
  image_url: string
  created_at: string
  owner: number
  owner_username: string
}

export interface Host {
  id: number
  user_id: number
  name: string
  location: string
  rating: number
  image: string
  details: string
}

export interface UserData {
  id: string
  name: string
  email: string
  role: "guest" | "landlord" | "admin"
  isActive: boolean
  joinedAt: string
  avatarUrl?: string
  properties?: number
  bookings?: number
}

export interface Room {
  id: string
  name: string
  type: string
  price: number
  description: string
  amenities: string[]
  maxGuests: number
  bedType: string
  view: string
  size: string
  images: string[]
}

export interface BookingDetails {
  hotelId: string
  hotelName?: string
  hotelLocation?: string
  hotelImage?: string
  roomId: string
  checkIn: Date
  checkOut: Date
  guests: {
    adults: number
    children: number
  }
  rooms?: number
  totalNights: number
  pricePerNight: number
  subtotal: number
  taxes: number
  total: number
  breakdown?: {
    basePrice: number
    weekendDays: number
    peakSeasonDays: number
    holidayDays: number
    guestAdjustment: number
    roomAdjustment: number
  }
}

export interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests?: string
  paymentMethod: "card" | "paypal"
  cardDetails?: {
    number: string
    expiry: string
    cvv: string
    name: string
  }
}

export interface Booking {
  id: string
  userId: string
  hotelId: string
  roomId: string
  bookingDetails: BookingDetails
  guestInfo: BookingFormData
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: string
  confirmationNumber: string
}

export interface Reservation {
  id: string
  confirmation_number: string
  user: {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
  }
  listing_title: string
  listing_location: string
  check_in: string
  check_out: string
  total_nights: number
  guest_name: string
  guests_adults: number
  guests_children: number
  rooms?: number
  total_amount: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_status: "pending" | "paid" | "refunded" | "failed"
  created_at: string
}
