// Validation utilities for booking pipeline

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ValidationError {
  field: string
  message: string
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = []

  if (!email) {
    errors.push("Email is required")
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Phone number validation (supports international formats)
export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = []

  if (!phone) {
    errors.push("Phone number is required")
  } else {
    // Remove all non-digit characters except + for country code
    const cleanPhone = phone.replace(/[^\d+]/g, "")

    // Check minimum length (9 digits for some countries, like Poland)
    if (cleanPhone.length < 9) {
      errors.push("Phone number too short")
    } else if (cleanPhone.length > 15) {
      errors.push("Phone number too long")
    }

    // Check if contains only digits and optional + at start
    const phoneRegex = /^(\+)?\d+$/
    if (!phoneRegex.test(cleanPhone)) {
      errors.push("Phone number contains invalid characters")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Credit card number validation (Luhn algorithm)
export const validateCreditCard = (cardNumber: string): ValidationResult => {
  const errors: string[] = []

  if (!cardNumber) {
    errors.push("Card number is required")
  } else {
    // Remove all non-digit characters
    const cleanCard = cardNumber.replace(/\D/g, "")

    // Check length (13-19 digits for most cards)
    if (cleanCard.length < 13 || cleanCard.length > 19) {
      errors.push("Card number must be between 13-19 digits")
    } else {
      // Luhn algorithm validation
      if (!isValidLuhn(cleanCard)) {
        errors.push("Invalid card number")
      }
    }

    // Check for card type patterns
    const cardType = getCardType(cleanCard)
    if (!cardType) {
      errors.push("Unsupported card type")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Expiry date validation (MM/YY or MM/YYYY format)
export const validateExpiryDate = (expiry: string): ValidationResult => {
  const errors: string[] = []

  if (!expiry) {
    errors.push("Expiry date is required")
  } else {
    // Accept MM/YY or MM/YYYY format
    const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/

    if (!expiryRegex.test(expiry)) {
      errors.push("Invalid expiry format (use MM/YY or MM/YYYY)")
    } else {
      const [month, yearStr] = expiry.split("/")
      const year =
        yearStr.length === 2 ? 2000 + parseInt(yearStr) : parseInt(yearStr)
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1

      if (
        year < currentYear ||
        (year === currentYear && parseInt(month) < currentMonth)
      ) {
        errors.push("Card has expired")
      }

      if (year > currentYear + 20) {
        errors.push("Expiry date too far in the future")
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// CVV validation
export const validateCVV = (
  cvv: string,
  cardNumber?: string
): ValidationResult => {
  const errors: string[] = []

  if (!cvv) {
    errors.push("CVV is required")
  } else {
    const cvvRegex = /^\d{3,4}$/

    if (!cvvRegex.test(cvv)) {
      errors.push("CVV must be 3 or 4 digits")
    } else {
      // American Express requires 4 digits, others require 3
      if (cardNumber) {
        const cleanCard = cardNumber.replace(/\D/g, "")
        const isAmex = cleanCard.startsWith("34") || cleanCard.startsWith("37")

        if (isAmex && cvv.length !== 4) {
          errors.push("American Express CVV must be 4 digits")
        } else if (!isAmex && cvv.length !== 3) {
          errors.push("CVV must be 3 digits")
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Name validation
export const validateName = (
  name: string,
  fieldName: string
): ValidationResult => {
  const errors: string[] = []

  if (!name) {
    errors.push(`${fieldName} is required`)
  } else {
    if (name.length < 2) {
      errors.push(`${fieldName} must be at least 2 characters`)
    }

    if (name.length > 50) {
      errors.push(`${fieldName} must be less than 50 characters`)
    }

    // Only allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/
    if (!nameRegex.test(name)) {
      errors.push(`${fieldName} contains invalid characters`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Cardholder name validation
export const validateCardholderName = (name: string): ValidationResult => {
  const errors: string[] = []

  if (!name) {
    errors.push("Cardholder name is required")
  } else {
    if (name.length < 2) {
      errors.push("Cardholder name must be at least 2 characters")
    }

    if (name.length > 100) {
      errors.push("Cardholder name must be less than 100 characters")
    }

    // Allow letters, spaces, hyphens, apostrophes, and periods
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'.-]+$/
    if (!nameRegex.test(name)) {
      errors.push("Cardholder name contains invalid characters")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Luhn algorithm implementation
const isValidLuhn = (cardNumber: string): boolean => {
  let sum = 0
  let isEven = false

  // Iterate from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Get card type from card number
const getCardType = (cardNumber: string): string | null => {
  const cardPatterns = {
    visa: /^4/,
    mastercard: /^5[1-5]|^2[2-7]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    dinersclub: /^3[0689]/,
    jcb: /^35/,
  }

  for (const [type, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(cardNumber)) {
      return type
    }
  }

  return null
}

// Format card number for display
export const formatCardNumber = (cardNumber: string): string => {
  const cleanCard = cardNumber.replace(/\D/g, "")
  const cardType = getCardType(cleanCard)

  if (cardType === "amex") {
    // American Express format: 1234 567890 12345
    return cleanCard.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3")
  } else {
    // Other cards format: 1234 5678 9012 3456
    return cleanCard.replace(/(\d{4})/g, "$1 ").trim()
  }
}

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, "")

  if (cleanPhone.length <= 3) {
    return cleanPhone
  } else if (cleanPhone.length <= 6) {
    return cleanPhone.replace(/(\d{3})(\d{1,3})/, "$1 $2")
  } else if (cleanPhone.length <= 9) {
    return cleanPhone.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1 $2 $3")
  } else if (cleanPhone.length === 10) {
    // Format: 123 456 7890
    return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith("1")) {
    // US with country code: +1 123 456 7890
    return cleanPhone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1 $2 $3 $4")
  }

  // For other international numbers, just add spaces every 3 digits
  if (cleanPhone.length > 10) {
    return cleanPhone.replace(/(\d{3})/g, "$1 ").trim()
  }

  return phone // Return original if can't format
}

// Comprehensive validation for booking step 1
export const validateBookingStep1 = (data: {
  firstName: string
  lastName: string
  email: string
  phone: string
}): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = []

  // Validate first name
  const firstNameResult = validateName(data.firstName, "First name")
  if (!firstNameResult.isValid) {
    errors.push(
      ...firstNameResult.errors.map((msg) => ({
        field: "firstName",
        message: msg,
      }))
    )
  }

  // Validate last name
  const lastNameResult = validateName(data.lastName, "Last name")
  if (!lastNameResult.isValid) {
    errors.push(
      ...lastNameResult.errors.map((msg) => ({
        field: "lastName",
        message: msg,
      }))
    )
  }

  // Validate email
  const emailResult = validateEmail(data.email)
  if (!emailResult.isValid) {
    errors.push(
      ...emailResult.errors.map((msg) => ({ field: "email", message: msg }))
    )
  }

  // Validate phone
  const phoneResult = validatePhone(data.phone)
  if (!phoneResult.isValid) {
    errors.push(
      ...phoneResult.errors.map((msg) => ({ field: "phone", message: msg }))
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Comprehensive validation for booking step 2 (payment details)
export const validateBookingStep2 = (data: {
  paymentMethod: string
  cardDetails?: {
    number: string
    expiry: string
    cvv: string
    name: string
  }
}): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = []

  if (data.paymentMethod === "card" && data.cardDetails) {
    // Validate card number
    const cardResult = validateCreditCard(data.cardDetails.number)
    if (!cardResult.isValid) {
      errors.push(
        ...cardResult.errors.map((msg) => ({
          field: "cardNumber",
          message: msg,
        }))
      )
    }

    // Validate expiry
    const expiryResult = validateExpiryDate(data.cardDetails.expiry)
    if (!expiryResult.isValid) {
      errors.push(
        ...expiryResult.errors.map((msg) => ({
          field: "cardExpiry",
          message: msg,
        }))
      )
    }

    // Validate CVV
    const cvvResult = validateCVV(data.cardDetails.cvv, data.cardDetails.number)
    if (!cvvResult.isValid) {
      errors.push(
        ...cvvResult.errors.map((msg) => ({ field: "cardCvv", message: msg }))
      )
    }

    // Validate cardholder name
    const nameResult = validateCardholderName(data.cardDetails.name)
    if (!nameResult.isValid) {
      errors.push(
        ...nameResult.errors.map((msg) => ({
          field: "cardholderName",
          message: msg,
        }))
      )
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
