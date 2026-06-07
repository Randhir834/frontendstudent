'use client';

import Link from 'next/link';
import { Sparkles, Target, Brain, TrendingUp } from 'lucide-react';

export default function CourseRecommendationSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 px-5 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Course Finder
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Perfect Course</span> for Your Child
            </h2>
            <p className="text-lg text-dark-600 max-w-3xl mx-auto">
              Answer a few simple questions about your child's interests, learning style, and goals. 
              Our intelligent system will recommend the most suitable courses tailored to their unique needs.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Brain,
                title: 'Smart Matching',
                description: 'Our AI analyzes your responses to find courses that perfectly match your child\'s learning style and interests.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Target,
                title: 'Personalized Results',
                description: 'Get customized recommendations based on age, personality traits, and developmental goals.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: TrendingUp,
                title: 'Growth Focused',
                description: 'Discover courses that will help your child develop essential skills and reach their full potential.',
                color: 'from-green-500 to-green-600'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg flex items-center justify-center text-white mb-4`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-2">{feature.title}</h3>
                <p className="text-dark-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Discover the Best Courses?
              </h3>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Take our quick 2-minute questionnaire and get instant, personalized course recommendations for your child.
              </p>
              
              <Link
                href="/course-finder"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-600 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <Sparkles className="w-6 h-6" />
                Start Course Finder
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <div className="mt-8 flex items-center justify-center gap-8 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Takes 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
