"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star, Clock } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { useAuthenticatedRoute } from "@/hooks/use-protected-route"

const dealsData = [
  {
    id: 1,
    name: "Grand Plaza Hotel & Spa",
    location: "Miami Beach, FL",
    image:
      "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 2847,
    originalPrice: 299,
    discountedPrice: 199,
    discount: 33,
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
    timeLeft: "2 days left",
    featured: true,
  },
  {
    id: 2,
    name: "Mountain View Resort",
    location: "Aspen, CO",
    image:
      "https://images.unsplash.com/photo-1524429656589-6633a470097c?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 1523,
    originalPrice: 450,
    discountedPrice: 320,
    discount: 29,
    amenities: ["Ski Access", "Hot Tub", "Restaurant"],
    timeLeft: "5 hours left",
    featured: false,
  },
  {
    id: 3,
    name: "Oceanfront Paradise",
    location: "Malibu, CA",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 3241,
    originalPrice: 380,
    discountedPrice: 280,
    discount: 26,
    amenities: ["Beach Access", "Pool", "Spa"],
    timeLeft: "1 day left",
    featured: true,
  },
  {
    id: 4,
    name: "Downtown Luxury Suites",
    location: "New York, NY",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 1876,
    originalPrice: 520,
    discountedPrice: 399,
    discount: 23,
    amenities: ["City View", "Gym", "Business Center"],
    timeLeft: "3 days left",
    featured: false,
  },
  {
    id: 5,
    name: "Desert Oasis Resort",
    location: "Scottsdale, AZ",
    image:
      "https://images.unsplash.com/photo-1723134087756-3fdd46625a84?q=80&w=1878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 1234,
    originalPrice: 350,
    discountedPrice: 245,
    discount: 30,
    amenities: ["Golf Course", "Spa", "Pool"],
    timeLeft: "4 days left",
    featured: false,
  },
  {
    id: 6,
    name: "Historic Boutique Inn",
    location: "Charleston, SC",
    image:
      "https://images.unsplash.com/photo-1719917226661-6b01a79ac944?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 987,
    originalPrice: 280,
    discountedPrice: 210,
    discount: 25,
    amenities: ["Historic Charm", "Restaurant", "Garden"],
    timeLeft: "6 hours left",
    featured: true,
  },
]

export default function DealsPage() {
  const { isLoading, isAuthenticated } = useAuthenticatedRoute()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // User will be redirected by the hook
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-lg border">
          <Button
            variant="default"
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
          >
            All Deals
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Featured
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Ending Soon
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Highest Discount
          </Button>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealsData.map((deal) => (
            <Card
              key={deal.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow border ${
                deal.featured ? "ring-2 ring-black" : "border-gray-200"
              }`}
            >
              <div className="relative">
                <Image
                  src={deal.image || "/placeholder.svg"}
                  alt={deal.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black text-white hover:bg-gray-800">
                    {deal.discount}% OFF
                  </Badge>
                </div>
                {deal.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gray-800 text-white hover:bg-gray-700">
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {deal.timeLeft}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg mb-1 text-black">
                    {deal.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    {deal.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-black text-black" />
                      <span className="font-medium text-black">
                        {deal.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ({deal.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {deal.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-black">
                      ${deal.discountedPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${deal.originalPrice}
                    </span>
                  </div>
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Book Now
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">per night</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Load More Deals
          </Button>
        </div>
      </div>
    </div>
  )
}
