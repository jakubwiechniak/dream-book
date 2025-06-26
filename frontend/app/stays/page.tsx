import RecentStays from "@/components/recent-stays"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function StaysPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Stays</h1>
          <p className="text-muted-foreground mb-6">
            View and manage your recent and upcoming stays across properties.
          </p>
          <RecentStays />
        </div>
      </main>
      <Footer />
    </div>
  )
}
