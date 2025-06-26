// Test booking flow - you can add this to any page to test the dynamic booking
import { createBookingURL } from "@/lib/booking-utils"

// Example: Test the booking flow with dynamic dates
export const testBookingFlow = () => {
  // Test booking with custom dates
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 8)
  
  const bookingURL = createBookingURL({
    listingId: '123',
    checkIn: tomorrow,
    checkOut: nextWeek,
    adults: 2,
    children: 1,
    price: 150
  })
  
  console.log('Booking URL:', bookingURL)
  
  // This will create a URL like:
  // /booking?listingId=123&checkIn=2025-06-25&checkOut=2025-07-02&adults=2&children=1&price=150
  
  return bookingURL
}

// Example: Test with URL parameters from search
export const createBookingFromSearch = (searchParams: URLSearchParams) => {
  return createBookingURL({
    listingId: searchParams.get('hotelId') || '1',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    price: 199
  })
}

export default testBookingFlow
