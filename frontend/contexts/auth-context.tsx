"use client"

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import {
  User,
  getStoredUser,
  getAccessToken,
  getRefreshToken,
  getCurrentUser,
  clearTokens,
  refreshAccessToken,
  setTokens,
  setUser,
  isTokenExpired,
} from "@/lib/auth"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGOUT" }

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  updateUser: (user: User) => void
  syncUserFromBackend: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const router = useRouter()

  // Check for stored user and token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: "SET_LOADING", payload: true })

      try {
        const storedUser = getStoredUser()
        const accessToken = getAccessToken()

        if (!storedUser || !accessToken) {
          dispatch({ type: "SET_LOADING", payload: false })
          return
        }

        // Check if token is expired
        if (isTokenExpired(accessToken)) {
          try {
            // Try to refresh the token
            const { access_token } = await refreshAccessToken()
            setTokens(access_token, getRefreshToken() || "")

            // Get updated user info
            const currentUser = await getCurrentUser()
            dispatch({ type: "SET_USER", payload: currentUser })
            setUser(currentUser)
          } catch (error) {
            console.error("Token refresh failed:", error)
            clearTokens()
            dispatch({ type: "LOGOUT" })
          }
        } else {
          try {
            const currentUser = await getCurrentUser()
            dispatch({ type: "SET_USER", payload: currentUser })
          } catch (error) {
            console.error("User verification failed:", error)
            clearTokens()
            dispatch({ type: "LOGOUT" })
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to initialize authentication",
        })
      }
    }

    initializeAuth()
  }, [])

  const login = (user: User, accessToken: string, refreshToken: string) => {
    setTokens(accessToken, refreshToken)
    setUser(user)
    dispatch({ type: "SET_USER", payload: user })
  }

  const logout = async () => {
    try {
      const { logout: logoutAPI } = await import("@/lib/auth")
      await logoutAPI()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearTokens()
      dispatch({ type: "LOGOUT" })
      // Przekieruj na stronę główną po wylogowaniu
      router.push("/")
    }
  }

  const refreshAuth = async () => {
    try {
      const { access_token } = await refreshAccessToken()
      const currentUser = await getCurrentUser()
      setTokens(access_token, getRefreshToken() || "")
      setUser(currentUser)
      dispatch({ type: "SET_USER", payload: currentUser })
    } catch (error) {
      console.error("Auth refresh failed:", error)
      await logout()
    }
  }

  const updateUser = (user: User) => {
    setUser(user)
    dispatch({ type: "SET_USER", payload: user })
  }

  const syncUserFromBackend = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      dispatch({ type: "SET_USER", payload: currentUser })
    } catch (error) {
      console.error("Failed to sync user from backend:", error)
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshAuth,
    updateUser,
    syncUserFromBackend,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// HOC for protecting routes
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Ładowanie...</div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Dostęp zabroniony</h1>
          <p className="text-gray-600 mb-4">
            Musisz być zalogowany, aby zobaczyć tę stronę.
          </p>
          <a href="/signin" className="text-blue-600 hover:underline">
            Przejdź do logowania
          </a>
        </div>
      )
    }

    return <Component {...props} />
  }
}
