import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Careers at DreamBook</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
          <p className="mb-4 text-muted-foreground">
            At DreamBook, we're building the future of travel booking. We're
            looking for passionate, creative individuals who are excited about
            transforming the hospitality industry. Join us in our mission to
            connect travelers with exceptional accommodations worldwide.
          </p>
          <p className="mb-6 text-muted-foreground">
            Working at DreamBook means being part of a diverse, innovative team
            where your ideas matter and your growth is prioritized. We offer
            competitive benefits, flexible work arrangements, and a culture that
            celebrates both professional and personal achievements.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Open Positions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">
                  Senior Frontend Developer
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  San Francisco, CA (Remote Available)
                </p>
                <p className="text-muted-foreground mb-4">
                  Build beautiful, responsive user interfaces using React and
                  Next.js. Shape the future of our customer-facing applications.
                </p>
                <Button>Apply Now</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Backend Engineer</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  San Francisco, CA (Remote Available)
                </p>
                <p className="text-muted-foreground mb-4">
                  Design and implement scalable APIs and services. Work with
                  modern technologies like Node.js, TypeScript, and MongoDB.
                </p>
                <Button>Apply Now</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">UX/UI Designer</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  San Francisco, CA (Remote Available)
                </p>
                <p className="text-muted-foreground mb-4">
                  Create intuitive, engaging user experiences. Collaborate with
                  product and engineering teams to bring designs to life.
                </p>
                <Button>Apply Now</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Product Manager</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  San Francisco, CA (Remote Available)
                </p>
                <p className="text-muted-foreground mb-4">
                  Drive product strategy and execution. Work closely with
                  engineering, design, and business teams to deliver impactful
                  features.
                </p>
                <Button>Apply Now</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <span className="font-medium">Innovation:</span> We're not afraid
              to challenge the status quo and explore new ideas.
            </li>
            <li>
              <span className="font-medium">Collaboration:</span> We believe the
              best solutions come from diverse perspectives working together.
            </li>
            <li>
              <span className="font-medium">Excellence:</span> We hold ourselves
              to high standards in everything we do.
            </li>
            <li>
              <span className="font-medium">Inclusivity:</span> We create an
              environment where everyone feels welcome and valued.
            </li>
            <li>
              <span className="font-medium">Customer Focus:</span> We put our
              users at the center of every decision we make.
            </li>
          </ul>
          <p className="mt-6 text-muted-foreground">
            Don't see a position that matches your skills? We're always looking
            for exceptional talent. Send your resume to{" "}
            <a
              href="mailto:careers@dreambook.com"
              className="text-primary hover:underline"
            >
              careers@dreambook.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
