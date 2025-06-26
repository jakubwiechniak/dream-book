"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"

export default function UnauthorizedPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-md text-center space-y-6 p-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-red-600">403</h1>
            <h2 className="text-2xl font-semibold text-gray-900">
              Dostęp zabroniony
            </h2>
            <p className="text-gray-600">
              Nie masz uprawnień do przeglądania tej strony.
            </p>
          </div>

          {user && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Jesteś zalogowany jako: <strong>{user.email}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Rola: <strong>{user.role}</strong>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">Powrót do strony głównej</Link>
            </Button>

            {user?.role === "guest" && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Skontaktuj się z nami</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
