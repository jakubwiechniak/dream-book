import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: May 1, 2025</p>

        <section className="prose prose-slate max-w-none">
          <p>
            At DreamBook, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our website or use our services. Please
            read this policy carefully to understand our practices regarding
            your personal data.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            1. Information We Collect
          </h2>
          <p>
            We collect information that you provide directly to us, information
            we collect automatically when you use our services, and information
            from third-party sources.
          </p>
          <h3 className="font-medium mt-4 mb-2">
            1.1. Information You Provide
          </h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Account Information: When you register for an account, we collect
              your name, email address, phone number, and password.
            </li>
            <li>
              Profile Information: You may choose to provide additional
              information such as your profile picture, preferred language, and
              time zone.
            </li>
            <li>
              Booking Information: When you book accommodations, we collect
              payment information, guest details, and communication with hosts.
            </li>
            <li>
              Host Information: If you list your property, we collect property
              details, availability, pricing, photos, and other listing
              information.
            </li>
            <li>
              Communications: When you contact our customer support team, we
              collect the content of your messages and our responses.
            </li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">
            1.2. Information Collected Automatically
          </h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Usage Information: We collect information about how you use our
              services, including your search queries, pages viewed, and
              features used.
            </li>
            <li>
              Device Information: We collect information about the device you
              use to access our services, including the hardware model,
              operating system, IP address, and unique device identifiers.
            </li>
            <li>
              Location Information: With your consent, we may collect precise
              location information from your device.
            </li>
            <li>
              Cookies and Similar Technologies: We use cookies and similar
              technologies to collect information about your browsing behavior
              and preferences.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Providing and improving our services</li>
            <li>Processing your bookings and payments</li>
            <li>
              Communicating with you about your bookings, account, and our
              services
            </li>
            <li>
              Personalizing your experience and showing you relevant content and
              listings
            </li>
            <li>
              Analyzing usage patterns to improve our website and services
            </li>
            <li>
              Detecting and preventing fraud, spam, abuse, security incidents,
              and other harmful activities
            </li>
            <li>Complying with legal obligations and enforcing our terms</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            3. Sharing Your Information
          </h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Hosts and Guests: When you book accommodations or list your
              property, we share information necessary to facilitate the booking
              and stay.
            </li>
            <li>
              Service Providers: We work with third-party service providers who
              perform services on our behalf, such as payment processing,
              customer support, and data analysis.
            </li>
            <li>
              Business Transfers: If DreamBook is involved in a merger,
              acquisition, or sale of all or a portion of its assets, your
              information may be transferred as part of that transaction.
            </li>
            <li>
              Legal Requirements: We may disclose your information if required
              by law, legal process, or government request.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            4. Your Rights and Choices
          </h2>
          <p>
            Depending on your location, you may have certain rights regarding
            your personal data, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Access: You can access and update your account information through
              your DreamBook account settings.
            </li>
            <li>
              Deletion: You can request deletion of your account and personal
              data by contacting us.
            </li>
            <li>
              Data Portability: You can request a copy of your data in a
              structured, commonly used, and machine-readable format.
            </li>
            <li>
              Objection: You can object to our processing of your data in
              certain circumstances.
            </li>
            <li>
              Cookies: You can manage your cookie preferences through your
              browser settings.
            </li>
            <li>
              Marketing Communications: You can opt out of marketing
              communications by following the unsubscribe instructions in our
              emails.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, disclosure,
            alteration, and destruction. However, no method of transmission over
            the Internet or electronic storage is 100% secure, so we cannot
            guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            6. International Data Transfers
          </h2>
          <p>
            DreamBook operates globally, which means your information may be
            transferred to, stored, and processed in countries other than your
            country of residence. We take appropriate safeguards to ensure that
            your personal data remains protected in accordance with this Privacy
            Policy.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            7. Children's Privacy
          </h2>
          <p>
            DreamBook's services are not directed to children under the age of
            18. We do not knowingly collect personal information from children
            under 18. If you believe we have collected information from a child
            under 18, please contact us.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            8. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. If we make
            material changes, we will notify you through our website or by
            email. Your continued use of our services after such notice
            constitutes your acceptance of the revised Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <p>
            <a
              href="mailto:privacy@dreambook.com"
              className="text-primary hover:underline"
            >
              privacy@dreambook.com
            </a>
            <br />
            DreamBook, Inc.
            <br />
            123 Market Street, Suite 1500
            <br />
            San Francisco, CA 94105
            <br />
            United States
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
