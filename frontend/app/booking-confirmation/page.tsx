"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircleIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  DownloadIcon,
  ShareIcon,
} from "lucide-react"
import { reservationsAPI } from "@/lib/reservations-api"
import Link from "next/link"
import Image from "next/image"

interface ReservationDetails {
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

function BookingConfirmationContent() {
  const searchParams = useSearchParams()
  const confirmationNumber = searchParams.get("confirmation") || ""
  const { user } = useAuth()
  const [reservation, setReservation] = useState<ReservationDetails | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservationDetails = useCallback(async () => {
    try {
      setLoading(true)
      const details = await reservationsAPI.getReservationByConfirmation(
        confirmationNumber
      )
      setReservation(details)
    } catch (err) {
      setError("Failed to load reservation details")
      console.error("Error fetching reservation:", err)
    } finally {
      setLoading(false)
    }
  }, [confirmationNumber])

  useEffect(() => {
    if (confirmationNumber) {
      fetchReservationDetails()
    }
  }, [confirmationNumber, fetchReservationDetails])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading reservation details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {error || "Reservation not found"}
            </p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              Musisz być zalogowany, aby zobaczyć potwierdzenie rezerwacji
            </p>
            <Link href="/signin">
              <Button>Zaloguj się</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container px-4 py-6 mx-auto md:px-6 md:py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your reservation has been successfully processed
            </p>
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Confirmation: {confirmationNumber}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>{" "}
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Property"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {reservation.listing.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPinIcon className="w-3 h-3" />
                      {reservation.listing.location}
                    </div>
                    <Badge variant="outline">{reservation.status}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      <strong>Check-in:</strong>{" "}
                      {new Date(reservation.check_in).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}{" "}
                      (3:00 PM)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      <strong>Check-out:</strong>{" "}
                      {new Date(reservation.check_out).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}{" "}
                      (11:00 AM)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UsersIcon className="w-4 h-4" />
                    <span>
                      <strong>Guest:</strong>{" "}
                      {reservation.guest_name ||
                        user?.name ||
                        "Nie podano gościa"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span>
                      <strong>Total Amount:</strong> ${reservation.total_amount}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price per night</span>
                    <span>${reservation.listing.price_per_night}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Amount</span>
                    <span>${reservation.total_amount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Paid</span>
                    <span>$1,602</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Primary Guest</h4>
                  <div className="text-sm space-y-1">
                    <p>{user?.name || "Nie podano imienia"}</p>
                    <p>{user?.email || "Nie podano adresu email"}</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Payment Method</h4>
                  <div className="text-sm">
                    <p>Card ending in 1234</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Important Information</h4>
                  <div className="text-sm space-y-2 text-muted-foreground">
                    <p>• Please bring a valid photo ID at check-in</p>
                    <p>• Credit card used for booking may be required</p>
                    <p>• Cancellation is free until 48 hours before check-in</p>
                    <p>• Contact hotel directly for any special requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>What&apos;s Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-2">📧</div>
                  <h4 className="font-semibold mb-1">Confirmation Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Check your email for booking details and receipt
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-2">🏨</div>
                  <h4 className="font-semibold mb-1">Hotel Contact</h4>
                  <p className="text-sm text-muted-foreground">
                    Hotel will contact you 24-48 hours before arrival
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-2">📱</div>
                  <h4 className="font-semibold mb-1">Mobile Check-in</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our app for express check-in on arrival day
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button size="lg" className="flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" />
              Download Confirmation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <ShareIcon className="w-4 h-4" />
              Share Booking
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/profile">View All Bookings</Link>
            </Button>
          </div>

          <Card className="mt-6 bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-semibold text-orange-800 mb-2">
                  Need Help?
                </h4>
                <p className="text-sm text-orange-700 mb-3">
                  For any questions or changes to your booking, contact us:
                </p>
                <div className="text-sm text-orange-800">
                  <p>
                    <strong>Phone:</strong> 1-800-HOTELS (24/7)
                  </p>
                  <p>
                    <strong>Email:</strong> support@hotelbooter.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function BookingConfirmation() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading confirmation...</p>
          </div>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  )
}
