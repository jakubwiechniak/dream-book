"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { fetchListings } from "@/lib/api"
import type { Listing } from "@/lib/types"

interface AnnouncementForm {
  id: number
  title: string
  address: string
  description: string
  pricePerNight: number
  propertyType: 'listing' | 'hotel'
  imageUrl: string
  latitude?: number
  longitude?: number
}

export default function Announcements() {
  const { isLoading: routeLoading, isAuthorized } = useProtectedRoute({
    allowedRoles: ["guest", "landlord", "admin"],
  })

  const [announcements, setAnnouncements] = useState<Listing[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true)
        const data = await fetchListings()
        setAnnouncements(data)
      } catch (err) {
        setError("Failed to fetch listings. Please try again later.")
        console.error("Error fetching listings:", err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthorized && !routeLoading) {
      getListings()
    }
  }, [isAuthorized, routeLoading])

  const [newAnnouncement, setNewAnnouncement] = useState<AnnouncementForm>({
    id: 0,
    title: "",
    address: "",
    description: "",
    pricePerNight: 0,
    propertyType: "listing",
    imageUrl: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.address) return

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const { createListing } = await import("@/lib/api")

      // Make the API call to create a new listing
      const createdListing = await createListing({
        title: newAnnouncement.title,
        description: newAnnouncement.description || "",
        price_per_night: newAnnouncement.pricePerNight.toString(),
        location: newAnnouncement.address,
        property_type: newAnnouncement.propertyType,
        image_url: newAnnouncement.imageUrl || undefined,
        latitude: newAnnouncement.latitude?.toString() || undefined,
        longitude: newAnnouncement.longitude?.toString() || undefined,
      })

      // Add the new listing to the state
      setAnnouncements((prev) => [...prev, createdListing])

      // Reset form
      setNewAnnouncement({
        id: 0,
        title: "",
        address: "",
        description: "",
        pricePerNight: 0,
        propertyType: "listing",
        imageUrl: "",
      })
    } catch (error) {
      console.error("Error creating announcement:", error)
      setSubmitError("Failed to create announcement. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container px-4 py-6 mx-auto md:px-6 md:py-12">
        {/* Sprawdzanie autoryzacji */}
        {routeLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-lg">Sprawdzanie uprawnień...</div>
            </div>
          </div>
        )}

        {/* Główna zawartość - wyświetlana tylko dla autoryzowanych użytkowników */}
        {!routeLoading && isAuthorized && (
          <>
            <h1 className="text-3xl font-bold mb-6">Zarządzaj ogłoszeniami</h1>

            {/* Loading and error states */}
            {loading && <p className="text-center py-4">Loading listings...</p>}
            {error && <p className="text-center py-4 text-red-600">{error}</p>}

            {/* Formularz dodawania ogłoszenia */}
            <div className="p-6 mb-8 bg-white border rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Dodaj nowe ogłoszenie
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Tytuł"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <select
                  value={newAnnouncement.propertyType}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      propertyType: e.target.value as 'listing' | 'hotel',
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="listing">Listing</option>
                  <option value="hotel">Hotel</option>
                </select>
                <input
                  type="text"
                  placeholder="Adres"
                  value={newAnnouncement.address}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Cena za noc ($)"
                  value={newAnnouncement.pricePerNight}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      pricePerNight: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="url"
                  placeholder="URL obrazu (opcjonalnie)"
                  value={newAnnouncement.imageUrl}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <div className="md:col-span-1"></div>
                <input
                  type="number"
                  step="any"
                  placeholder="Szerokość geograficzna (opcjonalnie)"
                  value={newAnnouncement.latitude || ""}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      latitude: parseFloat(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Długość geograficzna (opcjonalnie)"
                  value={newAnnouncement.longitude || ""}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      longitude: parseFloat(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Opis"
                  value={newAnnouncement.description}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg md:col-span-2"
                />
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleAddAnnouncement}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-black hover:to-gray-800 text-white font-medium py-2.5"
                >
                  {isSubmitting ? "Dodawanie..." : "Dodaj ogłoszenie"}
                </Button>
                {submitError && (
                  <p className="mt-2 text-red-600 text-sm">{submitError}</p>
                )}
              </div>
            </div>

            {/* Lista ogłoszeń */}
            {!loading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {announcements.map((listing) => (
                  <div
                    key={listing.id}
                    className="p-4 bg-white border rounded-lg shadow-md"
                  >
                    {listing.image_url && (
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg font-bold">{listing.title}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">{listing.location}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${listing.property_type === 'hotel'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                        }`}>
                        {listing.property_type === 'hotel' ? 'Hotel' : 'Listing'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-800">
                      {listing.description}
                    </p>
                    <p className="mt-4 text-lg font-semibold">
                      {listing.price_per_night} $ / noc
                    </p>
                    {(listing.latitude && listing.longitude) && (
                      <p className="mt-2 text-xs text-gray-500">
                        📍 {parseFloat(listing.latitude).toFixed(4)}, {parseFloat(listing.longitude).toFixed(4)}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Added by: {listing.owner_username}</p>
                      <p>
                        Created:{" "}
                        {new Date(listing.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
