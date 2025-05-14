import Link from "next/link"
import { Plane } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="h-6 w-6" />
              <span className="text-xl font-bold">SkyTracker</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="/privacy-policy" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm font-medium hover:underline underline-offset-4">
              Terms of Service
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12 container px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-lg mb-6">Last Updated: May 13, 2023</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to SkyTracker ("we," "our," or "us"). We respect your privacy and are committed to protecting your
              personal data. This privacy policy will inform you about how we look after your personal data when you
              visit our website and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped
              together as follows:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>
                <strong>Usage Data:</strong> Information about how you use our website and services.
              </li>
              <li>
                <strong>Flight Search Data:</strong> Information about flight searches you perform, including flight
                numbers, dates, and times.
              </li>
              <li>
                <strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone
                setting and location, browser plug-in types and versions, operating system and platform, and other
                technology on the devices you use to access this website.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal
              data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>To provide and maintain our service, including to monitor the usage of our service.</li>
              <li>To manage your requests: To attend and manage your requests to us.</li>
              <li>To improve our website, products/services, marketing, or customer relationships.</li>
              <li>To remember your recent flight searches for your convenience.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our service and store certain
              information. Cookies are files with a small amount of data which may include an anonymous unique
              identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
              if you do not accept cookies, you may not be able to use some portions of our service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from being accidentally
              lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to
              your personal data to those employees, agents, contractors, and other third parties who have a business
              need to know.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Services</h2>
            <p>
              We use third-party services, such as AviationStack, to provide flight data. These third parties may
              collect, store, and process your data according to their privacy policies. We recommend reviewing the
              privacy policies of these third parties.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data,
              including the right to:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, you can contact us:</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>By visiting the developer links in the footer of our website</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-100">
        <div className="container px-4 md:px-6 text-center">
          <p className="text-sm text-gray-500">© 2023 SkyTracker. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-500 hover:text-gray-900">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
