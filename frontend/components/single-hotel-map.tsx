"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Hotel } from "@/lib/types"
import { useEffect, useState } from "react"

// Fix for default marker icons in Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface SingleHotelMapProps {
  hotel: Hotel
  className?: string
  height?: string
}

export default function SingleHotelMap({
  hotel,
  className = "",
  height = "160px",
}: SingleHotelMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <span className="text-gray-500">Loading map...</span>
      </div>
    )
  }

  // Parse coordinates
  const lat =
    typeof hotel.latitude === "string"
      ? parseFloat(hotel.latitude)
      : hotel.latitude
  const lng =
    typeof hotel.longitude === "string"
      ? parseFloat(hotel.longitude)
      : hotel.longitude

  // Check if coordinates are valid
  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <span className="text-gray-500">Map not available</span>
      </div>
    )
  }

  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        className="w-full h-full rounded-lg"
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div className="text-center">
              <strong className="block">{hotel.title}</strong>
              <span className="text-sm text-gray-600">{hotel.location}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
