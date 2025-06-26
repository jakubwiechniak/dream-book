import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Customer Support</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How Can We Help You?</h2>
          <p className="mb-6 text-muted-foreground">
            Our dedicated support team is here to assist you with any questions
            or issues you may encounter. We're committed to providing prompt,
            helpful service to ensure your experience with DreamBook is
            exceptional.
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-10">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Contact Support</h3>
                <p className="text-muted-foreground mb-4">
                  Email us at{" "}
                  <a
                    href="mailto:support@dreambook.com"
                    className="text-primary hover:underline"
                  >
                    support@dreambook.com
                  </a>
                </p>
                <p className="text-muted-foreground mb-4">
                  Call us at +1 (800) 555-0100 (24/7)
                </p>
                <p className="text-muted-foreground">
                  Chat with us using the chat bubble in the bottom right corner
                  of any page on our website.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Support Hours</h3>
                <p className="text-muted-foreground mb-2">
                  Email & Chat Support: 24/7
                </p>
                <p className="text-muted-foreground mb-2">Phone Support:</p>
                <ul className="text-muted-foreground mb-2 pl-5 list-disc">
                  <li>Monday-Friday: 24 hours</li>
                  <li>Saturday-Sunday: 8 AM - 8 PM ET</li>
                </ul>
                <p className="text-muted-foreground">
                  Average response time: Under 5 minutes
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Common Issues</h2>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">
                I need to change or cancel my booking
              </h3>
              <p className="text-sm text-muted-foreground">
                You can manage your bookings by logging into your account and
                navigating to "My Bookings." From there, you can make changes or
                cancellations according to the property's policies.
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">
                I haven't received my booking confirmation
              </h3>
              <p className="text-sm text-muted-foreground">
                Confirmations are typically sent within minutes of booking.
                Check your spam folder, or log into your account to view your
                booking details. You can also request a new confirmation email
                from your account page.
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">
                The property doesn't match the description
              </h3>
              <p className="text-sm text-muted-foreground">
                If you arrive at a property and find significant discrepancies
                from its listing, contact our support team immediately. We'll
                work with you and the property owner to resolve the issue.
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">
                I need to update my payment information
              </h3>
              <p className="text-sm text-muted-foreground">
                You can update your payment methods in the "Payment Methods"
                section of your account settings. For assistance with a specific
                booking, please contact our support team.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Contact Form</h2>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your email" />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-1"
              >
                Subject
              </label>
              <Input id="subject" placeholder="Subject of your inquiry" />
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

            <Button type="submit" className="w-full md:w-auto">
              Send Message
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  )
}
