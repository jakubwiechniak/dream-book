"use client"

import { useSearchParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StarIcon, MapPinIcon } from "lucide-react"
import Image from "next/image"

export default function HostDetails() {
  const searchParams = useSearchParams()

  const name = searchParams.get("name") || "Unknown Host"
  const location = searchParams.get("location") || "Unknown Location"
  const rating = searchParams.get("rating") || "N/A"
  const image = searchParams.get("image") || "/placeholder.svg"

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container px-4 py-6 mx-auto md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative col-span-1 overflow-hidden rounded-lg md:col-span-2 lg:col-span-2 aspect-video">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{name}</h1>
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{rating} ★</span>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <h2 className="text-xl font-semibold mb-4">
          More details about the host will go here.
        </h2>
      </main>
      <Footer />
    </div>
  )
}
