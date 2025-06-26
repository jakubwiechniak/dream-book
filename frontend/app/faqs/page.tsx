import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function FAQsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Booking Process</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">
                How do I make a booking on DreamBook?
              </h3>
              <p className="text-muted-foreground">
                Making a booking is simple: search for your destination, select
                your check-in and check-out dates, choose the number of guests,
                and browse available properties. Once you find a place you like,
                click "Book Now" and follow the prompts to complete your
                reservation. You'll receive a confirmation email once your
                booking is confirmed.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-muted-foreground">
                Yes, we take security seriously. DreamBook uses
                industry-standard encryption to protect your personal and
                payment information. We comply with PCI DSS standards and never
                store your full credit card details on our servers.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">Can I book for someone else?</h3>
              <p className="text-muted-foreground">
                Yes, you can book accommodations for friends or family members.
                During the booking process, you'll have the option to enter the
                guest's name. Just make sure the guest knows all the booking
                details and the property's check-in procedures.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">
            Changes and Cancellations
          </h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">
                How do I change or cancel my reservation?
              </h3>
              <p className="text-muted-foreground">
                You can manage your bookings through your DreamBook account. Log
                in, go to "My Bookings," select the reservation you want to
                modify, and follow the instructions to make changes or cancel.
                Please note that each property has its own cancellation policy,
                which is displayed on the property's page and in your booking
                confirmation.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">What is your refund policy?</h3>
              <p className="text-muted-foreground">
                Refund policies vary by property. Some offer free cancellation
                up to a certain date, while others may have stricter policies.
                The specific cancellation policy for your booking is always
                displayed before you confirm your reservation and in your
                confirmation email.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">Can I modify my booking dates?</h3>
              <p className="text-muted-foreground">
                Yes, in many cases you can modify your booking dates, subject to
                availability and the property's policies. Log into your account,
                go to "My Bookings," and look for the option to modify. If you
                don't see this option or if the dates you want aren't available,
                contact our customer support team for assistance.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Payment and Pricing</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">
                When am I charged for my booking?
              </h3>
              <p className="text-muted-foreground">
                Payment timing depends on the property's policy. Some require
                full payment at the time of booking, while others may only
                require a deposit with the remaining balance due closer to your
                stay. The payment schedule is always clearly displayed before
                you confirm your reservation.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                DreamBook accepts all major credit and debit cards, including
                Visa, Mastercard, American Express, and Discover. In certain
                regions, we also accept PayPal, Apple Pay, and Google Pay. The
                available payment methods will be displayed during checkout.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">Are there any hidden fees?</h3>
              <p className="text-muted-foreground">
                No, DreamBook is committed to transparent pricing. All mandatory
                fees, such as cleaning fees or service charges, are clearly
                displayed before you confirm your booking. Local taxes may apply
                and will be shown in the price breakdown.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Account and Technical Issues
          </h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">How do I create an account?</h3>
              <p className="text-muted-foreground">
                You can create a DreamBook account by clicking "Register" in the
                top right corner of our website or app. You'll need to provide
                your email address, create a password, and enter some basic
                information. You can also register using your Google, Facebook,
                or Apple account for faster sign-up.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">
                I forgot my password. How do I reset it?
              </h3>
              <p className="text-muted-foreground">
                Click on "Sign In" in the top right corner, then select "Forgot
                password?" Enter the email address associated with your account,
                and we'll send you a link to reset your password. If you don't
                receive the email, check your spam folder or contact customer
                support.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">
                The website/app isn't working properly. What should I do?
              </h3>
              <p className="text-muted-foreground">
                First, try refreshing the page or restarting the app. If that
                doesn't work, clear your browser cache or try using a different
                browser. Make sure your app is updated to the latest version. If
                you're still experiencing issues, contact our technical support
                team at tech.support@dreambook.com with details about the
                problem and screenshots if possible.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 p-6 bg-muted rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">
            Can't find what you're looking for?
          </h2>
          <p className="mb-4 text-muted-foreground">
            Our support team is ready to answer any other questions you might
            have.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/support" className="text-primary hover:underline">
              Contact Support
            </a>
            <span className="text-muted-foreground">|</span>
            <a
              href="mailto:help@dreambook.com"
              className="text-primary hover:underline"
            >
              Email Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
