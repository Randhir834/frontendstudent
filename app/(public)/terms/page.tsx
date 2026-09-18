'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Scale } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
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
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-purple-100 mb-6">
            Please read these terms carefully before using our platform
          </p>
          <p className="text-sm text-purple-200">
            Last Updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-purple-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="#acceptance" className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline">
              → Acceptance of Terms
            </a>
            <a href="#account" className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline">
              → Account Registration
            </a>
            <a href="#services" className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline">
              → Services & Courses
            </a>
            <a href="#payment" className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline">
              → Payment & Refunds
            </a>
            <a href="#conduct" className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline">
              → User Conduct
            </a>
            <a href="#termination" className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline">
              → Termination
            </a>
          </div>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to PlayFit Classes ("Company," "we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our website, mobile applications, and online educational services (collectively, the "Services").
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            PlayFit Classes is an online learning platform that provides live interactive classes, courses, and educational content for students aged 8-18 years.
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
            <p className="text-sm font-bold text-purple-900">
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use our Services.
            </p>
          </div>
        </section>

        {/* Acceptance of Terms */}
        <section id="acceptance" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            By creating an account, enrolling in courses, or using any part of our Services, you acknowledge that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
            <li>You have read, understood, and agree to these Terms</li>
            <li>You meet the eligibility requirements outlined below</li>
            <li>You have parental/guardian consent if you are under 18 years old</li>
            <li>All information you provide is accurate and complete</li>
            <li>You will comply with all applicable laws and regulations</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Eligibility</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our Services are intended for students aged 8-18 years. Users under 18 must have explicit parental or guardian consent to use our Services. Parents or guardians accept full responsibility for their child's use of the platform.
          </p>
        </section>

        {/* Account Registration */}
        <section id="account" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Account Registration & Security</h2>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Creating an Account</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            To access certain features, you must create an account by providing:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
            <li>Valid email address</li>
            <li>Full name and contact information</li>
            <li>Date of birth</li>
            <li>Parent/guardian details (for users under 18)</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-2">Account Security Responsibilities:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must notify us immediately of any unauthorized access or security breach</li>
              <li>You are liable for all activities that occur under your account</li>
              <li>You may not share your account with others</li>
              <li>You must provide accurate and up-to-date information</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Account Termination</h3>
          <p className="text-gray-700 leading-relaxed">
            You may terminate your account at any time by contacting us. We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>
        </section>

        {/* Services & Courses */}
        <section id="services" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Services & Courses</h2>

          <h3 className="text-xl font-bold text-gray-900 mb-3">What We Offer</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            PlayFit Classes provides:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
            <li>Live interactive online classes in various subjects (Art, Chess, Piano, Public Speaking, Abacus, etc.)</li>
            <li>Pre-recorded course content and learning materials</li>
            <li>Practice exercises, quizzes, and assignments</li>
            <li>Progress tracking and performance reports</li>
            <li>One-on-one instructor support (based on course type)</li>
            <li>Free trial classes for new students</li>
          </ul>

          <div className="space-y-6">
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">🎓 Course Enrollment</h4>
              <p className="text-gray-700 text-sm">
                Upon enrollment, you gain access to course materials for the duration specified in your subscription. Course content, schedules, and instructors may be updated or changed at our discretion.
              </p>
            </div>

            <div className="border-l-4 border-pink-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">📅 Class Scheduling</h4>
              <p className="text-gray-700 text-sm">
                Live classes are scheduled based on instructor availability and student preferences. You must attend classes at the scheduled time. Missed classes may not be rescheduled depending on the course policy.
              </p>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">📚 Learning Materials</h4>
              <p className="text-gray-700 text-sm">
                All course materials, including videos, documents, and resources, are for personal, non-commercial use only. You may not reproduce, distribute, or share content without permission.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Service Availability</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            While we strive to provide uninterrupted service, we do not guarantee that our Services will always be available, error-free, or secure. We may:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Modify, suspend, or discontinue any part of our Services</li>
            <li>Conduct maintenance and updates</li>
            <li>Experience technical issues or outages</li>
            <li>Change course offerings and pricing</li>
          </ul>
        </section>

        {/* Payment & Refunds */}
        <section id="payment" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment & Refunds</h2>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Pricing & Payment</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Course prices are displayed in Indian Rupees (INR) and may be subject to change. By enrolling in a course, you agree to pay:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
            <li>The full course fee at the time of enrollment (unless installment plans are offered)</li>
            <li>Any applicable taxes or processing fees</li>
            <li>Subscription fees on a recurring basis (for subscription-based courses)</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-2">Payment Methods</h4>
            <p className="text-gray-700 text-sm">
              We accept payments via credit/debit cards, net banking, UPI, and other methods supported by our payment processor (Razorpay). All payments are processed securely.
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Refund Policy</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">✅ Trial Classes</h4>
              <p className="text-gray-700 text-sm">
                Free trial classes are non-refundable. If you're unsatisfied with the trial, you are not obligated to enroll in the full course.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">💰 Full Course Refunds</h4>
              <p className="text-gray-700 text-sm">
                Refunds may be granted within <strong>7 days of purchase</strong> if you have attended fewer than <strong>2 classes</strong>. Refund requests must be submitted via email to <a href="mailto:cplayfit@gmail.com" className="text-blue-600 hover:underline">cplayfit@gmail.com</a>.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">🔄 Subscription Cancellations</h4>
              <p className="text-gray-700 text-sm">
                You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. No refunds are provided for partial months.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">⏱️ Processing Time</h4>
              <p className="text-gray-700 text-sm">
                Approved refunds will be processed within 7-10 business days and credited to your original payment method.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 mt-6">
            <p className="text-sm font-bold text-red-900 mb-1">Non-Refundable Items:</p>
            <ul className="list-disc list-inside space-y-1 text-red-800 text-sm ml-4">
              <li>Courses completed beyond the refund eligibility period</li>
              <li>Promotional discounts and special offers (unless otherwise stated)</li>
              <li>Processing fees and taxes</li>
            </ul>
          </div>
        </section>

        {/* User Conduct */}
        <section id="conduct" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">User Conduct & Prohibited Activities</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            You agree to use our Services responsibly and in compliance with all applicable laws. The following activities are strictly prohibited:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-bold text-red-900 mb-2">❌ Prohibited Content</h4>
              <p className="text-gray-700 text-sm">
                Do not post, share, or transmit content that is illegal, offensive, harassing, discriminatory, violent, sexually explicit, or infringes on others' rights.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-bold text-red-900 mb-2">🚫 Unauthorized Use</h4>
              <p className="text-gray-700 text-sm">
                Do not access or attempt to access unauthorized areas, accounts, or systems. Do not interfere with the security or integrity of our platform.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-bold text-red-900 mb-2">⚠️ Intellectual Property Violations</h4>
              <p className="text-gray-700 text-sm">
                Do not copy, reproduce, distribute, or commercially exploit our content without written permission. All course materials are protected by copyright.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-bold text-red-900 mb-2">🤖 Automated Access</h4>
              <p className="text-gray-700 text-sm">
                Do not use bots, scrapers, or automated tools to access our Services or extract data.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-bold text-red-900 mb-2">💼 Commercial Use</h4>
              <p className="text-gray-700 text-sm">
                Do not use our Services for commercial purposes without authorization. You may not resell, redistribute, or sublicense course content.
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-6">
            <p className="text-sm text-orange-900 font-medium">
              <strong>Consequences:</strong> Violation of these rules may result in suspension or permanent termination of your account, legal action, and liability for damages.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">Our Content</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            All content on PlayFit Classes, including but not limited to text, graphics, logos, videos, audio, software, and course materials, is owned by or licensed to us and protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">License to Use</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our Services for personal, non-commercial educational purposes only.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">User-Generated Content</h3>
          <p className="text-gray-700 leading-relaxed">
            By submitting content (e.g., comments, reviews, assignments), you grant us a worldwide, royalty-free license to use, reproduce, and display such content for operational and promotional purposes.
          </p>
        </section>

        {/* Disclaimer */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimers & Limitations</h2>
          
          <div className="bg-gray-100 border-l-4 border-gray-600 p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-2">⚖️ "As Is" Basis</h4>
            <p className="text-gray-700 text-sm">
              Our Services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee specific learning outcomes or results.
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Limitation of Liability</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            To the maximum extent permitted by law, PlayFit Classes shall not be liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Any indirect, incidental, consequential, or punitive damages</li>
            <li>Loss of data, profits, or business opportunities</li>
            <li>Errors or inaccuracies in content</li>
            <li>Interruptions or unavailability of services</li>
            <li>Actions of third-party service providers or instructors</li>
          </ul>
        </section>

        {/* Termination */}
        <section id="termination" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Termination</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            We reserve the right to suspend or terminate your access to our Services at any time, with or without notice, for any reason, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
            <li>Violation of these Terms</li>
            <li>Fraudulent or illegal activity</li>
            <li>Abusive behavior toward instructors or other users</li>
            <li>Non-payment of fees</li>
            <li>Prolonged inactivity</li>
          </ul>

          <p className="text-gray-700 leading-relaxed">
            Upon termination, your right to access and use our Services will immediately cease. We may delete your account data in accordance with our data retention policies.
          </p>
        </section>

        {/* Governing Law */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law & Dispute Resolution</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of our Services shall be subject to the exclusive jurisdiction of the courts in Kolkata, West Bengal.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We encourage you to contact us first to resolve any disputes informally before pursuing legal action.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to These Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. We will notify you of significant changes via email or through a notice on our platform.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Your continued use of our Services after changes are posted constitutes acceptance of the updated Terms.
          </p>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
          <p className="mb-6 text-purple-100">
            If you have any questions or concerns regarding these Terms of Service, please contact us:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <a href="mailto:cplayfit@gmail.com" className="text-purple-200 hover:text-white hover:underline">
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
                <a href="tel:+918910484299" className="text-purple-200 hover:text-white hover:underline">
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
                <p className="text-purple-200">
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
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-purple-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-purple-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
