export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using our eCommerce SEO optimization service, you accept and agree to be bound by the
                terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service provides AI-powered SEO optimization for eCommerce product listings across various platforms
                including Amazon, Flipkart, and Meesho.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate product information</li>
                <li>Use the service in compliance with platform policies</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not misuse or abuse the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Subscription fees are billed monthly or annually as selected. All fees are non-refundable except as
                required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                Either party may terminate this agreement at any time. Upon termination, your access to the service will
                be discontinued.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at legal@ecommerceseo.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
