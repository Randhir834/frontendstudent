import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Award, Users, Globe, Heart, Target, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: `About ${SITE_CONFIG.business.name} – Global Online Classes for Kids`,
  description: `${SITE_CONFIG.business.name} offers live online classes for kids aged ${SITE_CONFIG.audience.ageRange} worldwide. ${SITE_CONFIG.courses.featured.join(', ')}, and more. Based in Kolkata, India. Trusted by ${SITE_CONFIG.stats.students} students from 15+ countries.`,
  openGraph: {
    title: 'About PlayFit – Global Online Classes for Kids',
    description: 'Discover how PlayFit transforms children\'s education with live online courses in Phonics, Public Speaking, Art, and more for kids aged 4–10 worldwide. Based in Kolkata, India.',
    url: 'https://playfitclasses.com/about',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About PlayFit – Global Online Classes for Kids',
    description: 'Live online classes for kids aged 4–10 worldwide. Learn Phonics, Public Speaking, Art, and more with expert instructors from India.',
    images: ['/logo.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="text-gray-900">About </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              PlayFit Classes
            </span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            <strong>PlayFit</strong> is transforming how children learn worldwide by offering live, interactive online courses that inspire creativity, critical thinking, and lifelong skills. Based in Kolkata, India, we serve students from 15+ countries.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Mission at <span className="text-purple-600">PlayFit</span>
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                At <strong>PlayFit Classes</strong>, we believe every child deserves access to world-class education, no matter where they live. Our mission is to empower children aged 4-10 worldwide with essential life skills through engaging, expert-led online courses from our headquarters in Kolkata, India.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Since our founding, <strong>{SITE_CONFIG.business.name}</strong> has grown to serve over {SITE_CONFIG.stats.students} students from India, USA, UK, UAE, Singapore, Australia, and beyond—offering courses in Phonics, Public Speaking, Grammar, Art, and more.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're not just teaching subjects—we're building confidence, creativity, and character in the next generation of global citizens.
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
                <Users className="w-12 h-12 mb-4" />
                <div className="text-4xl font-bold mb-2">{SITE_CONFIG.stats.students}</div>
                <div className="text-blue-100">Happy Students Learning with {SITE_CONFIG.business.name}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                <Award className="w-12 h-12 mb-4" />
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-purple-100">Expert Certified Instructors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PlayFit */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">PlayFit Classes</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">🌍 Available Worldwide</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>PlayFit</strong> offers 100% online classes accessible from anywhere in the world. Students from India, USA, UK, UAE, Singapore, and beyond learn together in our global classrooms.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Indian Instructors</h3>
              <p className="text-gray-700 leading-relaxed">
                Our team of experienced instructors from India brings world-class teaching expertise to students globally. Live, interactive sessions ensure personalized attention and immediate feedback.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted Globally</h3>
              <p className="text-gray-700 leading-relaxed">
                With a 4.9/5 rating and students from 15+ countries, <strong>PlayFit Classes</strong> is the trusted choice for parents worldwide seeking quality online education for their children.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Courses */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">PlayFit</span> Courses
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            <strong>PlayFit Classes</strong> offers 11+ expertly designed courses covering art, music, logic, communication, and technology for children aged 8-18.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {[
              'Art & Drawing',
              'Chess',
              'Piano',
              'Phonics',
              'Public Speaking',
              'Abacus',
              'Computer Skills',
              'Rubik\'s Cube'
            ].map((course, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 hover:border-purple-400 transition-all">
                <div className="font-bold text-gray-900">{course}</div>
              </div>
            ))}
          </div>

          <Link 
            href="/student/courses"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Explore All PlayFit Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Join the PlayFit Family Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Start your child's learning journey with <strong>PlayFit Classes</strong>. Free trial available!
          </p>
          <Link 
            href="/#trial"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Request Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About PlayFit Classes",
            "description": "Learn about PlayFit Classes, the leading online learning platform for children aged 8-18 offering courses in art, chess, piano, and more.",
            "url": "https://playfitclasses.com/about",
            "mainEntity": {
              "@type": "EducationalOrganization",
              "name": "PlayFit Classes",
              "alternateName": "PlayFit",
              "description": "Leading online learning platform offering live skill development courses for children aged 8-18",
              "foundingDate": "2020",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": "50+"
              },
              "slogan": "Transform Your Learning Journey",
              "url": "https://playfitclasses.com",
              "logo": "https://playfitclasses.com/logo.jpg",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "10000"
              }
            }
          })
        }}
      />
    </div>
  );
}
