'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
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
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Your privacy matters to us. Learn how we protect your data.
          </p>
          <p className="text-sm text-blue-200">
            Last Updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-blue-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="#information-collection" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Information We Collect
            </a>
            <a href="#how-we-use" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → How We Use Your Data
            </a>
            <a href="#data-sharing" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Data Sharing & Disclosure
            </a>
            <a href="#data-security" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Data Security
            </a>
            <a href="#your-rights" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Your Privacy Rights
            </a>
            <a href="#contact" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Contact Us
            </a>
          </div>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to PlayFit Classes ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using PlayFit Classes, you agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </section>

        {/* Information We Collect */}
        <section id="information-collection" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Personal Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
            <li>Register for an account</li>
            <li>Enroll in courses or book trial classes</li>
            <li>Make payments or purchases</li>
            <li>Contact our support team</li>
            <li>Subscribe to our newsletter</li>
            <li>Participate in surveys or promotions</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-2">Information collected includes:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Postal address</li>
              <li>Date of birth and age</li>
              <li>Parent/guardian information (for students under 18)</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Profile information and preferences</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you access our platform, we automatically collect certain information about your device and usage:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Device information (type, operating system)</li>
            <li>Pages visited and time spent on pages</li>
            <li>Clickstream data and navigation patterns</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        {/* How We Use Your Data */}
        <section id="how-we-use" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            We use your personal information for the following purposes:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">🎓 Provide Educational Services</h4>
              <p className="text-gray-700 text-sm">
                To deliver courses, schedule live classes, manage enrollments, track progress, and provide learning materials.
              </p>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">💳 Process Transactions</h4>
              <p className="text-gray-700 text-sm">
                To process payments, manage subscriptions, handle refunds, and maintain billing records.
              </p>
            </div>

            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">📧 Communication</h4>
              <p className="text-gray-700 text-sm">
                To send course updates, class reminders, newsletters, promotional offers, and respond to your inquiries.
              </p>
            </div>

            <div className="border-l-4 border-orange-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">📊 Improve Our Services</h4>
              <p className="text-gray-700 text-sm">
                To analyze usage patterns, conduct research, develop new features, and enhance user experience.
              </p>
            </div>

            <div className="border-l-4 border-pink-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">🔒 Security & Compliance</h4>
              <p className="text-gray-700 text-sm">
                To protect against fraud, maintain platform security, enforce our terms, and comply with legal obligations.
              </p>
            </div>

            <div className="border-l-4 border-indigo-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">🎯 Personalization</h4>
              <p className="text-gray-700 text-sm">
                To recommend relevant courses, customize content, and provide personalized learning experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Data Sharing */}
        <section id="data-sharing" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Data Sharing & Disclosure</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            We may share your information with the following parties:
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">👨‍🏫 Instructors</h4>
              <p className="text-gray-700 text-sm">
                Your name, profile information, and course enrollment details are shared with instructors to facilitate your learning experience.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">💼 Service Providers</h4>
              <p className="text-gray-700 text-sm">
                We work with trusted third-party service providers who help us operate our platform, including payment processors (Razorpay), email services, cloud hosting, analytics tools, and customer support software.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">⚖️ Legal Requirements</h4>
              <p className="text-gray-700 text-sm">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">🤝 Business Transfers</h4>
              <p className="text-gray-700 text-sm">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 mt-6">
            <p className="text-sm font-bold text-red-900 mb-1">We will NEVER:</p>
            <ul className="list-disc list-inside space-y-1 text-red-800 text-sm ml-4">
              <li>Sell your personal information to third parties</li>
              <li>Share your data for marketing purposes without consent</li>
              <li>Provide your information to unauthorized parties</li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section id="data-security" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h4 className="font-bold text-gray-900 mb-3 mt-6">Security measures include:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure password hashing and authentication</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Restricted access to personal data on a need-to-know basis</li>
            <li>Secure cloud infrastructure with backup systems</li>
            <li>Employee training on data protection practices</li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
            <p className="text-sm text-yellow-900">
              <strong>Please note:</strong> While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section id="your-rights" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            You have the following rights regarding your personal information:
          </p>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">✅ Access & Portability</h4>
              <p className="text-gray-700 text-sm">
                You can request a copy of your personal data in a structured, commonly used format.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">✏️ Correction</h4>
              <p className="text-gray-700 text-sm">
                You can update or correct inaccurate information through your account settings.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">🗑️ Deletion</h4>
              <p className="text-gray-700 text-sm">
                You can request deletion of your personal data, subject to legal and contractual obligations.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">🚫 Opt-Out</h4>
              <p className="text-gray-700 text-sm">
                You can unsubscribe from marketing communications at any time using the unsubscribe link in emails.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">🔒 Restrict Processing</h4>
              <p className="text-gray-700 text-sm">
                You can request that we limit how we use your data under certain circumstances.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-700">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:cplayfit@gmail.com" className="text-blue-600 hover:underline font-medium">
                cplayfit@gmail.com
              </a>
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            PlayFit Classes is designed for students aged 8-18. We require parental consent for users under 18 years of age. Parents or guardians have the right to review, delete, or refuse further collection of their child's personal information.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you believe we have collected information from a child without proper consent, please contact us immediately.
          </p>
        </section>

        {/* Data Retention */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We retain your personal information for as long as necessary to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Provide our services and fulfill your requests</li>
            <li>Comply with legal obligations and resolve disputes</li>
            <li>Enforce our agreements and protect our legal rights</li>
            <li>Maintain business records for operational purposes</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            When data is no longer needed, we securely delete or anonymize it.
          </p>
        </section>

        {/* International Data Transfers */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be transferred to and maintained on servers located outside your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
            <li>Posting the updated policy on our website</li>
            <li>Updating the "Last Updated" date</li>
            <li>Sending you an email notification (for significant changes)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Your continued use of our services after changes are posted constitutes acceptance of the updated Privacy Policy.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="mb-6 text-blue-100">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <a href="mailto:cplayfit@gmail.com" className="text-blue-200 hover:text-white hover:underline">
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
                <a href="tel:+918910484299" className="text-blue-200 hover:text-white hover:underline">
                  +91 8910484299
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-blue-200">
                  18, Rabindra Sarani, Terita Bazar<br />
                  Poddar Court, 4th floor, Tiretti<br />
                  Kolkata, West Bengal 700012
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-blue-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
