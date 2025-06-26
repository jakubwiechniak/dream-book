// Utility functions for booking navigation

// Dynamic pricing configuration
const PRICING_CONFIG = {
  BASE_PRICE: 199, // Bazowa cena za noc w PLN (dla 2 dorosłych w 1 pokoju)
  WEEKEND_MULTIPLIER: 1.3, // 30% więcej w weekendy (Pt-Nd)
  PEAK_SEASON_MULTIPLIER: 1.5, // 50% więcej w sezonie (Jun-Aug)
  HOLIDAY_MULTIPLIER: 1.8, // 80% więcej w święta
  CHILD_FEE_PER_NIGHT: 30, // Opłata za dziecko za noc (PLN)
  ADDITIONAL_ADULT_FEE_PER_NIGHT: 80, // Dodatkowa opłata za dorosłego powyżej 2 osób za noc
  ADDITIONAL_ROOM_MULTIPLIER: 0.9, // Każdy dodatkowy pokój kosztuje 90% ceny bazowej
  SINGLE_GUEST_DISCOUNT: 0.2, // 20% zniżka dla 1 dorosłego (zamiast 2)
  TAX_RATE: 0.15, // 15% podatek
}

// Święta (MM-DD format)
const HOLIDAYS = [
  "01-01", // Nowy Rok
  "01-06", // Trzech Króli
  "05-01", // Święto Pracy
  "05-03", // Święto Konstytucji
  "08-15", // Wniebowzięcie NMP
  "11-01", // Wszystkich Świętych
  "11-11", // Niepodległości
  "12-25", // Boże Narodzenie
  "12-26", // Drugi dzień Świąt
]

/**
 * Oblicza dynamiczną cenę na podstawie dat, liczby gości i pokoi
 */
export const calculateDynamicPrice = (params: {
  checkIn: Date | string
  checkOut: Date | string
  adults: number
  children: number
  rooms?: number
  basePrice?: number
}): {
  pricePerNight: number
  totalNights: number
  subtotal: number
  taxes: number
  total: number
  breakdown: {
    basePrice: number
    weekendDays: number
    peakSeasonDays: number
    holidayDays: number
    guestAdjustment: number
    roomAdjustment: number
  }
} => {
  const checkIn =
    typeof params.checkIn === "string"
      ? new Date(params.checkIn)
      : params.checkIn
  const checkOut =
    typeof params.checkOut === "string"
      ? new Date(params.checkOut)
      : params.checkOut

  const totalNights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  )
  const basePrice = params.basePrice || PRICING_CONFIG.BASE_PRICE
  const rooms = params.rooms || 1 // Domyślnie 1 pokój

  let weekendDays = 0
  let peakSeasonDays = 0
  let holidayDays = 0
  let totalPrice = 0

  // Iteruj przez każdy dzień pobytu
  for (let i = 0; i < totalNights; i++) {
    const currentDate = new Date(checkIn)
    currentDate.setDate(currentDate.getDate() + i)

    let dayPrice = basePrice

    // Sprawdź czy to weekend (Piątek = 5, Sobota = 6, Niedziela = 0)
    const dayOfWeek = currentDate.getDay()
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0
    if (isWeekend) {
      weekendDays++
      dayPrice *= PRICING_CONFIG.WEEKEND_MULTIPLIER
    }

    // Sprawdź czy to sezon (czerwiec-sierpień)
    const month = currentDate.getMonth() + 1 // getMonth() zwraca 0-11
    const isPeakSeason = month >= 6 && month <= 8
    if (isPeakSeason) {
      peakSeasonDays++
      dayPrice *= PRICING_CONFIG.PEAK_SEASON_MULTIPLIER
    }

    // Sprawdź czy to święto
    const monthDay =
      String(month).padStart(2, "0") +
      "-" +
      String(currentDate.getDate()).padStart(2, "0")
    const isHoliday = HOLIDAYS.includes(monthDay)
    if (isHoliday) {
      holidayDays++
      dayPrice *= PRICING_CONFIG.HOLIDAY_MULTIPLIER
    }

    totalPrice += dayPrice
  }

  // Oblicz średnią cenę za noc
  const averagePricePerNight = totalPrice / totalNights

  // Dostosowanie do liczby gości
  let guestAdjustment = 0

  // Zniżka za mniej niż 2 dorosłych (cena bazowa jest dla 2 dorosłych)
  if (params.adults === 1) {
    const singleGuestDiscount =
      totalPrice * PRICING_CONFIG.SINGLE_GUEST_DISCOUNT
    guestAdjustment -= singleGuestDiscount
  }

  // Opłata za dzieci (dodatnia opłata)
  if (params.children > 0) {
    const childFee =
      params.children * PRICING_CONFIG.CHILD_FEE_PER_NIGHT * totalNights
    guestAdjustment += childFee
  }

  // Dodatkowa opłata za więcej niż 2 dorosłych
  if (params.adults > 2) {
    const extraAdultFee =
      (params.adults - 2) *
      PRICING_CONFIG.ADDITIONAL_ADULT_FEE_PER_NIGHT *
      totalNights
    guestAdjustment += extraAdultFee
  }

  // Dostosowanie do liczby pokoi
  let roomAdjustment = 0
  if (rooms > 1) {
    // Każdy dodatkowy pokój kosztuje 90% ceny bazowej za noc
    const additionalRoomCost = 
      (rooms - 1) * 
      basePrice * 
      PRICING_CONFIG.ADDITIONAL_ROOM_MULTIPLIER * 
      totalNights
    roomAdjustment += additionalRoomCost
  }

  const subtotal = Math.max(0, totalPrice + guestAdjustment + roomAdjustment) // Zapewniamy że cena nie jest ujemna
  const taxes = Math.round(subtotal * PRICING_CONFIG.TAX_RATE * 100) / 100 // Zaokrąglamy podatki do 2 miejsc po przecinku
  const total = Math.round((subtotal + taxes) * 100) / 100 // Zaokrąglamy total do 2 miejsc po przecinku

  return {
    pricePerNight: Math.max(1, Math.round(averagePricePerNight * 100) / 100), // Minimum 1 PLN za noc, zaokrąglone do 2 miejsc
    totalNights: Math.max(1, totalNights), // Minimum 1 noc
    subtotal: Math.round(subtotal * 100) / 100, // Zaokrąglone do 2 miejsc po przecinku
    taxes: Math.round(taxes * 100) / 100, // Zaokrąglone do 2 miejsc po przecinku
    total: Math.round(total * 100) / 100, // Zaokrąglone do 2 miejsc po przecinku
    breakdown: {
      basePrice: Math.round(basePrice * 100) / 100,
      weekendDays,
      peakSeasonDays,
      holidayDays,
      guestAdjustment: Math.round(guestAdjustment * 100) / 100, // Zaokrąglone do 2 miejsc po przecinku
      roomAdjustment: Math.round(roomAdjustment * 100) / 100, // Zaokrąglone do 2 miejsc po przecinku
    },
  }
}

// Funkcja do tworzenia URL rezerwacji
export const createBookingURL = (params: {
  hotelId?: string
  hotelName?: string
  hotelLocation?: string
  hotelImage?: string
  listingId?: string
  checkIn?: Date | string
  checkOut?: Date | string
  adults?: number
  children?: number
  rooms?: number
  price?: number
}) => {
  const searchParams = new URLSearchParams()

  if (params.hotelId) searchParams.set("hotelId", params.hotelId)
  if (params.hotelName) searchParams.set("hotelName", params.hotelName)
  if (params.hotelLocation)
    searchParams.set("hotelLocation", params.hotelLocation)
  if (params.hotelImage) searchParams.set("hotelImage", params.hotelImage)
  if (params.listingId) searchParams.set("listingId", params.listingId)

  if (params.checkIn) {
    const checkInDate =
      typeof params.checkIn === "string"
        ? params.checkIn
        : params.checkIn.toISOString().split("T")[0]
    searchParams.set("checkIn", checkInDate)
  }

  if (params.checkOut) {
    const checkOutDate =
      typeof params.checkOut === "string"
        ? params.checkOut
        : params.checkOut.toISOString().split("T")[0]
    searchParams.set("checkOut", checkOutDate)
  }

  if (params.adults) searchParams.set("adults", params.adults.toString())
  if (params.children) searchParams.set("children", params.children.toString())
  if (params.rooms) searchParams.set("rooms", params.rooms.toString())
  if (params.price) searchParams.set("price", params.price.toString())

  return `/booking?${searchParams.toString()}`
}

// Example usage:
// const bookingURL = createBookingURL({
//   listingId: '123',
//   checkIn: '2025-07-01',
//   checkOut: '2025-07-05',
//   adults: 2,
//   children: 1,
//   price: 150
// })
// router.push(bookingURL)

export default createBookingURL
