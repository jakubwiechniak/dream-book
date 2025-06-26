import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">About DreamBook</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="mb-4 text-muted-foreground">
            Founded in 2025, DreamBook has quickly established itself as a
            leading online platform for booking exceptional accommodations
            worldwide. Our mission is to connect travelers with unique and
            comfortable places to stay, making every journey memorable.
          </p>
          <p className="mb-4 text-muted-foreground">
            What started as a small startup in Cracow has grown into a global
            company serving millions of travelers annually. We're proud of our
            journey and remain committed to our original vision: making travel
            planning simple, enjoyable, and accessible to everyone.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="mb-4 text-muted-foreground">
            At DreamBook, we envision a world where exploring new destinations
            is seamless and stress-free. We believe that where you stay is just
            as important as where you go. That's why we're dedicated to curating
            a diverse selection of accommodations that cater to every traveler's
            needs, preferences, and budget.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              Carefully vetted properties that meet our high standards of
              quality and comfort
            </li>
            <li>Transparent pricing with no hidden fees</li>
            <li>
              24/7 customer support to assist with any questions or concerns
            </li>
            <li>
              Personalized recommendations based on your travel preferences
            </li>
            <li>Flexible booking options to accommodate changing plans</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="mb-4 text-muted-foreground">
            Behind DreamBook is a team of passionate travelers, tech
            enthusiasts, and hospitality experts. We come from diverse
            backgrounds but share a common goal: to revolutionize the way people
            experience travel. Our team works tirelessly to improve our platform
            and ensure that every user finds their perfect stay.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
