"use client"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { HotelCard } from "@/components/hotel-card"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { GuestSelector } from "@/components/guest-selector"
import { SortSelector } from "@/components/sort-selector"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Slider } from "@/components/ui/slider"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { fetchHotels } from "@/lib/api"
import type { Hotel } from "@/lib/types"

// Converting API hotels to the format expected by components
const mapApiHotelToComponentFormat = (apiHotel: Hotel) => ({
  id: apiHotel.id,
  name: apiHotel.title,
  location: apiHotel.location,
  price: parseFloat(apiHotel.price_per_night),
  rating: 4.5, // Default rating since API doesn't provide it
  latitude: parseFloat(apiHotel.latitude),
  longitude: parseFloat(apiHotel.longitude),
  image: apiHotel.image_url,
})
const HotelMap = dynamic(() => import("@/components/hotel-map"), { ssr: false })

// Type definition for the frontend hotel model
interface FrontendHotel {
  id: number
  name: string
  location: string
  price: number
  rating: number
  latitude: number
  longitude: number
  image: string
}

export default function Hotels() {
  const searchParams = useSearchParams()

  // Initialize search data from URL parameters
  const initializeFromURL = () => {
    const locationParam = searchParams.get("location") || ""
    const checkInParam = searchParams.get("checkIn")
    const checkOutParam = searchParams.get("checkOut")
    const adultsParam = searchParams.get("adults")
    const childrenParam = searchParams.get("children")
    const roomsParam = searchParams.get("rooms")

    // Parse dates
    const checkIn = checkInParam ? new Date(checkInParam) : new Date()
    const checkOut = checkOutParam
      ? new Date(checkOutParam)
      : new Date(new Date().setDate(new Date().getDate() + 7))

    // Parse guest numbers
    const adults = adultsParam ? parseInt(adultsParam) : 2
    const children = childrenParam ? parseInt(childrenParam) : 0
    const rooms = roomsParam ? parseInt(roomsParam) : 1

    return {
      location: locationParam,
      dateRange: { from: checkIn, to: checkOut },
      guests: { adults, children, rooms },
    }
  }

  const initialData = initializeFromURL()

  const [location, setLocation] = useState(initialData.location)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialData.dateRange
  )
  const [guests, setGuests] = useState(initialData.guests)
  const [sortOption, setSortOption] = useState("rating_desc")
  const [hotels, setHotels] = useState<FrontendHotel[]>([])
  const [apiHotels, setApiHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State to store unique locations from API data
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")

  // Fetch hotels from API on component mount
  useEffect(() => {
    const getHotels = async () => {
      try {
        setLoading(true)
        const data = await fetchHotels()
        setApiHotels(data)

        // Convert API hotels to frontend format
        const formattedHotels = data.map((hotel) =>
          mapApiHotelToComponentFormat(hotel)
        )
        setHotels(formattedHotels)

        // Extract unique locations with validation
        const locations = data
          .map((hotel) => hotel.location)
          .filter(
            (location) => typeof location === "string" && location.trim() !== ""
          ) // Remove null/undefined/empty values
          .reduce<string[]>((unique, location) => {
            const trimmed = location.trim()
            if (trimmed && !unique.includes(trimmed)) {
              unique.push(trimmed)
            }
            return unique
          }, [])
          .sort((a, b) => a.localeCompare(b)) // Sort locations alphabetically with proper locale handling

        setUniqueLocations(locations)
      } catch (err) {
        setError("Failed to fetch hotels. Please try again later.")
        console.error("Error fetching hotels:", err)
      } finally {
        setLoading(false)
      }
    }

    getHotels()
  }, [])
  const [isExpanded, setIsExpanded] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [amenities, setAmenities] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pool: false,
    gym: false,
    airConditioning: false,
    spa: false,
    petFriendly: false,
    restaurant: false,
    roomService: false,
  })
  const [stars, setStars] = useState(0)
  const [propertyType, setPropertyType] = useState("all")
  const [distanceFromCenter, setDistanceFromCenter] = useState(10)
  const [accessibility, setAccessibility] = useState({
    wheelchair: false,
    elevator: false,
    accessibleBathroom: false,
  })

  const prepareQueryParams = () => {
    return {
      location,
      checkIn: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
      checkOut: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
      guests: {
        adults: guests.adults,
        children: guests.children,
        rooms: guests.rooms,
      },
      priceRange: {
        min: priceRange.min,
        max: priceRange.max,
      },
      amenities: Object.entries(amenities)
        .filter(([, isSelected]) => isSelected)
        .map(([name]) => name),
      stars: stars,
      propertyType: propertyType,
      distanceFromCenter: distanceFromCenter,
      accessibility: Object.entries(accessibility)
        .filter(([, isSelected]) => isSelected)
        .map(([name]) => name),
      sort: sortOption,
    }
  }

  const searchHotels = () => {
    setLoading(true)

    const queryParams = prepareQueryParams()
    console.log("Parametry zapytania do backendu:", queryParams)

    // In a real application, we would fetch filtered data from the API
    // For now, we'll filter the existing API data client-side
    setTimeout(() => {
      if (apiHotels.length === 0) {
        setLoading(false)
        return
      }

      let sortedHotels = apiHotels.map((hotel) =>
        mapApiHotelToComponentFormat(hotel)
      )

      sortedHotels = sortedHotels.filter(
        (hotel) =>
          hotel.price >= priceRange.min && hotel.price <= priceRange.max
      )

      // Filter by selected location (exact match from dropdown)
      if (selectedLocation) {
        sortedHotels = sortedHotels.filter(
          (hotel) => hotel.location === selectedLocation
        )
      }
      // If using manual input location search
      else if (location) {
        sortedHotels = sortedHotels.filter((hotel) =>
          hotel.location.toLowerCase().includes(location.toLowerCase())
        )
      }

      if (stars > 0) {
        sortedHotels = sortedHotels.filter(
          (hotel) => Math.floor(hotel.rating) >= stars
        )
      }

      if (propertyType !== "all") {
        console.log("Filtrowanie po typie obiektu:", propertyType)
      }

      if (distanceFromCenter < 20) {
        console.log("Filtrowanie po odległości od centrum:", distanceFromCenter)
      }

      const selectedAccessibility = Object.entries(accessibility)
        .filter(([, isSelected]) => isSelected)
        .map(([name]) => name)

      if (selectedAccessibility.length > 0) {
        console.log(
          "Filtrowanie po opcjach dostępności:",
          selectedAccessibility
        )
      }

      switch (sortOption) {
        case "price_asc":
          sortedHotels.sort((a, b) => a.price - b.price)
          break
        case "price_desc":
          sortedHotels.sort((a, b) => b.price - a.price)
          break
        case "rating_desc":
          sortedHotels.sort((a, b) => b.rating - a.rating)
          break
        case "rating_asc":
          sortedHotels.sort((a, b) => a.rating - b.rating)
          break
        case "name_asc":
          sortedHotels.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name_desc":
          sortedHotels.sort((a, b) => b.name.localeCompare(a.name))
          break
        default:
          break
      }

      setHotels(sortedHotels)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container px-4 py-6 mx-auto md:px-6 md:py-12">
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Hotels
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find the perfect hotel for your stay
          </p>
        </div>
        <div className="p-6 mb-8 bg-white border rounded-xl shadow-lg transition-shadow hover:shadow-xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-gray-700">Lokalizacja</p>
                {selectedLocation && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                    1
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    const value = e.target.value
                    setSelectedLocation(value)
                    setLocation(value)

                    // Filter hotels immediately when location changes
                    setLoading(true)
                    setTimeout(() => {
                      if (apiHotels.length === 0) {
                        setLoading(false)
                        return
                      }

                      let filteredHotels = apiHotels.map((hotel) =>
                        mapApiHotelToComponentFormat(hotel)
                      )

                      // Apply current filters
                      filteredHotels = filteredHotels.filter(
                        (hotel) =>
                          hotel.price >= priceRange.min &&
                          hotel.price <= priceRange.max
                      )

                      // Filter by selected location
                      if (value) {
                        filteredHotels = filteredHotels.filter(
                          (hotel) => hotel.location === value
                        )
                      }

                      // Apply other filters
                      if (stars > 0) {
                        filteredHotels = filteredHotels.filter(
                          (hotel) => Math.floor(hotel.rating) >= stars
                        )
                      }

                      // Apply sorting
                      switch (sortOption) {
                        case "price_asc":
                          filteredHotels.sort((a, b) => a.price - b.price)
                          break
                        case "price_desc":
                          filteredHotels.sort((a, b) => b.price - a.price)
                          break
                        case "rating_desc":
                          filteredHotels.sort((a, b) => b.rating - a.rating)
                          break
                        default:
                          break
                      }

                      setHotels(filteredHotels)
                      setLoading(false)
                    }, 300)
                  }}
                  className="w-full pl-10 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none cursor-pointer"
                >
                  <option value="">Wszystkie lokalizacje</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Termin pobytu</p>
              <DatePickerWithRange
                className="w-full"
                value={dateRange}
                onChange={(newDateRange) =>
                  newDateRange && setDateRange(newDateRange)
                }
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Goście i pokoje
              </p>
              <GuestSelector value={guests} onChange={setGuests} />
            </div>
            <div className="flex items-end">
              <Button
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-black hover:to-gray-800 text-white font-medium py-2.5"
                onClick={searchHotels}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Wyszukiwanie...
                  </div>
                ) : (
                  <>Szukaj hoteli</>
                )}
              </Button>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-sm text-gray-700 hover:text-black transition-colors font-medium rounded-full px-4 py-1.5 border border-gray-300 hover:border-gray-500 bg-gray-50 hover:bg-gray-100"
              >
                {isExpanded ? (
                  <>
                    Mniej filtrów <span className="ml-1.5">▲</span>
                  </>
                ) : (
                  <>
                    Więcej filtrów <span className="ml-1.5">▼</span>
                  </>
                )}
              </button>
            </div>
            {isExpanded && (
              <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-xl border border-gray-100 mt-4 shadow-md transform transition-all">
                <div className="flex flex-col">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Przedział cenowy (cena za jedną dobę)
                  </p>
                  <div className="pt-6 px-2">
                    <Slider
                      value={[priceRange.min, priceRange.max]}
                      min={0}
                      max={500}
                      step={10}
                      onValueChange={(value) => {
                        setPriceRange({ min: value[0], max: value[1] })
                      }}
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm font-medium text-gray-700">
                        ${priceRange.min}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        ${priceRange.max}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Udogodnienia
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center space-x-2 group cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          amenities.wifi
                            ? "bg-gray-700 border-gray-700"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {amenities.wifi && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={amenities.wifi}
                        onChange={() =>
                          setAmenities((prev) => ({
                            ...prev,
                            wifi: !prev.wifi,
                          }))
                        }
                        className="opacity-0 absolute"
                      />
                      <span className="text-sm text-gray-800">Wi-Fi</span>
                    </label>
                    <label className="flex items-center space-x-2 group cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          amenities.parking
                            ? "bg-gray-700 border-gray-700"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {amenities.parking && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={amenities.parking}
                        onChange={() =>
                          setAmenities((prev) => ({
                            ...prev,
                            parking: !prev.parking,
                          }))
                        }
                        className="opacity-0 absolute"
                      />
                      <span className="text-sm text-gray-800">Parking</span>
                    </label>
                    <label className="flex items-center space-x-2 group cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          amenities.breakfast
                            ? "bg-gray-700 border-gray-700"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {amenities.breakfast && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={amenities.breakfast}
                        onChange={() =>
                          setAmenities((prev) => ({
                            ...prev,
                            breakfast: !prev.breakfast,
                          }))
                        }
                        className="opacity-0 absolute"
                      />
                      <span className="text-sm text-gray-800">Śniadanie</span>
                    </label>
                    <label className="flex items-center space-x-2 group cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          amenities.pool
                            ? "bg-gray-700 border-gray-700"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {amenities.pool && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={amenities.pool}
                        onChange={() =>
                          setAmenities((prev) => ({
                            ...prev,
                            pool: !prev.pool,
                          }))
                        }
                        className="opacity-0 absolute"
                      />
                      <span className="text-sm text-gray-800">Basen</span>
                    </label>
                    <label className="flex items-center space-x-2 group cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          amenities.airConditioning
                            ? "bg-gray-700 border-gray-700"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {amenities.airConditioning && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={amenities.airConditioning}
                        onChange={() =>
                          setAmenities((prev) => ({
                            ...prev,
                            airConditioning: !prev.airConditioning,
                          }))
                        }
                        className="opacity-0 absolute"
                      />
                      <span className="text-sm text-gray-800">
                        Klimatyzacja
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 group cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          amenities.spa
                            ? "bg-gray-700 border-gray-700"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {amenities.spa && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={amenities.spa}
                        onChange={() =>
                          setAmenities((prev) => ({
                            ...prev,
                            spa: !prev.spa,
                          }))
                        }
                        className="opacity-0 absolute"
                      />
                      <span className="text-sm text-gray-800">SPA</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Ocena w gwiazdkach
                  </p>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setStars(stars === star ? 0 : star)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md transition-all mr-1 ${
                            stars >= star
                              ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md transform hover:-translate-y-0.5"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2">
                      {stars > 0 ? (
                        <div className="text-sm text-gray-600">
                          Wybrano: {stars}{" "}
                          {stars === 1
                            ? "gwiazdka"
                            : stars < 5
                            ? "gwiazdki"
                            : "gwiazdek"}{" "}
                          lub więcej
                          <button
                            onClick={() => setStars(0)}
                            className="ml-2 text-xs text-gray-700 hover:text-black underline"
                          >
                            Wyczyść
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Kliknij aby wybrać minimalną ocenę
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Typ obiektu
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      <option value="all">Wszystkie typy</option>
                      <option value="hotel">Hotel</option>
                      <option value="apartment">Apartament</option>
                      <option value="hostel">Hostel</option>
                      <option value="guesthouse">Pensjonat</option>
                      <option value="villa">Willa</option>
                      <option value="resort">Kurort</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Odległość od centrum
                  </p>
                  <div className="pt-2 px-2">
                    <Slider
                      value={[distanceFromCenter]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={(value) => {
                        setDistanceFromCenter(value[0])
                      }}
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm font-medium text-gray-700">
                        {distanceFromCenter} km od centrum
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Dostępność dla niepełnosprawnych
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="flex items-center space-x-2 group cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          accessibility.wheelchair
                            ? "bg-gray-700 border-gray-700"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {accessibility.wheelchair && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={accessibility.wheelchair}
                        onChange={() =>
                          setAccessibility((prev) => ({
                            ...prev,
                            wheelchair: !prev.wheelchair,
                          }))
                        }
                        className="opacity-0 absolute"
                      />
                      <span className="text-sm text-gray-800">
                        Dostosowany dla wózków
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 group cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          accessibility.elevator
                            ? "bg-gray-700 border-gray-700"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {accessibility.elevator && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={accessibility.elevator}
                        onChange={() =>
                          setAccessibility((prev) => ({
                            ...prev,
                            elevator: !prev.elevator,
                          }))
                        }
                        className="opacity-0 absolute"
                      />
                      <span className="text-sm text-gray-800">Winda</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-medium">
              {hotels.length}{" "}
              {selectedLocation
                ? `hotel(e) w lokalizacji "${selectedLocation}"`
                : "hotel(e)"}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "d MMMM yyyy")}
              {selectedLocation && (
                <button
                  onClick={() => {
                    setSelectedLocation("")
                    setLocation("")
                    // Re-run search with no location filter
                    searchHotels()
                  }}
                  className="ml-2 text-blue-600 hover:underline text-xs"
                >
                  Pokaż wszystkie lokalizacje
                </button>
              )}
            </p>
          </div>
          <SortSelector value={sortOption} onChange={setSortOption} />
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-8 w-8 text-gray-700 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-lg font-medium">Loading hotels...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-lg font-medium text-red-600">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try again later or contact support.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gray-700 hover:bg-gray-800"
            >
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                id={hotel.id}
                name={hotel.name}
                location={hotel.location}
                price={hotel.price}
                rating={hotel.rating}
                image={hotel.image}
                searchParams={{
                  checkIn: dateRange?.from
                    ? format(dateRange.from, "yyyy-MM-dd")
                    : undefined,
                  checkOut: dateRange?.to
                    ? format(dateRange.to, "yyyy-MM-dd")
                    : undefined,
                  adults: guests.adults,
                  children: guests.children,
                }}
              />
            ))}
          </div>
        )}
        {hotels.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-lg font-medium">
              No hotels found for your search
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try changing your search criteria or check back later.
            </p>
          </div>
        )}{" "}
        {hotels.length > 0 && !loading && !error && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Mapa hoteli</h2>
            <HotelMap
              hotels={hotels.map((hotel) => ({
                id: hotel.id,
                name: hotel.name,
                location: hotel.location,
                latitude: hotel.latitude,
                longitude: hotel.longitude,
              }))}
              className="h-64 w-full rounded-lg shadow-md"
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
