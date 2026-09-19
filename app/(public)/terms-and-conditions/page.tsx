import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Playfit',
  description: 'Review the terms and conditions for using the Playfit learning platform.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Playfit" className="h-8 w-auto" />
            </Link>
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Terms & Conditions
              </h1>
              <p className="text-lg text-gray-600">
                Last updated: January 1, 2026
              </p>
            </div>

            {/* Introduction */}
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to Playfit. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  1. Acceptance of Terms
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    By creating an account, accessing, or using Playfit's learning platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy and Cookie Policy.
                  </p>
                  <p className="leading-relaxed">
                    If you do not agree to these terms, you must not use our services.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  2. Eligibility
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    To use Playfit, you must:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Be at least 13 years of age (or have parental consent if under 18)</li>
                    <li>Have the legal capacity to enter into binding contracts</li>
                    <li>Provide accurate and complete registration information</li>
                    <li>Not be prohibited from using our services under applicable law</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  3. User Accounts
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Account Creation</h3>
                  <p className="leading-relaxed">
                    You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Keeping your account information accurate and up to date</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Account Termination</h3>
                  <p className="leading-relaxed">
                    We reserve the right to suspend or terminate your account if you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violate these Terms and Conditions</li>
                    <li>Engage in fraudulent or illegal activities</li>
                    <li>Misuse our platform or services</li>
                    <li>Harm other users or the platform</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  4. Course Enrollment and Access
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Course Purchase</h3>
                  <p className="leading-relaxed">
                    When you enroll in a course:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You receive a non-exclusive, non-transferable license to access the course content</li>
                    <li>All purchases are final unless otherwise stated in our refund policy</li>
                    <li>Prices are subject to change, but existing purchases are not affected</li>
                    <li>Access may be limited by time or other conditions specified at purchase</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Content Access</h3>
                  <p className="leading-relaxed">
                    Course content is provided for your personal, non-commercial use. You may not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Share your account or course access with others</li>
                    <li>Download, reproduce, or distribute course materials without permission</li>
                    <li>Use course content for commercial purposes</li>
                    <li>Remove or modify copyright notices or watermarks</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  5. Payments and Refunds
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Payment Terms</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All prices are listed in the currency specified on the platform</li>
                    <li>Payment must be made through approved payment methods</li>
                    <li>You authorize us to charge your payment method for all purchases</li>
                    <li>Taxes and fees may apply based on your location</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Refund Policy</h3>
                  <p className="leading-relaxed">
                    We offer a 30-day money-back guarantee for most courses. Refund requests must be submitted within 30 days of purchase. Refunds may be denied if:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You have completed more than 80% of the course content</li>
                    <li>You have violated our Terms and Conditions</li>
                    <li>The course was purchased on a significant discount</li>
                    <li>The course is marked as non-refundable</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  6. User Conduct and Prohibited Activities
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    You agree not to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use the platform for any illegal or unauthorized purpose</li>
                    <li>Violate any laws in your jurisdiction</li>
                    <li>Infringe on intellectual property rights of others</li>
                    <li>Transmit viruses, malware, or harmful code</li>
                    <li>Harass, abuse, or harm other users or instructors</li>
                    <li>Impersonate any person or entity</li>
                    <li>Collect or harvest user data without consent</li>
                    <li>Attempt to gain unauthorized access to any part of the platform</li>
                    <li>Interfere with or disrupt the platform's functionality</li>
                    <li>Post spam, advertising, or promotional content without permission</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  7. Intellectual Property Rights
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Platform Content</h3>
                  <p className="leading-relaxed">
                    All content on Playfit, including but not limited to text, graphics, logos, images, videos, software, and course materials, is the property of Playfit or its content creators and is protected by copyright and intellectual property laws.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">User-Generated Content</h3>
                  <p className="leading-relaxed">
                    When you submit content to the platform (reviews, comments, discussions), you grant Playfit a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content in connection with our services.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  8. Live Classes and Interaction
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    For courses that include live classes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You must attend scheduled sessions or access recordings if available</li>
                    <li>Classes are subject to instructor availability</li>
                    <li>We are not responsible for technical issues beyond our control</li>
                    <li>Respectful behavior is required during live sessions</li>
                    <li>Recording of live classes without permission is prohibited</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  9. Disclaimers and Limitations of Liability
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Service Disclaimer</h3>
                  <p className="leading-relaxed">
                    Our services are provided "as is" without warranties of any kind, either express or implied. We do not guarantee:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Uninterrupted or error-free service</li>
                    <li>That defects will be corrected</li>
                    <li>Specific learning outcomes or results</li>
                    <li>The accuracy or completeness of course content</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Limitation of Liability</h3>
                  <p className="leading-relaxed">
                    To the maximum extent permitted by law, Playfit shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  10. Indemnification
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    You agree to indemnify and hold harmless Playfit, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your use of the platform</li>
                    <li>Your violation of these Terms and Conditions</li>
                    <li>Your violation of any rights of another party</li>
                    <li>Your content or conduct on the platform</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  11. Modifications to Terms
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the platform after changes are posted constitutes your acceptance of the modified terms.
                  </p>
                  <p className="leading-relaxed">
                    We will notify you of significant changes via email or through the platform.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  12. Governing Law and Dispute Resolution
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    These Terms and Conditions are governed by the laws of your jurisdiction. Any disputes arising from these terms or your use of the platform shall be resolved through:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Good faith negotiation between the parties</li>
                    <li>Mediation if negotiation fails</li>
                    <li>Binding arbitration or court proceedings as a last resort</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  13. Severability
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  14. Contact Information
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <ul className="list-none space-y-2 ml-4">
                    <li><strong>Email:</strong> legal@playfit.com</li>
                    <li><strong>Website:</strong> www.playfit.com</li>
                    <li><strong>Address:</strong> Playfit Learning Platform, Your City, Your Country</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
