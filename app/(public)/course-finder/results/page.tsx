'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { recommendationService, type CourseRecommendation } from '@/services/recommendationService';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      router.push('/course-finder');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const data = await recommendationService.getRecommendationsBySession(sessionId);
        setRecommendations(data.recommended_courses || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations. Please try again.');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Finding Your Perfect Courses...</h2>
          <p className="text-gray-600">Analyzing your responses to create personalized recommendations</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/course-finder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No courses found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find courses matching your preferences. Try adjusting your responses or browse all courses.
          </p>
          <div className="flex gap-3">
            <Link
              href="/course-finder"
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center"
            >
              Retake Quiz
            </Link>
            <Link
              href="/student/courses"
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all text-center"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Main Content */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Recommendations List */}
          <div className="space-y-6 mb-12">
            {recommendations.map((rec, index) => {
              return (
                <div
                  key={rec.course_id}
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200"
                >
                  <div className="lg:flex">
                    {/* Left Side - Image */}
                    <div className="lg:w-80 xl:w-96 relative bg-white flex items-center justify-center p-8">
                      <div className="w-full aspect-square flex items-center justify-center">
                        {rec.course_thumbnail ? (
                          <img
                            src={rec.course_thumbnail}
                            alt={rec.course_title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl">
                            <BookOpen className="w-24 h-24 text-purple-400 opacity-50" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="flex-1 p-6 sm:p-8">
                      {/* Course Title & Price */}
                      <div className="flex flex-col gap-4 mb-6">
                        <div className="flex-1">
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all leading-tight">
                            {rec.course_title}
                          </h2>
                          <p className="text-base text-gray-600 leading-relaxed line-clamp-2">
                            {rec.course_description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="inline-flex items-baseline gap-2 px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                            <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              ₹{rec.course_price?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/courses/${rec.course_id}`}
                          className="flex-1 group/btn flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 relative overflow-hidden"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-20 transition-opacity"></span>
                          <span className="relative">View Course Details</span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform relative" />
                        </Link>
                        <Link
                          href={`/courses/${rec.course_id}?enroll=true`}
                          className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-bold text-base hover:bg-purple-50 transition-all text-center"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Section */}
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative p-8 sm:p-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
              </div>

              <div className="relative text-center">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                  Ready to Start Learning?
                </h3>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Choose a course above or explore more options to find the perfect fit for your child
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/courses"
                    className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                  >
                    Browse All Courses
                  </Link>
                  <Link
                    href="/course-finder"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 shadow-xl"
                  >
                    Retake Quiz
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsContent />
    </Suspense>
  );
}
