import Link from "next/link"
import { Plane } from "lucide-react"

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-lg mb-6">Last Updated: May 13, 2023</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to SkyTracker. These Terms of Service ("Terms") govern your use of our website and services. By
              accessing or using SkyTracker, you agree to be bound by these Terms. If you disagree with any part of the
              terms, you may not access the service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Service</h2>
            <p>
              SkyTracker provides a flight tracking service that allows users to search for and view information about
              commercial flights. Our service is intended for informational purposes only and should not be relied upon
              for critical travel decisions.
            </p>
            <p>
              You agree to use the service only for lawful purposes and in a way that does not infringe the rights of,
              restrict, or inhibit anyone else's use and enjoyment of the service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Accuracy</h2>
            <p>
              While we strive to provide accurate and up-to-date flight information, we rely on third-party data
              providers such as AviationStack. We cannot guarantee the accuracy, completeness, or timeliness of the
              information provided. Flight information may be delayed, inaccurate, or unavailable at times.
            </p>
            <p>
              You acknowledge that you use the flight information at your own risk and should always verify critical
              flight details with the airline or airport directly.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive
              property of SkyTracker and its licensors. The service is protected by copyright, trademark, and other laws
              of both the United States and foreign countries.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without the prior
              written consent of SkyTracker.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall SkyTracker, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Your access to or use of or inability to access or use the service;</li>
              <li>Any conduct or content of any third party on the service;</li>
              <li>Any content obtained from the service; and</li>
              <li>Unauthorized access, use or alteration of your transmissions or content.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Disclaimer</h2>
            <p>
              Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE"
              basis. The service is provided without warranties of any kind, whether express or implied, including, but
              not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement
              or course of performance.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the United States, without
              regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
              rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
              provisions of these Terms will remain in effect.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material we will try to provide at least 30 days notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our service after those revisions become effective, you agree to be bound
              by the revised terms. If you do not agree to the new terms, please stop using the service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
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
