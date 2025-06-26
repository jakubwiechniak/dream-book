// Reservations API adapter for Django backend compatibility
import {
  validateBookingStep1,
  validateBookingStep2,
  ValidationError,
} from "./validation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface ReservationCreateData {
  listing_id: string
  check_in: string
  check_out: string
  guests_adults: number
  guests_children: number
  rooms?: number
  guest_first_name: string
  guest_last_name: string
  guest_email: string
  guest_phone: string
  special_requests?: string
  payment_method: "card" | "paypal"
  calculated_total?: number
  price_breakdown?: {
    base_price: number
    guest_adjustment: number
    room_adjustment: number
    total_nights: number
    price_per_night: number
  }
}

interface ReservationResponse {
  id: string
  confirmation_number: string
  status: string
  total_amount: string
  check_in: string
  check_out: string
  guest_name: string
  listing: {
    id: number
    title: string
    location: string
    price_per_night: string
  }
}

interface AvailabilityCheckData {
  listing_id: string
  check_in: string
  check_out: string
}

interface AvailabilityResponse {
  available: boolean
  listing_id: string
  check_in: string
  check_out: string
  conflicts: number
}

class ReservationsAPI {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  // Convert frontend booking data to backend format
  private transformBookingData(frontendData: {
    hotelId?: string
    listing_id?: string
    checkIn: Date | string
    checkOut: Date | string
    guests: { adults: number; children: number }
    rooms?: number
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests?: string
    paymentMethod: "card" | "paypal"
    calculatedTotal?: number
    priceBreakdown?: {
      basePrice: number
      guestAdjustment: number
      roomAdjustment?: number
      totalNights: number
      pricePerNight: number
    }
  }): ReservationCreateData {
    const checkIn =
      typeof frontendData.checkIn === "string"
        ? frontendData.checkIn
        : frontendData.checkIn.toISOString().split("T")[0]

    const checkOut =
      typeof frontendData.checkOut === "string"
        ? frontendData.checkOut
        : frontendData.checkOut.toISOString().split("T")[0]

    return {
      listing_id: frontendData.listing_id || frontendData.hotelId || "",
      check_in: checkIn,
      check_out: checkOut,
      guests_adults: frontendData.guests.adults,
      guests_children: frontendData.guests.children,
      rooms: frontendData.rooms,
      guest_first_name: frontendData.firstName,
      guest_last_name: frontendData.lastName,
      guest_email: frontendData.email,
      guest_phone: frontendData.phone,
      special_requests: frontendData.specialRequests || "",
      payment_method: frontendData.paymentMethod,
      calculated_total: frontendData.calculatedTotal,
      price_breakdown: frontendData.priceBreakdown
        ? {
            base_price: frontendData.priceBreakdown.basePrice,
            guest_adjustment: frontendData.priceBreakdown.guestAdjustment,
            room_adjustment: frontendData.priceBreakdown.roomAdjustment || 0,
            total_nights: frontendData.priceBreakdown.totalNights,
            price_per_night: frontendData.priceBreakdown.pricePerNight,
          }
        : undefined,
    }
  }

  // Create a new reservation
  async createReservation(bookingData: {
    listing_id?: string
    hotelId?: string
    checkIn: Date | string
    checkOut: Date | string
    guests: { adults: number; children: number }
    rooms?: number
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests?: string
    paymentMethod: "card" | "paypal"
    calculatedTotal?: number
    priceBreakdown?: {
      basePrice: number
      guestAdjustment: number
      roomAdjustment?: number
      totalNights: number
      pricePerNight: number
    }
  }): Promise<ReservationResponse> {
    const transformedData = this.transformBookingData(bookingData)

    const response = await fetch(`${this.baseURL}/api/reservations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(transformedData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to create reservation")
    }

    return response.json()
  }

  // Check availability
  async checkAvailability(data: {
    listing_id: string
    check_in: string | Date
    check_out: string | Date
  }): Promise<AvailabilityResponse> {
    const checkData: AvailabilityCheckData = {
      listing_id: data.listing_id,
      check_in:
        typeof data.check_in === "string"
          ? data.check_in
          : data.check_in.toISOString().split("T")[0],
      check_out:
        typeof data.check_out === "string"
          ? data.check_out
          : data.check_out.toISOString().split("T")[0],
    }

    const response = await fetch(
      `${this.baseURL}/api/reservations/availability-check/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkData),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to check availability")
    }

    return response.json()
  }

  // Get user's reservations
  async getUserReservations(): Promise<ReservationResponse[]> {
    const response = await fetch(`${this.baseURL}/api/reservations/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch reservations")
    }

    return response.json()
  }

  // Get reservation by confirmation number
  async getReservationByConfirmation(
    confirmationNumber: string
  ): Promise<ReservationResponse> {
    const response = await fetch(
      `${this.baseURL}/api/reservations/confirmation/${confirmationNumber}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch reservation")
    }

    return response.json()
  }

  // Cancel reservation
  async cancelReservation(
    reservationId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${this.baseURL}/api/reservations/${reservationId}/cancel/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to cancel reservation")
    }

    return response.json()
  }

  // 3-Step booking process with enhanced validation
  async bookingStep1(data: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }): Promise<{
    valid: boolean
    errors?: ValidationError[]
    message?: string
  }> {
    // Client-side validation first
    const validation = validateBookingStep1(data)

    if (!validation.isValid) {
      return {
        valid: false,
        errors: validation.errors,
        message: "Please correct the validation errors",
      }
    }

    try {
      const response = await fetch(
        `${this.baseURL}/api/reservations/booking-step-1/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Step 1 validation failed")
      }

      return response.json()
    } catch (error) {
      return {
        valid: false,
        message: error instanceof Error ? error.message : "Validation failed",
      }
    }
  }

  async bookingStep2(data: {
    paymentMethod: "card" | "paypal"
    cardDetails?: {
      number: string
      expiry: string
      cvv: string
      name: string
    }
  }): Promise<{
    valid: boolean
    errors?: ValidationError[]
    message?: string
  }> {
    // Client-side validation first
    const validation = validateBookingStep2(data)

    if (!validation.isValid) {
      return {
        valid: false,
        errors: validation.errors,
        message: "Please correct the payment details",
      }
    }

    try {
      // For security, don't send actual card details to backend in step 2
      // Only validate the format and send anonymized data
      const sanitizedData = {
        paymentMethod: data.paymentMethod,
        cardType: data.cardDetails
          ? this.getCardType(data.cardDetails.number)
          : null,
        hasValidCard: data.paymentMethod === "card" ? validation.isValid : true,
      }

      const response = await fetch(
        `${this.baseURL}/api/reservations/booking-step-2/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(sanitizedData),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Step 2 validation failed")
      }

      return response.json()
    } catch (error) {
      return {
        valid: false,
        message:
          error instanceof Error ? error.message : "Payment validation failed",
      }
    }
  }

  // Get card type from card number
  private getCardType(cardNumber: string): string | null {
    const cleanCard = cardNumber.replace(/\D/g, "")
    const cardPatterns = {
      visa: /^4/,
      mastercard: /^5[1-5]|^2[2-7]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
      dinersclub: /^3[0689]/,
      jcb: /^35/,
    }

    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(cleanCard)) {
        return type
      }
    }

    return null
  }

  async bookingStep3(data: {
    listing_id?: string
    hotelId?: string
    checkIn: Date | string
    checkOut: Date | string
    guests: { adults: number; children: number }
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests?: string
    paymentMethod: "card" | "paypal"
  }): Promise<{ success: boolean; reservation: ReservationResponse }> {
    const transformedData = this.transformBookingData(data)

    const response = await fetch(
      `${this.baseURL}/api/reservations/booking-step-3/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(transformedData),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to complete booking")
    }

    return response.json()
  }
}

// Export singleton instance
export const reservationsAPI = new ReservationsAPI(API_BASE_URL)

// Export for compatibility with existing bookingsAPI
export const bookingsAPI = {
  getAll: () => reservationsAPI.getUserReservations(),
  getById: (id: string) => reservationsAPI.getReservationByConfirmation(id),
  create: (data: Parameters<typeof reservationsAPI.createReservation>[0]) =>
    reservationsAPI.createReservation(data),
  cancel: (id: string) => reservationsAPI.cancelReservation(id),
  checkAvailability: (
    data: Parameters<typeof reservationsAPI.checkAvailability>[0]
  ) => reservationsAPI.checkAvailability(data),
}

export default reservationsAPI
