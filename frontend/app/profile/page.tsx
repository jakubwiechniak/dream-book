"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserProfile } from "@/components/user-profile"
import { Header } from "@/components/header"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { fetchUserProfile } from "@/lib/api"
import type { UserData } from "@/lib/types"

export default function ProfilePage() {
  const { isLoading: routeLoading, isAuthorized } = useProtectedRoute()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        const userData = await fetchUserProfile()
        setUser(userData)
      } catch (error) {
        console.error("Błąd podczas ładowania profilu użytkownika:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthorized && !routeLoading) {
      loadUserProfile()
    }
  }, [isAuthorized, routeLoading])

  if (routeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Ładowanie...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container px-4 py-6 mx-auto md:px-6 md:py-12">
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Mój profil
          </h1>
          <p className="mt-2 text-muted-foreground">
            Zarządzaj swoim kontem i rezerwacjami
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg font-medium">Ładowanie...</p>
          </div>
        ) : user ? (
          <UserProfile user={user} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-lg font-medium">Nie jesteś zalogowany</p>
            <div className="flex gap-4 mt-4">
              <Button asChild>
                <Link href="/signin">Zaloguj się</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/signup">Zarejestruj się</Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-auto">
        <div className="container flex flex-col gap-6 py-8 px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Help</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Newsletter</h3>
              <form className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="max-w-[160px] sm:max-w-[200px]"
                />
                <Button type="submit" size="sm">
                  Join
                </Button>
              </form>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              © 2025 HotelBooker. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
