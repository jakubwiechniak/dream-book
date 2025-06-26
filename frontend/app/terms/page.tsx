import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: May 1, 2025</p>

        <section className="prose prose-slate max-w-none">
          <p>
            Welcome to DreamBook. Please read these Terms of Service ("Terms")
            carefully as they contain important information about your legal
            rights, remedies, and obligations. By accessing or using the
            DreamBook platform, you agree to comply with and be bound by these
            Terms.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            1. The DreamBook Platform
          </h2>
          <p>
            1.1. DreamBook provides an online platform that connects users
            seeking accommodations ("Guests") with accommodation providers
            ("Hosts") and facilitates the booking of such accommodations
            ("Listings").
          </p>
          <p>
            1.2. As a Guest, you can search for, view, and book Listings. As a
            Host, you can create, manage, and make available your property for
            booking by Guests.
          </p>
          <p>
            1.3. DreamBook is not a party to any agreement between Guests and
            Hosts. DreamBook is not acting as an agent in any capacity for any
            Member, except as specified in the Payments Terms.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            2. Account Registration
          </h2>
          <p>
            2.1. You must register an account to access and use certain features
            of the DreamBook platform. Account registration requires you to
            provide accurate and complete information, including your name,
            email address, phone number, and payment information.
          </p>
          <p>
            2.2. You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You must immediately notify DreamBook of any unauthorized
            use of your account.
          </p>
          <p>
            2.3. DreamBook reserves the right to suspend or terminate your
            account if any information provided during registration or
            thereafter proves to be inaccurate, false, or outdated.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            3. Booking and Cancellations
          </h2>
          <p>
            3.1. When you book a Listing, you agree to pay all applicable fees,
            including the Listing price, service fees, and any additional fees
            specified in the Listing.
          </p>
          <p>
            3.2. Cancellation policies vary by Listing and are determined by the
            Host. The applicable cancellation policy will be displayed on the
            Listing page before you confirm your booking.
          </p>
          <p>
            3.3. DreamBook reserves the right to cancel a booking in exceptional
            circumstances, including but not limited to, suspected fraudulent
            activity, safety concerns, or violation of these Terms.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Content Policy</h2>
          <p>
            4.1. You may post content, including photos, reviews, and messages,
            on the DreamBook platform. You retain ownership of your content, but
            grant DreamBook a worldwide, non-exclusive, royalty-free license to
            use, reproduce, modify, adapt, publish, translate, and distribute
            such content.
          </p>
          <p>
            4.2. You agree not to post content that is illegal, fraudulent,
            misleading, defamatory, obscene, or otherwise objectionable.
            DreamBook reserves the right to remove any content that violates
            these Terms or is otherwise harmful to the DreamBook community.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Privacy</h2>
          <p>
            5.1. DreamBook collects and processes personal information in
            accordance with its Privacy Policy, which is incorporated into these
            Terms by reference.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            6. Limitation of Liability
          </h2>
          <p>
            6.1. To the maximum extent permitted by law, DreamBook shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, or any loss of data, use, goodwill,
            or other intangible losses.
          </p>
          <p>
            6.2. DreamBook's total liability arising out of or relating to these
            Terms or your use of the DreamBook platform shall not exceed the
            greater of the amount you have paid to DreamBook in the past twelve
            months or one hundred dollars ($100).
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            7. Modifications to the Terms
          </h2>
          <p>
            7.1. DreamBook reserves the right to modify these Terms at any time.
            If we make material changes to these Terms, we will provide notice
            through the DreamBook platform or by other means.
          </p>
          <p>
            7.2. Your continued use of the DreamBook platform after the
            effective date of the revised Terms constitutes your acceptance of
            the revised Terms.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            8. Governing Law and Dispute Resolution
          </h2>
          <p>
            8.1. These Terms shall be governed by and construed in accordance
            with the laws of the State of California, without regard to its
            conflict of law provisions.
          </p>
          <p>
            8.2. Any dispute arising out of or relating to these Terms or your
            use of the DreamBook platform shall be resolved by binding
            arbitration in accordance with the Commercial Arbitration Rules of
            the American Arbitration Association.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            9. Contact Information
          </h2>
          <p>
            9.1. If you have any questions about these Terms, please contact us
            at{" "}
            <a
              href="mailto:legal@dreambook.com"
              className="text-primary hover:underline"
            >
              legal@dreambook.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
