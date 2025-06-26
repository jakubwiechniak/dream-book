"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import {
  User,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Star,
  Home,
  Calendar as CalendarIcon,
  Settings,
  Shield,
  Bell,
  Lock,
  Trash2,
  Users,
  Clock,
} from "lucide-react"
import type { UserData, Reservation } from "@/lib/types"
import { updateUserProfile, fetchUserReservations } from "@/lib/api"
import { reservationsAPI } from "@/lib/reservations-api"
import { calculateDynamicPrice } from "@/lib/booking-utils"

interface UserProfileProps {
  user: UserData
}

// Funkcja do formatowania ceny rezerwacji z uwzględnieniem liczby gości i pokoi
const formatReservationPrice = (totalAmount: string, adults: number, children: number, nights: number, rooms?: number): string => {
  let basePrice = parseFloat(totalAmount)

  // Jeśli cena wydaje się być nieprawidłowa (np. tylko cena bazowa), przelicz ją
  if (basePrice > 0 && (adults > 2 || children > 0 || (rooms && rooms > 1))) {
    const breakdown = calculatePriceBreakdown(totalAmount, adults, children, nights, rooms)

    // Jeśli różnica jest znaczna, użyj przeliczonej ceny
    if (Math.abs(basePrice - breakdown.total) > basePrice * 0.1) {
      basePrice = breakdown.total
    }
  }

  return (Math.round(basePrice * 100) / 100).toFixed(2)
}

// Funkcja do obliczania szczegółów cenowych dla wyświetlenia
const calculatePriceBreakdown = (totalAmount: string, adults: number, children: number, nights: number, rooms?: number) => {
  const basePrice = parseFloat(totalAmount) / nights

  const pricing = calculateDynamicPrice({
    checkIn: new Date(),
    checkOut: new Date(Date.now() + nights * 24 * 60 * 60 * 1000),
    adults,
    children,
    rooms: rooms || 1,
    basePrice
  })

  return {
    basePrice: pricing.pricePerNight,
    guestAdjustment: pricing.breakdown.guestAdjustment,
    roomAdjustment: pricing.breakdown.roomAdjustment,
    total: pricing.total,
    hasAdjustments: adults > 2 || children > 0 || (rooms && rooms > 1)
  }
}

export function UserProfile({ user }: UserProfileProps) {
  // Funkcja do dekodowania nazwy użytkownika
  const decodeUserName = (name: string) => {
    try {
      // Najpierw spróbuj zdekodować URI component
      let decoded = decodeURIComponent(name)

      // Następnie zdekoduj znaki HTML entities
      if (typeof window !== "undefined") {
        // W przeglądarce użyj DOM API
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = decoded
        decoded = tempDiv.textContent || tempDiv.innerText || decoded
      } else {
        // Na serwerze użyj prostej zamiany najczęstszych entities
        decoded = decoded
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&#x2F;/g, "/")
          .replace(/&nbsp;/g, " ")
      }

      return decoded
    } catch (error) {
      // Jeśli dekodowanie się nie powiedzie, zwróć oryginalną nazwę
      console.warn("Nie można zdekodować nazwy użytkownika:", error)
      return name
    }
  }

  const displayName = decodeUserName(user.name)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: displayName,
    email: user.email,
    phone: "",
    location: "",
    bio: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loadingReservations, setLoadingReservations] = useState(true)
  const [reservationError, setReservationError] = useState<string | null>(null)
  const [cancellationLoading, setCancellationLoading] = useState<string | null>(null)

  // Fetch user reservations on component mount
  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoadingReservations(true)
        setReservationError(null)
        const userReservations = await fetchUserReservations()
        setReservations(userReservations)
      } catch (error) {
        console.error('Error loading reservations:', error)
        setReservationError('Nie udało się załadować rezerwacji. Spróbuj ponownie później.')
      } finally {
        setLoadingReservations(false)
      }
    }

    loadReservations()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateUserProfile(user.id, formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Błąd podczas aktualizacji profilu:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm("Czy na pewno chcesz anulować tę rezerwację? Ta akcja nie może być cofnięta.")) {
      return
    }

    try {
      setCancellationLoading(reservationId)
      await reservationsAPI.cancelReservation(reservationId)

      // Update the reservations list by removing the cancelled reservation
      // or refetch the reservations to get the updated status
      const updatedReservations = await fetchUserReservations()
      setReservations(updatedReservations)

      // Show success message (you might want to add a toast notification here)
      alert("Rezerwacja została pomyślnie anulowana.")
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      alert("Wystąpił błąd podczas anulowania rezerwacji. Spróbuj ponownie.")
    } finally {
      setCancellationLoading(null)
    }
  }

  const joinedDate = new Date(user.joinedAt)
  const formattedJoinedDate = format(joinedDate, "d MMMM yyyy", { locale: pl })

  const getRoleName = (role: string) => {
    switch (role) {
      case "guest":
        return "Gość"
      case "landlord":
        return "Gospodarz"
      case "admin":
        return "Administrator"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "guest":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "landlord":
        return "bg-gray-800 text-white border-gray-700"
      case "admin":
        return "bg-black text-white border-gray-900"
      default:
        return "bg-gray-200 text-gray-700 border-gray-300"
    }
  }
  // Compute active (non-cancelled) reservations count
  const activeReservations = reservations.filter(reservation => reservation.status !== 'cancelled')
  const activeReservationsCount = activeReservations.length

  // Sort reservations: active ones first, then cancelled ones
  const sortedReservations = [...reservations].sort((a, b) => {
    // Priority order: confirmed, pending, completed, cancelled
    const statusPriority = {
      'confirmed': 1,
      'pending': 2,
      'completed': 3,
      'cancelled': 4
    }

    const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 5
    const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 5

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    // If same status, sort by check-in date (newest first)
    return new Date(b.check_in).getTime() - new Date(a.check_in).getTime()
  })

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-gray-200 shadow-lg">
        <div className="bg-gradient-to-r from-gray-800 to-black h-32"></div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-center gap-6 md:flex-row -mt-16">
            <div className="relative">
              <div className="h-32 w-32 border-4 border-white shadow-xl rounded-full overflow-hidden bg-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format&q=80"
                  alt={displayName}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 shadow-lg bg-white border-gray-300 hover:bg-gray-50"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4 text-gray-700" />
              </Button>
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left mt-4 md:mt-0">
              <div>
                <h2 className="text-3xl font-bold text-white">{displayName}</h2>
                <p className="text-lg text-gray-400">{user.email}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Badge
                  className={`${getRoleColor(user.role)} font-medium px-3 py-1`}
                >
                  {getRoleName(user.role)}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Z nami od {formattedJoinedDate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-2">                <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {activeReservationsCount}
                </div>
                <div className="text-sm text-gray-500">Aktywnych rezerwacji</div>
              </div>
                {user.role === "landlord" && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {user.properties || 0}
                    </div>
                    <div className="text-sm text-gray-500">Obiektów</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-500">Ocena</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edytuj profil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Anuluj
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Zapisywanie..." : "Zapisz"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Edytuj dane osobowe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Imię i nazwisko
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Wprowadź swoje imię i nazwisko"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="twoj@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+48 123 456 789"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Lokalizacja
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Miasto, Kraj"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  O mnie
                </Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Opowiedz coś o sobie..."
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      {!isEditing && (
        <Tabs defaultValue="reservations" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="reservations">Rezerwacje</TabsTrigger>
            <TabsTrigger value="reviews">Opinie</TabsTrigger>
            <TabsTrigger value="settings">Ustawienia</TabsTrigger>
          </TabsList>
          <TabsContent value="reservations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Twoje rezerwacje
                </CardTitle>
              </CardHeader>              <CardContent>
                {loadingReservations ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-500">Ładowanie rezerwacji...</p>
                    </div>
                  </div>
                ) : reservationError ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Błąd podczas ładowania
                    </h3>
                    <p className="text-gray-500 mb-4">{reservationError}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      Spróbuj ponownie
                    </Button>
                  </div>
                ) : reservations.length > 0 ? (
                  <div className="space-y-6">                    <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">
                        Masz {reservations.length} rezerwacji
                        {activeReservationsCount !== reservations.length && (
                          <span className="text-sm text-gray-500 ml-1">
                            ({activeReservationsCount} aktywnych)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Zarządzaj swoimi pobytami i rezerwacjami
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {reservations.length}
                      </Badge>
                      {activeReservationsCount !== reservations.length && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {activeReservationsCount} aktywnych
                        </Badge>
                      )}
                    </div>
                  </div>                    <div className="space-y-4">                      {sortedReservations.map((reservation) => (
                    <Card
                      key={reservation.id}
                      className={`border border-gray-200 hover:shadow-md transition-shadow ${reservation.status === 'cancelled' ? 'opacity-60 grayscale' : ''
                        }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{reservation.listing_title}</h3>
                              <div className="flex items-center text-gray-500 text-sm mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {reservation.listing_location}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge
                                variant={
                                  reservation.status === 'confirmed' ? 'default' :
                                    reservation.status === 'pending' ? 'secondary' :
                                      reservation.status === 'cancelled' ? 'destructive' :
                                        'outline'
                                }
                              >
                                {reservation.status === 'confirmed' ? 'Potwierdzona' :
                                  reservation.status === 'pending' ? 'Oczekująca' :
                                    reservation.status === 'cancelled' ? 'Anulowana' :
                                      reservation.status === 'completed' ? 'Zakończona' :
                                        reservation.status}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                {reservation.confirmation_number}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <div>
                                <p className="text-gray-500">Przyjazd</p>
                                <p className="font-medium">{format(new Date(reservation.check_in), 'd MMM yyyy', { locale: pl })}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <div>
                                <p className="text-gray-500">Wyjazd</p>
                                <p className="font-medium">{format(new Date(reservation.check_out), 'd MMM yyyy', { locale: pl })}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              <div>
                                <p className="text-gray-500">Goście</p>
                                <p className="font-medium">
                                  {reservation.guests_adults} {reservation.guests_adults === 1 ? 'dorosły' : 'dorośli'}
                                  {reservation.guests_children > 0 && `, ${reservation.guests_children} ${reservation.guests_children === 1 ? 'dziecko' : 'dzieci'}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              <div>
                                <p className="text-gray-500">Noce</p>
                                <p className="font-medium">{reservation.total_nights}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-gray-500">Kwota całkowita</p>
                                  <p className="text-lg font-semibold">
                                    {formatReservationPrice(reservation.total_amount, reservation.guests_adults, reservation.guests_children, reservation.total_nights, reservation.rooms)} $
                                  </p>
                                </div>
                                {(reservation.guests_adults > 2 || reservation.guests_children > 0) && (
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500">Uwzględnia opłaty za:</p>
                                    {reservation.guests_adults > 2 && (
                                      <p className="text-xs text-gray-600">
                                        +{reservation.guests_adults - 2} dodatkowych dorosłych
                                      </p>
                                    )}
                                    {reservation.guests_children > 0 && (
                                      <p className="text-xs text-gray-600">
                                        +{reservation.guests_children} {reservation.guests_children === 1 ? 'dziecko' : 'dzieci'}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Cena za {reservation.total_nights} {reservation.total_nights === 1 ? 'noc' : reservation.total_nights < 5 ? 'noce' : 'nocy'}
                                {reservation.guests_adults > 2 || reservation.guests_children > 0 ? ' z dopłatami za dodatkowych gości' : ''}
                              </div>
                            </div>                                <div className="flex space-x-2">
                              {reservation.status === 'confirmed' && (
                                <>
                                  <Button size="sm" variant="outline">
                                    Szczegóły
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleCancelReservation(reservation.id)}
                                    disabled={cancellationLoading === reservation.id}
                                    className="gap-1"
                                  >
                                    {cancellationLoading === reservation.id ? (
                                      <>
                                        <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
                                        Anulowanie...
                                      </>
                                    ) : (
                                      <>
                                        <X className="h-3 w-3" />
                                        Anuluj
                                      </>
                                    )}
                                  </Button>
                                </>
                              )}
                              {reservation.status === 'pending' && (
                                <>
                                  <Button size="sm" variant="outline">
                                    Zarządzaj
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleCancelReservation(reservation.id)}
                                    disabled={cancellationLoading === reservation.id}
                                    className="gap-1"
                                  >
                                    {cancellationLoading === reservation.id ? (
                                      <>
                                        <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
                                        Anulowanie...
                                      </>
                                    ) : (
                                      <>
                                        <X className="h-3 w-3" />
                                        Anuluj
                                      </>
                                    )}
                                  </Button>
                                </>
                              )}
                              {reservation.status === 'cancelled' && (
                                <Badge variant="secondary" className="text-xs">
                                  Anulowana
                                </Badge>
                              )}
                              {reservation.status === 'completed' && (
                                <Button size="sm" variant="outline">
                                  Wystaw opinię
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Brak rezerwacji
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      Nie masz jeszcze żadnych rezerwacji. Znajdź idealne
                      miejsce na swój następny pobyt.
                    </p>
                    <Button asChild size="lg" className="gap-2">
                      <a href="/hotels">
                        <Home className="h-4 w-4" />
                        Znajdź miejsce na pobyt
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Twoje opinie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Brak opinii
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Nie dodałeś jeszcze żadnych opinii. Podziel się swoimi
                    doświadczeniami z innymi podróżnikami.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild variant="outline" className="gap-2">
                      <a href="/stays">
                        <Star className="h-4 w-4" />
                        Oceń swój pobyt
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <a href="/reviews">Zobacz wszystkie opinie</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Ustawienia konta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notifications Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Powiadomienia
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                      <div className="space-y-1">
                        <h4 className="font-medium">Powiadomienia email</h4>
                        <p className="text-sm text-gray-500">
                          Otrzymuj powiadomienia o rezerwacjach i promocjach
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                      <div className="space-y-1">
                        <h4 className="font-medium">Powiadomienia push</h4>
                        <p className="text-sm text-gray-500">
                          Otrzymuj natychmiastowe powiadomienia w przeglądarce
                        </p>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Security Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Bezpieczeństwo
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <h4 className="font-medium">Zmień hasło</h4>
                        <p className="text-sm text-gray-500">
                          Aktualizuj swoje hasło regularnie dla bezpieczeństwa
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Lock className="h-4 w-4" />
                        Zmień hasło
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <h4 className="font-medium">
                          Autoryzacja dwuskładnikowa
                        </h4>
                        <p className="text-sm text-gray-500">
                          Dodaj dodatkową warstwę bezpieczeństwa do swojego
                          konta
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Włącz 2FA
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Danger Zone */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Strefa niebezpieczna
                  </h3>

                  <div className="p-4 rounded-lg border border-gray-300 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900">
                          Usuń konto
                        </h4>
                        <p className="text-sm text-gray-600">
                          Trwale usuń swoje konto i wszystkie dane. Ta akcja
                          jest nieodwracalna.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-gray-400 text-gray-700 hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Usuń konto
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {user.role === "landlord" && (
        <Card>
          <CardHeader>
            <CardTitle>Zarządzanie obiektami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Zarządzasz {user.properties || 0}{" "}
                {user.properties === 1
                  ? "obiektem"
                  : user.properties && user.properties < 5
                    ? "obiektami"
                    : "obiektami"}
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <a href="/listings">Moje obiekty</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/listings/new">Dodaj nowy obiekt</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
