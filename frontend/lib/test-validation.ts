// Test file for validation functions
import {
  validateEmail,
  validatePhone,
  validateCreditCard,
  validateExpiryDate,
  validateCVV,
  validateName,
  formatCardNumber,
  formatPhoneNumber,
  validateBookingStep1,
  validateBookingStep2,
} from "./validation"

// Test email validation
console.log("=== Email Validation Tests ===")
console.log("Valid email:", validateEmail("user@example.com"))
console.log("Invalid email:", validateEmail("invalid-email"))
console.log("Empty email:", validateEmail(""))

// Test phone validation
console.log("\n=== Phone Validation Tests ===")
console.log("Valid US phone:", validatePhone("(555) 123-4567"))
console.log("Valid international:", validatePhone("+48 123 456 789"))
console.log("Invalid phone:", validatePhone("123"))
console.log("Empty phone:", validatePhone(""))

// Test credit card validation
console.log("\n=== Credit Card Validation Tests ===")
console.log("Valid Visa:", validateCreditCard("4111111111111111"))
console.log("Valid Mastercard:", validateCreditCard("5555555555554444"))
console.log("Invalid card:", validateCreditCard("1234567890123456"))
console.log("Empty card:", validateCreditCard(""))

// Test expiry validation
console.log("\n=== Expiry Date Validation Tests ===")
const futureDate = new Date()
futureDate.setFullYear(futureDate.getFullYear() + 2)
const futureYear = futureDate.getFullYear().toString().slice(-2)
const futureMonth = String(futureDate.getMonth() + 1).padStart(2, "0")

console.log(
  "Valid future date:",
  validateExpiryDate(`${futureMonth}/${futureYear}`)
)
console.log("Past date:", validateExpiryDate("01/20"))
console.log("Invalid format:", validateExpiryDate("1/2025"))
console.log("Empty expiry:", validateExpiryDate(""))

// Test CVV validation
console.log("\n=== CVV Validation Tests ===")
console.log("Valid 3-digit CVV:", validateCVV("123"))
console.log("Valid 4-digit CVV (Amex):", validateCVV("1234", "378282246310005"))
console.log("Invalid CVV:", validateCVV("12"))
console.log("Empty CVV:", validateCVV(""))

// Test name validation
console.log("\n=== Name Validation Tests ===")
console.log("Valid first name:", validateName("John", "First name"))
console.log("Valid last name:", validateName("Doe-Smith", "Last name"))
console.log("Too short name:", validateName("A", "First name"))
console.log("Invalid characters:", validateName("John123", "First name"))

// Test formatting
console.log("\n=== Formatting Tests ===")
console.log("Format Visa card:", formatCardNumber("4111111111111111"))
console.log("Format Amex card:", formatCardNumber("378282246310005"))
console.log("Format US phone:", formatPhoneNumber("5551234567"))
console.log("Format international phone:", formatPhoneNumber("15551234567"))

// Test comprehensive validation
console.log("\n=== Comprehensive Validation Tests ===")

const validStep1Data = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "(555) 123-4567",
}

const invalidStep1Data = {
  firstName: "",
  lastName: "D",
  email: "invalid-email",
  phone: "123",
}

console.log("Valid step 1 data:", validateBookingStep1(validStep1Data))
console.log("Invalid step 1 data:", validateBookingStep1(invalidStep1Data))

const validStep2Data = {
  paymentMethod: "card" as const,
  cardDetails: {
    number: "4111111111111111",
    expiry: `${futureMonth}/${futureYear}`,
    cvv: "123",
    name: "John Doe",
  },
}

const invalidStep2Data = {
  paymentMethod: "card" as const,
  cardDetails: {
    number: "1234567890123456",
    expiry: "01/20",
    cvv: "12",
    name: "",
  },
}

console.log("Valid step 2 data:", validateBookingStep2(validStep2Data))
console.log("Invalid step 2 data:", validateBookingStep2(invalidStep2Data))

export {}
