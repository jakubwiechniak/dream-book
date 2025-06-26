import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <div className="grid gap-10 md:grid-cols-2">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Full Name
                </label>
                <Input id="name" placeholder="Your full name" />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number (Optional)
                </label>
                <Input id="phone" type="tel" placeholder="Your phone number" />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1"
                >
                  Subject
                </label>
                <Input id="subject" placeholder="What is this regarding?" />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Customer Support</h3>
                  <p className="text-muted-foreground mb-1">
                    Email:{" "}
                    <a
                      href="mailto:support@dreambook.com"
                      className="text-primary hover:underline"
                    >
                      support@dreambook.com
                    </a>
                  </p>
                  <p className="text-muted-foreground mb-1">
                    Phone: +1 (800) 555-0100
                  </p>
                  <p className="text-muted-foreground">Hours: 24/7</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Business Inquiries</h3>
                  <p className="text-muted-foreground mb-1">
                    Email:{" "}
                    <a
                      href="mailto:business@dreambook.com"
                      className="text-primary hover:underline"
                    >
                      business@dreambook.com
                    </a>
                  </p>
                  <p className="text-muted-foreground mb-1">
                    Phone: +1 (415) 555-0200
                  </p>
                  <p className="text-muted-foreground">
                    Hours: Monday-Friday, 9 AM - 5 PM PT
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Property Owners</h3>
                  <p className="text-muted-foreground mb-1">
                    Email:{" "}
                    <a
                      href="mailto:partners@dreambook.com"
                      className="text-primary hover:underline"
                    >
                      partners@dreambook.com
                    </a>
                  </p>
                  <p className="text-muted-foreground mb-1">
                    Phone: +1 (415) 555-0300
                  </p>
                  <p className="text-muted-foreground">
                    Hours: Monday-Friday, 9 AM - 6 PM PT
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4">Headquarters</h3>
              <address className="not-italic text-muted-foreground">
                <p>DreamBook, Inc.</p>
                <p>123 Market Street, Suite 1500</p>
                <p>San Francisco, CA 94105</p>
                <p>United States</p>
              </address>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-bold mb-2">Connect With Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  Facebook
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  Twitter
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  Instagram
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
