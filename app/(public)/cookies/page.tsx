'use client';

import Link from 'next/link';
import { ArrowLeft, Cookie, Settings, BarChart, Target, Shield } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <img src="/logo.jpg" alt="PlayFit" className="h-10" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Cookie className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl text-orange-100 mb-6">
            Learn about how we use cookies and similar technologies
          </p>
          <p className="text-sm text-orange-200">
            Last Updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-orange-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="#what-are-cookies" className="text-orange-600 hover:text-orange-800 text-sm font-medium hover:underline">
              → What Are Cookies?
            </a>
            <a href="#how-we-use" className="text-orange-600 hover:text-orange-800 text-sm font-medium hover:underline">
              → How We Use Cookies
            </a>
            <a href="#types" className="text-orange-600 hover:text-orange-800 text-sm font-medium hover:underline">
              → Types of Cookies
            </a>
            <a href="#third-party" className="text-orange-600 hover:text-orange-800 text-sm font-medium hover:underline">
              → Third-Party Cookies
            </a>
            <a href="#manage" className="text-orange-600 hover:text-orange-800 text-sm font-medium hover:underline">
              → Manage Cookies
            </a>
            <a href="#contact" className="text-orange-600 hover:text-orange-800 text-sm font-medium hover:underline">
              → Contact Us
            </a>
          </div>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This Cookie Policy explains how PlayFit Classes ("we," "our," or "us") uses cookies and similar tracking technologies when you visit our website or use our services. This policy is part of our Privacy Policy and should be read together with it.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By continuing to browse or use our website, you agree to our use of cookies as described in this policy. You can change your cookie preferences at any time through your browser settings.
          </p>
        </section>

        {/* What Are Cookies */}
        <section id="what-are-cookies" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">What Are Cookies?</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.
          </p>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-2">Cookies help us:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
              <li>Remember your preferences and settings</li>
              <li>Keep you logged in to your account</li>
              <li>Understand how you use our website</li>
              <li>Improve our services and user experience</li>
              <li>Provide personalized content and recommendations</li>
              <li>Measure the effectiveness of our marketing campaigns</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Similar Technologies</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            In addition to cookies, we may use similar technologies such as:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Web Beacons (Pixels):</strong> Small transparent images embedded in web pages or emails to track user activity.</li>
            <li><strong>Local Storage:</strong> Technology that allows websites to store data locally on your device.</li>
            <li><strong>Session Storage:</strong> Temporary storage that exists only for the duration of your browser session.</li>
          </ul>
        </section>

        {/* How We Use Cookies */}
        <section id="how-we-use" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">How We Use Cookies</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            We use cookies for various purposes to enhance your experience on our platform:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">✅ Essential Functions</h4>
              <p className="text-gray-700 text-sm">
                Enable core features like user authentication, security, and shopping cart functionality. These cookies are necessary for the website to function properly.
              </p>
            </div>

            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">🎯 Personalization</h4>
              <p className="text-gray-700 text-sm">
                Remember your preferences (language, region, display settings) and provide personalized course recommendations based on your interests.
              </p>
            </div>

            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">📊 Analytics & Performance</h4>
              <p className="text-gray-700 text-sm">
                Analyze how visitors use our website, track page views, measure user engagement, and identify areas for improvement.
              </p>
            </div>

            <div className="border-l-4 border-pink-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">📢 Marketing & Advertising</h4>
              <p className="text-gray-700 text-sm">
                Deliver relevant ads, measure campaign effectiveness, and prevent displaying the same ad repeatedly to the same user.
              </p>
            </div>

            <div className="border-l-4 border-orange-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">🔒 Security</h4>
              <p className="text-gray-700 text-sm">
                Protect against fraud, detect suspicious activity, and ensure the security of user accounts and transactions.
              </p>
            </div>
          </div>
        </section>

        {/* Types of Cookies */}
        <section id="types" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Types of Cookies We Use</h2>
          </div>

          <div className="space-y-6">
            {/* Strictly Necessary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">🔴 Strictly Necessary Cookies</h3>
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                    These cookies are essential for the website to function and cannot be disabled. They are usually set in response to actions you take, such as logging in or filling out forms.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Examples:</p>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc list-inside">
                      <li>Authentication tokens</li>
                      <li>Session management</li>
                      <li>Security features</li>
                      <li>Load balancing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Cookies */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">🔵 Performance & Analytics Cookies</h3>
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                    These cookies collect information about how visitors use our website, helping us improve functionality and user experience. All information is aggregated and anonymous.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Examples:</p>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc list-inside">
                      <li>Google Analytics</li>
                      <li>Page view tracking</li>
                      <li>User journey analysis</li>
                      <li>Error monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Functionality Cookies */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">🟢 Functionality Cookies</h3>
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences and providing customized content.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Examples:</p>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc list-inside">
                      <li>Language preferences</li>
                      <li>Region/timezone settings</li>
                      <li>Course recommendations</li>
                      <li>Video player settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Targeting Cookies */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">🟠 Targeting & Advertising Cookies</h3>
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                    These cookies track your browsing activity to display relevant advertisements and measure the effectiveness of marketing campaigns.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Examples:</p>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc list-inside">
                      <li>Google Ads</li>
                      <li>Facebook Pixel</li>
                      <li>Retargeting campaigns</li>
                      <li>Conversion tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section id="third-party" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Third-Party Cookies</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            We work with trusted third-party service providers who may set cookies on our website to help us deliver our services. These include:
          </p>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">📊 Analytics Services</h4>
              <p className="text-gray-700 text-sm mb-2">Google Analytics - Helps us understand website usage and performance</p>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                View Google Privacy Policy →
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">💳 Payment Processors</h4>
              <p className="text-gray-700 text-sm mb-2">Razorpay - Securely processes payments and transactions</p>
              <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                View Razorpay Privacy Policy →
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">📢 Advertising Platforms</h4>
              <p className="text-gray-700 text-sm mb-2">Google Ads, Facebook Ads - Deliver targeted advertisements</p>
              <div className="space-x-4 text-xs">
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Ads Info →
                </a>
                <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Facebook Privacy →
                </a>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">💬 Communication Tools</h4>
              <p className="text-gray-700 text-sm">Live chat support, email services, video conferencing platforms</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mt-6">
            <p className="text-sm text-yellow-900">
              <strong>Please note:</strong> We do not control third-party cookies. For more information about how these companies use cookies, please review their respective privacy policies.
            </p>
          </div>
        </section>

        {/* Manage Cookies */}
        <section id="manage" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Manage Cookies</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Browser Settings</h3>
          <p className="text-gray-700 mb-4 text-sm">
            You can control cookies through your browser settings. Here's how to manage cookies in popular browsers:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">🌐 Google Chrome</h4>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                Manage cookies in Chrome →
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">🦊 Mozilla Firefox</h4>
              <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                Manage cookies in Firefox →
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">🍎 Safari</h4>
              <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                Manage cookies in Safari →
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">🌊 Microsoft Edge</h4>
              <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                Manage cookies in Edge →
              </a>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
            <p className="text-sm font-bold text-red-900 mb-2">⚠️ Important Note:</p>
            <p className="text-sm text-red-800">
              Disabling certain cookies may affect the functionality of our website. Some features may not work properly, and you may not be able to access certain areas of the site.
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Opt-Out of Interest-Based Advertising</h3>
          <p className="text-gray-700 mb-4 text-sm">
            You can opt out of interest-based advertising through these resources:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Digital Advertising Alliance (DAA)</a></li>
            <li><a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Network Advertising Initiative (NAI)</a></li>
            <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Your Online Choices (EU)</a></li>
          </ul>
        </section>

        {/* Changes to Cookie Policy */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Cookie Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We will notify you of any significant changes by updating the "Last Updated" date at the top of this policy.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Questions About Cookies?</h2>
          <p className="mb-6 text-orange-100">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <a href="mailto:cplayfit@gmail.com" className="text-orange-200 hover:text-white hover:underline">
                  cplayfit@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <p className="font-semibold">Phone</p>
                <a href="tel:+918910484299" className="text-orange-200 hover:text-white hover:underline">
                  +91 8910484299
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-orange-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-orange-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
