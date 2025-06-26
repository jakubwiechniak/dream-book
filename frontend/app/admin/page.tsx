"use client"

import AdminPanel from "@/components/admin/admin-panel"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAdminRoute } from "@/hooks/use-protected-route"

export default function AdminPage() {
  const { isLoading, isAuthorized } = useAdminRoute()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Ładowanie...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // useAdminRoute already handles redirect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        <AdminPanel />
      </main>
      <Footer />
    </div>
  )
}
