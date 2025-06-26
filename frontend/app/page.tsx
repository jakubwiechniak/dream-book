"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import Image from "next/image"
import { HotelCard } from "@/components/hotel-card"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { GuestSelector } from "@/components/guest-selector"
import { LocationSearch } from "@/components/location-search"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { fetchHotels } from "@/lib/api"
import type { DateRange } from "react-day-picker"
import type { Hotel } from "@/lib/types"

export default function Home() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    location: "",
    dates: undefined as DateRange | undefined,
    guests: { adults: 2, children: 0, rooms: 1 },
  })
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [specialOfferHotels, setSpecialOfferHotels] = useState<Hotel[]>([])

  // Fetch hotels on component mount
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const hotelsData = await fetchHotels()
        if (hotelsData.length > 0) {
          // Take only the first 6 hotels for the home page
          setHotels(hotelsData.slice(0, 6))
          // Take different hotels for special offers (next 3 hotels, or shuffle if not enough)
          if (hotelsData.length > 6) {
            setSpecialOfferHotels(hotelsData.slice(6, 9))
          } else {
            // If we don't have enough unique hotels, shuffle and take different ones
            const shuffled = [...hotelsData].sort(() => Math.random() - 0.5)
            setSpecialOfferHotels(
              shuffled.slice(0, Math.min(3, shuffled.length))
            )
          }
        }
      } catch (error) {
        console.error("Failed to fetch hotels:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHotels()
  }, [])

  const handleBookNow = () => {
    router.push("/hotels")
  }

  const handleLearnMore = () => {
    router.push("/about")
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (searchData.location) {
      params.set("location", searchData.location)
    }

    if (searchData.dates?.from) {
      params.set("checkIn", searchData.dates.from.toISOString().split("T")[0])
    }

    if (searchData.dates?.to) {
      params.set("checkOut", searchData.dates.to.toISOString().split("T")[0])
    }

    params.set("adults", searchData.guests.adults.toString())
    params.set("children", searchData.guests.children.toString())
    params.set("rooms", searchData.guests.rooms.toString())

    router.push(`/hotels?${params.toString()}`)
  }

  const handleLocationChange = (location: string) => {
    setSearchData((prev) => ({ ...prev, location }))
  }

  const handleDateChange = (dates: DateRange | undefined) => {
    setSearchData((prev) => ({ ...prev, dates }))
  }

  const handleGuestsChange = (guests: {
    adults: number
    children: number
    rooms: number
  }) => {
    setSearchData((prev) => ({ ...prev, guests }))
  }

  const handleSpecialOffer = (offerType: string) => {
    const params = new URLSearchParams()
    params.set("offer", offerType)
    router.push(`/hotels?${params.toString()}`)
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section
          className="relative py-12 md:py-24 lg:py-32 bg-muted"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1527437934671-61474b530017?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Find Your Perfect Stay
                  </h1>
                  <p className="max-w-[600px] text-gray-800 md:text-xl">
                    Discover amazing hotels at the best prices. Book your dream
                    vacation today.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex space-x-2">
                    <Button className="w-full" onClick={handleBookNow}>
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLearnMore}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <Tabs defaultValue="hotels" className="w-full">
                    <TabsList className="grid w-full rounded-none font-bold text-white bg-black">
                      Hotel
                    </TabsList>
                    <TabsContent value="hotels" className="p-6 space-y-4">
                      <div className="space-y-4">
                        <LocationSearch onChange={handleLocationChange} />
                        <DatePickerWithRange onChange={handleDateChange} />
                        <GuestSelector onChange={handleGuestsChange} />
                        <Button className="w-full" onClick={handleSearch}>
                          Search Hotels
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {loading
                    ? "Loading..."
                    : hotels.length > 0
                      ? "Featured Hotels"
                      : "Popular Destinations"}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {loading
                    ? "Finding the best hotels for you..."
                    : hotels.length > 0
                      ? "Discover amazing hotels from our collection and book your perfect stay."
                      : "Explore our most booked destinations and find your next adventure."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 xl:grid-cols-3 justify-items-stretch max-w-none mx-auto">
              <HotelCard
                id="grand-plaza-hotel"
                name="Grand Plaza Hotel"
                location="New York"
                price={199}
                rating={4.8}
                image="https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=800&q=80"
              />
              <HotelCard
                id="seaside-resort-spa"
                name="Seaside Resort & Spa"
                location="Miami"
                price={249}
                rating={4.9}
                image="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
              />
              <HotelCard
                id="mountain-view-lodge"
                name="Mountain View Lodge"
                location="Denver"
                price={179}
                rating={4.7}
                image="https://images.unsplash.com/photo-1524429656589-6633a470097c?auto=format&fit=crop&w=800&q=80"
              />
              <HotelCard
                id="city-center-suites"
                name="City Center Suites"
                location="Chicago"
                price={159}
                rating={4.6}
                image="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"
              />
              <HotelCard
                id="palm-paradise-resort"
                name="Palm Paradise Resort"
                location="Los Angeles"
                price={289}
                rating={4.9}
                image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              />
              <HotelCard
                id="harbor-view-hotel"
                name="Harbor View Hotel"
                location="San Francisco"
                price={229}
                rating={4.8}
                image="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80"
              />
            </div>
            {!loading && hotels.length > 0 && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/hotels")}
                  className="px-8"
                >
                  View All Hotels
                </Button>
              </div>
            )}
          </div>
        </section>
        <section className="py-12 bg-muted md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {loading
                    ? "Loading..."
                    : specialOfferHotels.length > 0
                      ? "More Great Hotels"
                      : "Special Offers"}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {loading
                    ? "Finding more hotels for you..."
                    : specialOfferHotels.length > 0
                      ? "Discover even more amazing hotels from our collection."
                      : "Take advantage of our limited-time deals and save on your next stay."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 xl:grid-cols-3 justify-items-stretch max-w-none mx-auto">
              {loading ? (
                // Loading skeletons for special offers
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden animate-pulse">
                    <div className="bg-gray-200 h-48 w-full"></div>
                    <div className="p-6 space-y-2">
                      <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                      <div className="bg-gray-200 h-10 w-full rounded mt-4"></div>
                    </div>
                  </Card>
                ))
              ) : specialOfferHotels.length > 0 ? (
                // Real hotel data without fake discounts
                specialOfferHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    name={hotel.title}
                    location={hotel.location}
                    price={parseFloat(hotel.price_per_night)}
                    rating={4.5} // Default rating since it's not in the Hotel interface
                    image={
                      hotel.image_url || "/placeholder.svg?height=400&width=600"
                    }
                  />
                ))
              ) : (
                // Fallback static offers if no hotel data
                <>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
                        alt="Weekend getaway - luxury hotel with pool and spa"
                        width={600}
                        height={400}
                        className="object-cover w-full h-48"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold">Weekend Getaway</h3>
                        <p className="text-muted-foreground">
                          Save 20% on weekend stays
                        </p>
                        <Button
                          className="mt-4 w-full"
                          onClick={() => handleSpecialOffer("weekend")}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80"
                        alt="Extended stay - business hotel suite with workspace"
                        width={600}
                        height={400}
                        className="object-cover w-full h-48"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold">Extended Stay</h3>
                        <p className="text-muted-foreground">
                          30% off for stays of 7+ nights
                        </p>
                        <Button
                          className="mt-4 w-full"
                          onClick={() => handleSpecialOffer("extended")}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=600&q=80"
                        alt="Family package - hotel breakfast buffet with fresh food"
                        width={600}
                        height={400}
                        className="object-cover w-full h-48"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold">Family Package</h3>
                        <p className="text-muted-foreground">
                          Kids stay free + free breakfast
                        </p>
                        <Button
                          className="mt-4 w-full"
                          onClick={() => handleSpecialOffer("family")}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            {!loading && specialOfferHotels.length > 0 && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/hotels")}
                  className="px-8"
                >
                  View More Hotels
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
