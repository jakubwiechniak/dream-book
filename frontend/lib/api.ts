// filepath: /Users/bartlomiejwozniczka/Desktop/dream-book-frontend/lib/api.ts
import type { Stay, UserData, Listing, Hotel, Host, Reservation } from "@/lib/types"
import type { User } from "@/lib/auth"
import { mockLandlordStays, mockGuestStays, mockUserProfile } from "./mock-data"
import { apiClient } from "./auth-interceptor"
import { authAPI, hotelsAPI } from "./api-client"

// External API base URL - używany w rzeczywistej implementacji
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

export async function fetchStays(mode: "landlord" | "guest"): Promise<Stay[]> {
  // Simulate API request
  try {
    // In a real application, this would be a fetch to your external API endpoint
    // const response = await fetch(`${API_BASE_URL}/stays?mode=${mode}`)
    // if (!response.ok) throw new Error('Failed to fetch stays')
    // const data = await response.json()
    // return data

    // For demo purposes, we'll simulate a network request with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate API being offline randomly (1 in 4 chance)
    if (Math.random() < 0.25) {
      throw new Error("API is offline")
    }

    // Return mock data based on mode
    return mode === "landlord" ? mockLandlordStays : mockGuestStays
  } catch {
    console.log("API is offline, using mock data")
    // Fallback to mock data when API is offline
    return mode === "landlord" ? mockLandlordStays : mockGuestStays
  }
}

export async function submitReview(
  stayId: string,
  reviewData: {
    overallRating: number
    cleanliness: number
    communication: number
    checkIn: number
    accuracy: number
    comment: string
  }
): Promise<void> {
  // Simulate API request
  try {
    // In a real application, this would be a POST request to your external API endpoint
    // const response = await fetch(`${API_BASE_URL}/reviews`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ stayId, ...reviewData })
    // })
    // if (!response.ok) throw new Error('Failed to submit review')
    // return await response.json()

    // For demo purposes, we'll simulate a network request with a delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate API failure (1 in 10 chance)
    if (Math.random() < 0.1) {
      throw new Error("Failed to submit review")
    }

    console.log("Review submitted:", { stayId, ...reviewData })

    // Update mock data
    const stayIndex = mockGuestStays.findIndex((stay) => stay.id === stayId)
    if (stayIndex !== -1) {
      mockGuestStays[stayIndex].rating = reviewData.overallRating
      mockGuestStays[stayIndex].hasReviewed = true
    }

    return
  } catch (error) {
    console.error("Error submitting review:", error)
    throw error
  }
}

export async function fetchUserProfile(): Promise<UserData> {
  try {
    // Użyj prawdziwego API zamiast zmockowanych danych
    const userData = await authAPI.getCurrentUser() as User
    
    // Mapowanie danych z API na typ UserData
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'guest',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      joinedAt: userData.joinedAt || new Date().toISOString(),
      avatarUrl: userData.avatarUrl || "/placeholder.svg?height=100&width=100",
      bookings: userData.bookings || 0,
      properties: userData.properties || 0,
    }
  } catch (error) {
    console.error("Błąd podczas pobierania profilu użytkownika:", error)
    
    // Fallback do zmockowanych danych tylko w przypadku błędu
    console.log("Używam zmockowanych danych jako fallback")
    return mockUserProfile
  }
}

export async function updateUserProfile(
  userId: string,
  userData: {
    name?: string
    email?: string
    phone?: string
    location?: string
    bio?: string
  }
): Promise<UserData> {
  try {
    // Użyj prawdziwego API zamiast zmockowanych danych
    const updatedUser = await authAPI.updateProfile(userData) as User
    
    // Mapowanie danych z API na typ UserData
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role || 'guest',
      isActive: updatedUser.isActive !== undefined ? updatedUser.isActive : true,
      joinedAt: updatedUser.joinedAt || new Date().toISOString(),
      avatarUrl: updatedUser.avatarUrl || "/placeholder.svg?height=100&width=100",
      bookings: updatedUser.bookings || 0,
      properties: updatedUser.properties || 0,
    }
  } catch (error) {
    console.error("Błąd podczas aktualizacji profilu:", error)
    throw new Error("Nie udało się zaktualizować profilu")
  }
}

export async function fetchListings(): Promise<Listing[]> {
  try {
    const response = await apiClient.get("/api/listings/", { timeout: 10000 })

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching listings:", error)
    // You could add more sophisticated fallback logic here if needed
    // For example, returning mock data when the API is unavailable
    return []
  }
}

export async function createListing(listingData: {
  title: string
  description: string
  price_per_night: string
  location: string
  property_type?: 'listing' | 'hotel'
  image_url?: string
  latitude?: string
  longitude?: string
}): Promise<Listing> {
  try {
    const response = await apiClient.post("/api/listings/", listingData)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Failed to create listing: ${response.status} - ${
          errorData.message || response.statusText
        }`
      )
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating listing:", error)
    throw error
  }
}

export async function fetchHotels(): Promise<Hotel[]> {
  try {
    const response = await apiClient.get("/api/hotels/", { timeout: 10000 })
    if (!response.ok) {
      throw new Error(`Failed to fetch hotels: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return []
  }
}

export async function fetchHotelById(hotelId: string): Promise<Hotel | null> {
  try {
    const response = await apiClient.get(`/api/hotels/${hotelId}/`, { timeout: 10000 })
    if (!response.ok) {
      throw new Error(`Failed to fetch hotel: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching hotel:", error)
    
    // Fallback do mock danych jeśli API nie działa
    const mockHotels = [
      {
        id: 1,
        title: "Grand Plaza Hotel",
        description: "Located in the heart of New York City, Grand Plaza Hotel offers luxury accommodations with world-class amenities.",
        price_per_night: "199.00",
        location: "New York, NY",
        property_type: "hotel" as const,
        latitude: "40.7589",
        longitude: "-73.9851",
        image_url: "/placeholder.svg?height=400&width=600",
        created_at: "2024-01-01T00:00:00Z",
        owner: 1,
        owner_username: "admin"
      },
      {
        id: 2,
        title: "Seaside Resort & Spa",
        description: "Experience luxury at our beachfront resort in Miami with stunning ocean views and world-class spa facilities.",
        price_per_night: "249.00",
        location: "Miami, FL",
        property_type: "hotel" as const,
        latitude: "25.7617",
        longitude: "-80.1918",
        image_url: "/placeholder.svg?height=400&width=600",
        created_at: "2024-01-01T00:00:00Z",
        owner: 1,
        owner_username: "admin"
      },
      {
        id: 3,
        title: "Mountain View Lodge",
        description: "Enjoy breathtaking mountain views and outdoor adventures at our cozy lodge in Denver.",
        price_per_night: "179.00",
        location: "Denver, CO",
        property_type: "hotel" as const,
        latitude: "39.7392",
        longitude: "-104.9903",
        image_url: "/placeholder.svg?height=400&width=600",
        created_at: "2024-01-01T00:00:00Z",
        owner: 1,
        owner_username: "admin"
      },
      {
        id: 4,
        title: "City Center Suites",
        description: "Modern suites in the heart of Chicago with easy access to shopping, dining, and entertainment.",
        price_per_night: "159.00",
        location: "Chicago, IL",
        property_type: "hotel" as const,
        latitude: "41.8781",
        longitude: "-87.6298",
        image_url: "/placeholder.svg?height=400&width=600",
        created_at: "2024-01-01T00:00:00Z",
        owner: 1,
        owner_username: "admin"
      },
      {
        id: 5,
        title: "Palm Paradise Resort",
        description: "Tropical paradise in Los Angeles with palm trees, pools, and luxurious amenities.",
        price_per_night: "289.00",
        location: "Los Angeles, CA",
        property_type: "hotel" as const,
        latitude: "34.0522",
        longitude: "-118.2437",
        image_url: "/placeholder.svg?height=400&width=600",
        created_at: "2024-01-01T00:00:00Z",
        owner: 1,
        owner_username: "admin"
      },
      {
        id: 6,
        title: "Harbor View Hotel",
        description: "Stunning harbor views and premium accommodations in the heart of San Francisco.",
        price_per_night: "229.00",
        location: "San Francisco, CA",
        property_type: "hotel" as const,
        latitude: "37.7749",
        longitude: "-122.4194",
        image_url: "/placeholder.svg?height=400&width=600",
        created_at: "2024-01-01T00:00:00Z",
        owner: 1,
        owner_username: "admin"
      }
    ];
    
    // Znajdź hotel po ID (obsługujemy zarówno string jak i number ID)
    const normalizeToSlug = (text: string) => 
      text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    
    const hotel = mockHotels.find(h => 
      h.id.toString() === hotelId || 
      normalizeToSlug(h.title) === hotelId
    );
    
    return hotel || null;
  }
}

export async function fetchUserReservations(): Promise<Reservation[]> {
  try {
    const response = await apiClient.get('/api/reservations/history/')
    if (!response.ok) {
      throw new Error('Failed to fetch reservations')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching user reservations:', error)
    // Return empty array if there's an error
    return []
  }
}
