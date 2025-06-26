import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: May 1, 2025</p>

        <section className="prose prose-slate max-w-none">
          <p>
            This Cookie Policy explains how DreamBook ("we", "us", or "our")
            uses cookies and similar technologies on our website and mobile
            applications. It explains what these technologies are and why we use
            them, as well as your rights to control our use of them.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are small text files that are placed on your computer or
            mobile device when you visit a website. They are widely used to make
            websites work more efficiently and provide information to the
            website owners. Cookies can be "persistent" or "session" cookies.
            Persistent cookies remain on your device after you close your
            browser until they expire or you delete them. Session cookies are
            deleted when you close your browser.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            2. Types of Cookies We Use
          </h2>
          <p>We use different types of cookies for various purposes:</p>

          <h3 className="font-medium mt-4 mb-2">2.1. Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly.
            They enable basic functions like page navigation, access to secure
            areas, and security features. The website cannot function properly
            without these cookies.
          </p>

          <h3 className="font-medium mt-4 mb-2">2.2. Performance Cookies</h3>
          <p>
            These cookies collect information about how you use our website,
            such as which pages you visit most often and if you receive error
            messages. They help us improve how our website works and understand
            what interests our users. All information collected by these cookies
            is aggregated and anonymized.
          </p>

          <h3 className="font-medium mt-4 mb-2">2.3. Functionality Cookies</h3>
          <p>
            These cookies allow the website to remember choices you make (such
            as your language preference or the region you are in) and provide
            enhanced, personalized features. They may also be used to provide
            services you have requested, such as watching a video or commenting
            on a blog.
          </p>

          <h3 className="font-medium mt-4 mb-2">
            2.4. Targeting/Advertising Cookies
          </h3>
          <p>
            These cookies are used to deliver advertisements that are more
            relevant to you and your interests. They are also used to limit the
            number of times you see an advertisement and to help measure the
            effectiveness of advertising campaigns. They remember that you have
            visited a website and this information may be shared with other
            organizations, such as advertisers.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            3. Third-Party Cookies
          </h2>
          <p>
            In addition to our own cookies, we may also use various third-party
            cookies to report usage statistics, deliver advertisements, and so
            on. These cookies may include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Analytics cookies from services like Google Analytics to help us
              understand how visitors interact with our website
            </li>
            <li>
              Advertising cookies from partners like Google, Facebook, and
              others to help us deliver relevant ads
            </li>
            <li>
              Social media cookies that allow you to share content on platforms
              like Facebook, Twitter, and Instagram
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            4. How to Manage Cookies
          </h2>
          <p>
            You can control and manage cookies in various ways. Please keep in
            mind that removing or blocking cookies can impact your user
            experience and parts of our website may no longer be fully
            accessible.
          </p>

          <h3 className="font-medium mt-4 mb-2">4.1. Browser Controls</h3>
          <p>
            Most browsers allow you to view, manage, delete, and block cookies.
            To do this, follow the instructions provided by your browser
            (usually located within the "Help", "Tools", or "Edit" settings).
          </p>

          <h3 className="font-medium mt-4 mb-2">4.2. Cookie Preference Tool</h3>
          <p>
            You can manage your cookie preferences on our website by using our
            cookie preference tool:
          </p>
          <div className="mt-4 mb-6">
            <Button>Manage Cookie Preferences</Button>
          </div>

          <h3 className="font-medium mt-4 mb-2">4.3. Do Not Track</h3>
          <p>
            Some browsers have a "Do Not Track" feature that signals to websites
            that you visit that you do not want to have your online activity
            tracked. These features are not yet uniform, so we currently do not
            respond to such signals.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            5. Specific Cookies We Use
          </h2>
          <p>
            The following table provides more information about the specific
            cookies we use and their purposes:
          </p>

          <div className="overflow-x-auto mt-4 mb-6">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Cookie Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Purpose
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    session_id
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Essential
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Maintains your session across page requests
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    auth_token
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Essential
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Authenticates logged-in users
                  </td>
                  <td className="border border-gray-300 px-4 py-2">30 days</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    language_preference
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Functionality
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Remembers your language preference
                  </td>
                  <td className="border border-gray-300 px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    currency_preference
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Functionality
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Remembers your currency preference
                  </td>
                  <td className="border border-gray-300 px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_ga</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Performance
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Google Analytics - Used to distinguish users
                  </td>
                  <td className="border border-gray-300 px-4 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_fbp</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Advertising
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Facebook Pixel - Used to deliver advertisements
                  </td>
                  <td className="border border-gray-300 px-4 py-2">90 days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            6. Changes to This Cookie Policy
          </h2>
          <p>
            We may update this Cookie Policy from time to time to reflect
            changes in technology, regulation, or our business practices. Any
            changes will become effective when we post the revised policy on our
            website. We encourage you to periodically review this page to stay
            informed about our use of cookies.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie
            Policy, please contact us at:
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
