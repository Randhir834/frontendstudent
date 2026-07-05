import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Award, Users, Globe, Heart, Target, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About PlayFit Classes - Leading Online Learning Platform for Kids',
  description: 'Learn about PlayFit Classes, the trusted online education platform for children aged 8-18. Discover our mission, expert instructors, and how we help 10,000+ students master new skills through live interactive courses.',
  keywords: [
    'about PlayFit',
    'PlayFit Classes about us',
    'online learning platform for kids',
    'who is PlayFit',
    'PlayFit mission',
    'best online courses for children',
    'expert instructors for kids',
    'trusted online education'
  ],
  openGraph: {
    title: 'About PlayFit Classes - Leading Online Learning Platform for Kids',
    description: 'Discover how PlayFit Classes is transforming children\'s education with live online courses in art, chess, piano, and more.',
    url: 'https://playfitclasses.com/about',
    images: ['/logo.jpg'],
  },
  alternates: {
    canonical: 'https://playfitclasses.com/about',
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
            <strong>PlayFit</strong> is transforming how children learn by offering live, interactive online courses that inspire creativity, critical thinking, and lifelong skills.
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
                At <strong>PlayFit Classes</strong>, we believe every child deserves access to world-class education. Our mission is to empower children aged 8-18 with essential life skills through engaging, expert-led online courses.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Since our founding, <strong>PlayFit</strong> has grown to serve over 10,000 students across the globe, offering courses in art, chess, piano, phonics, public speaking, abacus, computers, and more.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're not just teaching subjects—we're building confidence, creativity, and character in the next generation.
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
                <Users className="w-12 h-12 mb-4" />
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Happy Students Learning with PlayFit</div>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Interactive Classes</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>PlayFit</strong> offers real-time, interactive sessions with expert instructors, ensuring personalized attention and immediate feedback for every student.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skill-Based Learning</h3>
              <p className="text-gray-700 leading-relaxed">
                Our curriculum at <strong>PlayFit</strong> focuses on practical skills that prepare children for future success, from creative arts to logical thinking.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted by Parents</h3>
              <p className="text-gray-700 leading-relaxed">
                With a 4.9/5 rating and thousands of satisfied families, <strong>PlayFit Classes</strong> is the trusted choice for children's online education.
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
