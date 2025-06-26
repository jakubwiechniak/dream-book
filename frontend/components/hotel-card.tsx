import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getRandomUnsplashImage } from "@/lib/images" // <- DODAJ TEN IMPORT

const formatPrice = (price: number): string => {
  return (Math.round(price * 100) / 100).toFixed(2)
}

interface HotelCardProps {
  id?: string | number
  name: string
  location: string
  price: number
  rating: number
  image: string
  searchParams?: {
    checkIn?: string
    checkOut?: string
    adults?: number
    children?: number
  }
}

export function HotelCard({
  id,
  name,
  location,
  price,
  rating,
  image,
  searchParams,
}: HotelCardProps) {
  const buildHotelUrl = () => {
    const baseUrl = id ? `/hotel-details?hotelId=${id}` : "/hotel-details"

    if (!searchParams) return baseUrl

    const params = new URLSearchParams()
    if (id) params.set("hotelId", id.toString())
    if (searchParams.checkIn) params.set("checkIn", searchParams.checkIn)
    if (searchParams.checkOut) params.set("checkOut", searchParams.checkOut)
    if (searchParams.adults)
      params.set("adults", searchParams.adults.toString())
    if (searchParams.children)
      params.set("children", searchParams.children.toString())

    return `/hotel-details?${params.toString()}`
  }

  const isPlaceholder = image != null && image.includes("placeholder")
  const fallbackImage = getRandomUnsplashImage("hotel")
  console.log("Fallback image URL:", fallbackImage)
  let displayImage = isPlaceholder ? fallbackImage : image
  if (displayImage == null || displayImage === "") {
    displayImage = "https://images.unsplash.com/photo-1708151017150-45593f4d2b48?q=80&w=875&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }


  const hotelDetailsUrl = buildHotelUrl()

  return (
    <Card className="overflow-hidden w-full max-w-none">
      <CardContent className="p-0">
        <Link href={hotelDetailsUrl}>
          <Image
            src={displayImage}
            alt={name}
            width={600}
            height={400}
            className="object-cover w-full h-48 transition-transform hover:scale-105"
          />
        </Link>
        <div className="p-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-xl font-bold">${formatPrice(price)}</span>
              <span className="text-sm text-muted-foreground"> / night</span>
            </div>
            <Button size="sm" asChild>
              <Link href={hotelDetailsUrl}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
