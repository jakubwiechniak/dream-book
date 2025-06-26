// Environment configuration for Flask backend integration

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),
}

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_STORAGE_KEY: "access_token",
  REFRESH_TOKEN_STORAGE_KEY: "refresh_token",
  USER_STORAGE_KEY: "user",
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes in milliseconds
}

// App Configuration
export const APP_CONFIG = {
  NAME: "DreamBook",
  DESCRIPTION: "Find Your Perfect Stay",
  DEFAULT_LANGUAGE: "en",
  DEFAULT_CURRENCY: "USD",
  PAGINATION_LIMIT: 20,
}

// Feature Flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === "true",
  ENABLE_REAL_TIME: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME === "true",
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_PAYMENTS: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === "true",
}

// External Services
export const SERVICES = {
  STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
}

// Routes Configuration
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  HOTELS: "/hotels",
  BOOKINGS: "/bookings",
  ADMIN: "/admin",
  FAVORITES: "/favorites",
}

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    UPLOAD_AVATAR: "/users/avatar",
    CHANGE_PASSWORD: "/users/change-password",
  },
  HOTELS: {
    LIST: "/hotels",
    DETAIL: "/hotels/:id",
    SEARCH: "/hotels/search",
    CREATE: "/hotels",
    UPDATE: "/hotels/:id",
    DELETE: "/hotels/:id",
    UPLOAD_IMAGES: "/hotels/:id/images",
  },
  BOOKINGS: {
    LIST: "/bookings",
    DETAIL: "/bookings/:id",
    CREATE: "/bookings",
    UPDATE: "/bookings/:id",
    CANCEL: "/bookings/:id/cancel",
    CONFIRM: "/bookings/:id/confirm",
  },
  REVIEWS: {
    LIST: "/reviews",
    DETAIL: "/reviews/:id",
    CREATE: "/reviews",
    UPDATE: "/reviews/:id",
    DELETE: "/reviews/:id",
    BY_HOTEL: "/hotels/:id/reviews",
  },
  ADMIN: {
    USERS: "/admin/users",
    USER_DETAIL: "/admin/users/:id",
    UPDATE_USER: "/admin/users/:id",
    UPDATE_USER_ROLE: "/admin/users/:id",
    ACTIVATE_USER: "/admin/users/:id/activate",
    DEACTIVATE_USER: "/admin/users/:id/deactivate",
    ANALYTICS: "/admin/analytics",
    PROPERTIES: "/admin/properties",
  },
  PAYMENTS: {
    CREATE_INTENT: "/payments/create-intent",
    CONFIRM_PAYMENT: "/payments/confirm",
    PAYMENT_METHODS: "/payments/methods",
    ADD_PAYMENT_METHOD: "/payments/methods",
    DELETE_PAYMENT_METHOD: "/payments/methods/:id",
  },
}

const config = {
  API_CONFIG,
  AUTH_CONFIG,
  APP_CONFIG,
  FEATURES,
  SERVICES,
  ROUTES,
  ENDPOINTS,
}

export default config
