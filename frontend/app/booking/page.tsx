"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CalendarIcon,
  CreditCardIcon,
  CheckIcon,
  MapPinIcon,
  UsersIcon,
  AlertCircleIcon,
} from "lucide-react"
import { BookingFormData, BookingDetails } from "@/lib/types"
import { reservationsAPI } from "@/lib/reservations-api"
import { calculateDynamicPrice } from "@/lib/booking-utils"
import {
  validateBookingStep1,
  validateBookingStep2,
  ValidationError,
  formatCardNumber,
  formatPhoneNumber,
} from "@/lib/validation"
import Link from "next/link"
import Image from "next/image"

// Funkcja do formatowania ceny z właściwym zaokrąglaniem
const formatPrice = (price: number): string => {
  return (Math.round(price * 100) / 100).toFixed(2)
}

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get booking parameters from URL or use defaults
  const getBookingDetailsFromParams = (): BookingDetails => {
    const hotelId =
      searchParams.get("hotelId") ||
      searchParams.get("listingId") ||
      "default-listing"
    const hotelName = searchParams.get("hotelName") || "Hotel"
    const hotelLocation = searchParams.get("hotelLocation") || "Location"
    const hotelImage =
      searchParams.get("hotelImage") || "/placeholder.svg?height=64&width=64"
    const checkInParam = searchParams.get("checkIn")
    const checkOutParam = searchParams.get("checkOut")
    const adultsParam = searchParams.get("adults")
    const childrenParam = searchParams.get("children")
    const roomsParam = searchParams.get("rooms")
    const priceParam = searchParams.get("price")

    // Parse dates or use defaults (7 days from today)
    const checkIn = checkInParam
      ? new Date(checkInParam)
      : new Date(Date.now() + 24 * 60 * 60 * 1000)
    const checkOut = checkOutParam
      ? new Date(checkOutParam)
      : new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)

    // Parse guest numbers
    const adults = adultsParam ? parseInt(adultsParam) : 2
    const children = childrenParam ? parseInt(childrenParam) : 0
    const rooms = roomsParam ? parseInt(roomsParam) : 1

    // Calculate dynamic pricing based on dates and guests
    const pricingResult = calculateDynamicPrice({
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      basePrice: priceParam ? parseFloat(priceParam) : undefined,
    })

    return {
      hotelId,
      hotelName,
      hotelLocation,
      hotelImage,
      roomId: "standard-room",
      checkIn,
      checkOut,
      guests: { adults, children },
      rooms,
      totalNights: pricingResult.totalNights,
      pricePerNight: pricingResult.pricePerNight,
      subtotal: pricingResult.subtotal,
      taxes: pricingResult.taxes,
      total: pricingResult.total,
      breakdown: pricingResult.breakdown,
    }
  }

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(() =>
    getBookingDetailsFromParams()
  )

  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    paymentMethod: "card",
    cardDetails: {
      number: "",
      expiry: "",
      cvv: "",
      name: "",
    },
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  )

  // Update booking details when URL parameters change
  useEffect(() => {
    const updateBookingDetails = () => {
      const hotelId =
        searchParams.get("hotelId") ||
        searchParams.get("listingId") ||
        "default-listing"
      const hotelName = searchParams.get("hotelName") || "Hotel"
      const hotelLocation = searchParams.get("hotelLocation") || "Location"
      const hotelImage =
        searchParams.get("hotelImage") || "/placeholder.svg?height=64&width=64"
      const checkInParam = searchParams.get("checkIn")
      const checkOutParam = searchParams.get("checkOut")
      const adultsParam = searchParams.get("adults")
      const childrenParam = searchParams.get("children")
      const roomsParam = searchParams.get("rooms")
      const priceParam = searchParams.get("price")

      // Parse dates or use defaults (7 days from today)
      const checkIn = checkInParam
        ? new Date(checkInParam)
        : new Date(Date.now() + 24 * 60 * 60 * 1000)
      const checkOut = checkOutParam
        ? new Date(checkOutParam)
        : new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)

      // Parse guest numbers
      const adults = adultsParam ? parseInt(adultsParam) : 2
      const children = childrenParam ? parseInt(childrenParam) : 0
      const rooms = roomsParam ? parseInt(roomsParam) : 1

      // Calculate dynamic pricing based on dates and guests
      const pricingResult = calculateDynamicPrice({
        checkIn,
        checkOut,
        adults,
        children,
        rooms,
        basePrice: priceParam ? parseFloat(priceParam) : undefined,
      })

      setBookingDetails({
        hotelId,
        hotelName,
        hotelLocation,
        hotelImage,
        roomId: "standard-room",
        checkIn,
        checkOut,
        guests: { adults, children },
        rooms,
        totalNights: pricingResult.totalNights,
        pricePerNight: pricingResult.pricePerNight,
        subtotal: pricingResult.subtotal,
        taxes: pricingResult.taxes,
        total: pricingResult.total,
        breakdown: pricingResult.breakdown,
      })
    }

    updateBookingDetails()
  }, [searchParams])

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    let formattedValue = value

    // Format specific fields
    if (field === "phone") {
      formattedValue = formatPhoneNumber(value)
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }))

    // Clear validation errors for this field
    setValidationErrors((prev) => prev.filter((error) => error.field !== field))
  }

  const handleCardDetailsChange = (
    field: keyof NonNullable<BookingFormData["cardDetails"]>,
    value: string
  ) => {
    let formattedValue = value

    // Format card number
    if (field === "number") {
      formattedValue = formatCardNumber(value)
    }

    // Format expiry date
    if (field === "expiry") {
      // Auto-format expiry date as MM/YY
      const cleanValue = value.replace(/\D/g, "")
      if (cleanValue.length >= 2) {
        formattedValue =
          cleanValue.substring(0, 2) +
          (cleanValue.length > 2 ? "/" + cleanValue.substring(2, 4) : "")
      } else {
        formattedValue = cleanValue
      }
    }

    setFormData((prev) => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails!,
        [field]: formattedValue,
      },
    }))

    // Clear validation errors for this field
    const fieldName = `card${field.charAt(0).toUpperCase() + field.slice(1)}`
    setValidationErrors((prev) =>
      prev.filter((error) => error.field !== fieldName)
    )
  }

  // Get error message for a specific field
  const getFieldError = (fieldName: string): string | undefined => {
    const error = validationErrors.find((err) => err.field === fieldName)
    return error?.message
  }

  // Simple client-side validation for immediate feedback
  const validateStep1 = () => {
    const validation = validateBookingStep1({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    })
    console.log("Step 1 validation:", validation, formData)
    return validation.isValid
  }

  const validateStep2 = () => {
    const validation = validateBookingStep2({
      paymentMethod: formData.paymentMethod,
      cardDetails: formData.cardDetails,
    })
    return validation.isValid
  }

  const handleNextStep = async () => {
    console.log("handleNextStep called, current step:", currentStep)
    console.log("validateStep1():", validateStep1())

    // For now, let's use only client-side validation to avoid API issues
    if (currentStep === 1) {
      const isValid = validateStep1()
      console.log("Step 1 client validation result:", isValid)
      if (isValid) {
        setCurrentStep(2)
      } else {
        // Show validation errors
        const validation = validateBookingStep1({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        })
        setValidationErrors(validation.errors)
      }
    } else if (currentStep === 2) {
      const isValid = validateStep2()
      console.log("Step 2 client validation result:", isValid)
      if (isValid) {
        setCurrentStep(3)
      } else {
        // Show validation errors
        const validation = validateBookingStep2({
          paymentMethod: formData.paymentMethod,
          cardDetails: formData.cardDetails,
        })
        setValidationErrors(validation.errors)
      }
    }
  }
  const handleConfirmBooking = async () => {
    setIsProcessing(true)
    setValidationErrors([]) // Clear any previous errors

    try {
      // Final validation before booking
      const step1Valid = validateStep1()
      const step2Valid = validateStep2()

      if (!step1Valid || !step2Valid) {
        setValidationErrors([
          {
            field: "booking",
            message:
              "Please review and correct all information before confirming.",
          },
        ])
        setIsProcessing(false)
        return
      }

      // Prepare booking data for the backend
      const bookingData = {
        listing_id: bookingDetails.hotelId,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        rooms: bookingDetails.rooms,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        specialRequests: formData.specialRequests,
        paymentMethod: formData.paymentMethod,
        calculatedTotal: bookingDetails.total,
        priceBreakdown: {
          basePrice: bookingDetails.pricePerNight,
          guestAdjustment: bookingDetails.breakdown?.guestAdjustment || 0,
          roomAdjustment: bookingDetails.breakdown?.roomAdjustment || 0,
          totalNights: bookingDetails.totalNights,
          pricePerNight: bookingDetails.pricePerNight,
        },
      }

      // Create the reservation using our API
      const response = await reservationsAPI.createReservation(bookingData)

      // Redirect to confirmation page with the actual confirmation number
      router.push(
        `/booking-confirmation?confirmation=${response.confirmation_number}`
      )
    } catch (error) {
      console.error("Booking failed:", error)

      // Set user-friendly error message
      let errorMessage =
        "We're sorry, but there was an issue processing your booking. Please try again."

      if (error instanceof Error) {
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again."
        } else if (error.message.includes("validation")) {
          errorMessage =
            "There was an issue with your booking information. Please review and try again."
        } else if (error.message.includes("payment")) {
          errorMessage =
            "There was an issue processing your payment. Please check your payment details and try again."
        }
      }

      setValidationErrors([{ field: "booking", message: errorMessage }])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container px-4 py-6 mx-auto md:px-6 md:py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <Link
              href={`/hotel-details?hotelId=${bookingDetails.hotelId}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {bookingDetails.hotelName || "Hotel"}
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm">Booking</span>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 1 ? <CheckIcon className="w-4 h-4" /> : "1"}
              </div>
              <div
                className={`w-16 h-0.5 ${
                  currentStep >= 2 ? "bg-primary" : "bg-gray-200"
                }`}
              />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 2 ? <CheckIcon className="w-4 h-4" /> : "2"}
              </div>
              <div
                className={`w-16 h-0.5 ${
                  currentStep >= 3 ? "bg-primary" : "bg-gray-200"
                }`}
              />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 3 ? <CheckIcon className="w-4 h-4" /> : "3"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Please provide accurate information as it will be used for
                      your reservation and contact purposes.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* General error message */}
                    {validationErrors.some(
                      (err) => err.field === "general"
                    ) && (
                      <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircleIcon className="w-4 h-4" />
                        <span>{getFieldError("general")}</span>
                      </div>
                    )}

                    {/* Info message when there are validation errors */}
                    {validationErrors.length > 0 &&
                      !validationErrors.some(
                        (err) => err.field === "general"
                      ) && (
                        <div className="flex items-center gap-2 p-3 text-sm text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                          <AlertCircleIcon className="w-4 h-4" />
                          <span>
                            Please correct the highlighted fields below to
                            continue.
                          </span>
                        </div>
                      )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          placeholder="Enter your first name"
                          className={
                            getFieldError("firstName") ? "border-red-500" : ""
                          }
                        />
                        {getFieldError("firstName") && (
                          <p className="text-sm text-red-600 mt-1">
                            {getFieldError("firstName")}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          placeholder="Enter your last name"
                          className={
                            getFieldError("lastName") ? "border-red-500" : ""
                          }
                        />
                        {getFieldError("lastName") && (
                          <p className="text-sm text-red-600 mt-1">
                            {getFieldError("lastName")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="example@email.com"
                        className={
                          getFieldError("email") ? "border-red-500" : ""
                        }
                      />
                      {getFieldError("email") && (
                        <p className="text-sm text-red-600 mt-1">
                          {getFieldError("email")}
                        </p>
                      )}
                      {!getFieldError("email") && (
                        <p className="text-xs text-muted-foreground mt-1">
                          We&apos;ll send your booking confirmation to this
                          email
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="123 456 789 or +48 123 456 789"
                        className={
                          getFieldError("phone") ? "border-red-500" : ""
                        }
                      />
                      {getFieldError("phone") && (
                        <p className="text-sm text-red-600 mt-1">
                          {getFieldError("phone")}
                        </p>
                      )}
                      {!getFieldError("phone") && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Include country code for international numbers
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="specialRequests">
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) =>
                          handleInputChange("specialRequests", e.target.value)
                        }
                        placeholder="Any special requests or requirements"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={handleNextStep}
                      disabled={!validateStep1()}
                      className="w-full"
                    >
                      Continue to Payment
                    </Button>

                    {/* Info message about what happens next */}
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Next: Secure payment information • No charges until
                        booking is confirmed
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your payment details are encrypted and secure. We accept
                      major credit cards.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* General error message for payment step */}
                    {validationErrors.some(
                      (err) => err.field === "general"
                    ) && (
                      <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircleIcon className="w-4 h-4" />
                        <span>{getFieldError("general")}</span>
                      </div>
                    )}

                    {/* Info message when there are validation errors */}
                    {validationErrors.length > 0 &&
                      !validationErrors.some(
                        (err) => err.field === "general"
                      ) && (
                        <div className="flex items-center gap-2 p-3 text-sm text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                          <AlertCircleIcon className="w-4 h-4" />
                          <span>
                            Please check your payment details below and correct
                            any errors.
                          </span>
                        </div>
                      )}
                    <div>
                      <Label>Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value: "card" | "paypal") =>
                          handleInputChange("paymentMethod", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">
                            Credit/Debit Card
                          </SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.paymentMethod === "card" && (
                      <>
                        <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-2 h-2 text-white" />
                          </div>
                          <span>
                            Your payment information is encrypted and secure
                          </span>
                        </div>

                        <div>
                          <Label htmlFor="cardName">Cardholder Name *</Label>
                          <Input
                            id="cardName"
                            value={formData.cardDetails?.name || ""}
                            onChange={(e) =>
                              handleCardDetailsChange("name", e.target.value)
                            }
                            placeholder="Full name as shown on card"
                            className={
                              getFieldError("cardholderName")
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {getFieldError("cardholderName") && (
                            <p className="text-sm text-red-600 mt-1">
                              {getFieldError("cardholderName")}
                            </p>
                          )}
                          {!getFieldError("cardholderName") && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Enter the full name exactly as it appears on your
                              card
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardDetails?.number || ""}
                            onChange={(e) =>
                              handleCardDetailsChange("number", e.target.value)
                            }
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className={
                              getFieldError("cardNumber")
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {getFieldError("cardNumber") && (
                            <p className="text-sm text-red-600 mt-1">
                              {getFieldError("cardNumber")}
                            </p>
                          )}
                          {!getFieldError("cardNumber") && (
                            <p className="text-xs text-muted-foreground mt-1">
                              We accept Visa, Mastercard, American Express, and
                              Discover
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date *</Label>
                            <Input
                              id="expiry"
                              value={formData.cardDetails?.expiry || ""}
                              onChange={(e) =>
                                handleCardDetailsChange(
                                  "expiry",
                                  e.target.value
                                )
                              }
                              placeholder="MM/YY"
                              maxLength={5}
                              className={
                                getFieldError("cardExpiry")
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {getFieldError("cardExpiry") && (
                              <p className="text-sm text-red-600 mt-1">
                                {getFieldError("cardExpiry")}
                              </p>
                            )}
                            {!getFieldError("cardExpiry") && (
                              <p className="text-xs text-muted-foreground mt-1">
                                MM/YY format
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={formData.cardDetails?.cvv || ""}
                              onChange={(e) =>
                                handleCardDetailsChange("cvv", e.target.value)
                              }
                              placeholder="123"
                              maxLength={4}
                              className={
                                getFieldError("cardCvv") ? "border-red-500" : ""
                              }
                            />
                            {getFieldError("cardCvv") && (
                              <p className="text-sm text-red-600 mt-1">
                                {getFieldError("cardCvv")}
                              </p>
                            )}
                            {!getFieldError("cardCvv") && (
                              <p className="text-xs text-muted-foreground mt-1">
                                3-4 digits on back of card
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        disabled={!validateStep2()}
                        className="flex-1"
                      >
                        Review Booking
                      </Button>
                    </div>

                    {/* Info message about security and next steps */}
                    <div className="text-center space-y-1">
                      <p className="text-xs text-muted-foreground">
                        🔒 Your payment information is encrypted and secure
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Next: Review your booking details before confirming
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Confirm</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Please review all details carefully before confirming your
                      booking. Once confirmed, you&apos;ll receive an email
                      confirmation.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Error message for booking confirmation */}
                    {validationErrors.some(
                      (err) => err.field === "booking"
                    ) && (
                      <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircleIcon className="w-4 h-4" />
                        <span>{getFieldError("booking")}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold mb-2">Guest Information</h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Name:</strong> {formData.firstName}{" "}
                          {formData.lastName}
                        </p>
                        <p>
                          <strong>Email:</strong> {formData.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {formData.phone}
                        </p>
                        {formData.specialRequests && (
                          <p>
                            <strong>Special Requests:</strong>{" "}
                            {formData.specialRequests}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <div className="flex items-center gap-2">
                        <CreditCardIcon className="w-4 h-4" />
                        <span className="text-sm">
                          {formData.paymentMethod === "card"
                            ? `Card ending in ${
                                formData.cardDetails?.number?.slice(-4) ||
                                "****"
                              }`
                            : "PayPal"}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Cancellation Policy
                      </h3>
                      <p className="text-sm text-green-700">
                        Free cancellation until 48 hours before check-in. After
                        that, you&apos;ll be charged the first night&apos;s
                        rate.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleConfirmBooking}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? "Processing..." : "Confirm Booking"}
                      </Button>
                    </div>

                    {/* Final confirmation info */}
                    <div className="text-center space-y-1">
                      <p className="text-xs text-muted-foreground">
                        ✓ By confirming, you agree to our terms and conditions
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You&apos;ll receive an email confirmation within minutes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex gap-3 mb-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={
                            bookingDetails.hotelImage ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt="Hotel"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {bookingDetails.hotelName || "Hotel"}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPinIcon className="w-3 h-3" />
                          {bookingDetails.hotelLocation || "Location"}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Deluxe King Room</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {bookingDetails.checkIn.toLocaleDateString()} -{" "}
                        {bookingDetails.checkOut.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="w-4 h-4" />
                      <span>
                        {bookingDetails.guests.adults} adults,{" "}
                        {bookingDetails.guests.children} children
                      </span>
                    </div>
                    <div className="text-sm">
                      <span>{bookingDetails.totalNights} nights</span>
                      {bookingDetails.rooms && bookingDetails.rooms > 1 && (
                        <span className="ml-4">
                          • {bookingDetails.rooms} rooms
                        </span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {/* Pokazujemy bazową cenę razy liczba nocy */}
                    <div className="flex justify-between text-sm">
                      <span>
                        $
                        {formatPrice(
                          bookingDetails.breakdown?.basePrice || 199
                        )}{" "}
                        base price x {bookingDetails.totalNights} nights
                      </span>
                      <span>
                        $
                        {formatPrice(
                          (bookingDetails.breakdown?.basePrice || 199) *
                            bookingDetails.totalNights
                        )}
                      </span>
                    </div>

                    {/* Pokazujemy różnicę między ceną bazową a rzeczywistą ceną po modyfikatorach */}
                    {bookingDetails.breakdown &&
                      (bookingDetails.breakdown.weekendDays > 0 ||
                        bookingDetails.breakdown.peakSeasonDays > 0 ||
                        bookingDetails.breakdown.holidayDays > 0) && (
                        <div className="flex justify-between text-sm text-orange-600">
                          <span>
                            Price adjustments (
                            {bookingDetails.breakdown.weekendDays > 0 &&
                              `${bookingDetails.breakdown.weekendDays} weekend days`}
                            {bookingDetails.breakdown.weekendDays > 0 &&
                              (bookingDetails.breakdown.peakSeasonDays > 0 ||
                                bookingDetails.breakdown.holidayDays > 0) &&
                              ", "}
                            {bookingDetails.breakdown.peakSeasonDays > 0 &&
                              `${bookingDetails.breakdown.peakSeasonDays} peak season days`}
                            {bookingDetails.breakdown.peakSeasonDays > 0 &&
                              bookingDetails.breakdown.holidayDays > 0 &&
                              ", "}
                            {bookingDetails.breakdown.holidayDays > 0 &&
                              `${bookingDetails.breakdown.holidayDays} holiday days`}
                            )
                          </span>
                          <span>
                            +$
                            {formatPrice(
                              bookingDetails.subtotal -
                                bookingDetails.breakdown.guestAdjustment -
                                bookingDetails.breakdown.basePrice *
                                  bookingDetails.totalNights
                            )}
                          </span>
                        </div>
                      )}

                    {/* Weekend pricing */}
                    {bookingDetails.breakdown &&
                      bookingDetails.breakdown.weekendDays > 0 && (
                        <div className="flex justify-between text-sm text-blue-600">
                          <span>
                            Weekend premium (
                            {bookingDetails.breakdown.weekendDays} days)
                          </span>
                          <span>+30%</span>
                        </div>
                      )}

                    {/* Guest adjustments */}
                    {bookingDetails.breakdown &&
                      bookingDetails.breakdown.guestAdjustment !== 0 && (
                        <div className="flex justify-between text-sm">
                          <span>
                            {bookingDetails.breakdown.guestAdjustment > 0
                              ? `Guest fees (${
                                  bookingDetails.guests.adults > 2
                                    ? `${
                                        bookingDetails.guests.adults - 2
                                      } extra adults`
                                    : ""
                                }${
                                  bookingDetails.guests.adults > 2 &&
                                  bookingDetails.guests.children > 0
                                    ? ", "
                                    : ""
                                }${
                                  bookingDetails.guests.children > 0
                                    ? `${bookingDetails.guests.children} children`
                                    : ""
                                })`
                              : "Single guest discount"}
                          </span>
                          <span
                            className={
                              bookingDetails.breakdown.guestAdjustment > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {bookingDetails.breakdown.guestAdjustment > 0
                              ? "+"
                              : ""}
                            $
                            {formatPrice(
                              Math.abs(bookingDetails.breakdown.guestAdjustment)
                            )}
                          </span>
                        </div>
                      )}

                    {/* Room adjustments */}
                    {bookingDetails.breakdown &&
                      bookingDetails.breakdown.roomAdjustment > 0 && (
                        <div className="flex justify-between text-sm text-blue-600">
                          <span>
                            Additional rooms ({(bookingDetails.rooms || 1) - 1}{" "}
                            × 90% base price)
                          </span>
                          <span>
                            +$
                            {formatPrice(
                              bookingDetails.breakdown.roomAdjustment
                            )}
                          </span>
                        </div>
                      )}

                    <div className="flex justify-between text-sm font-medium border-t pt-2">
                      <span>Subtotal</span>
                      <span>${formatPrice(bookingDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes & fees (15%)</span>
                      <span>${formatPrice(bookingDetails.taxes)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${formatPrice(bookingDetails.total)}</span>
                    </div>
                  </div>

                  {currentStep < 3 && (
                    <p className="text-xs text-center text-muted-foreground">
                      You won&apos;t be charged until you confirm your booking
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
