'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, TrendingUp, CheckCircle, ArrowRight, Loader2, Award, BookOpen } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Finding your perfect courses...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
            Your Personalized Course Recommendations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on your responses, we've found {recommendations.length} course{recommendations.length > 1 ? 's' : ''} perfectly suited for your child's interests and goals.
          </p>
        </div>

        {/* Recommendations List */}
        <div className="space-y-6 mb-12">
          {recommendations.map((rec, index) => (
            <div
              key={rec.course_id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="md:flex">
                {/* Course Image */}
                <div className="md:w-80 h-64 md:h-auto bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                  {rec.course_thumbnail ? (
                    <img
                      src={rec.course_thumbnail}
                      alt={rec.course_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-24 h-24 text-primary-600 opacity-50" />
                  )}
                  {/* Match Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-bold">{rec.score}% Match</span>
                    </div>
                  </div>
                  {/* Rank Badge */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full shadow-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        <span className="font-bold">Best Match</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Course Details */}
                <div className="flex-1 p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-dark-900 mb-2">
                        {rec.course_title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {rec.course_description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-600">
                        ₹{rec.course_price}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {rec.course_level} Level
                      </div>
                    </div>
                  </div>

                  {/* Why Recommended */}
                  {rec.reasons && rec.reasons.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-600" />
                        Why this course is perfect for your child:
                      </h3>
                      <ul className="space-y-1">
                        {rec.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills Developed */}
                  {rec.skills_developed && rec.skills_developed.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Skills Your Child Will Develop:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {rec.skills_developed.slice(0, 6).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/student/courses?id=${rec.course_id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all"
                    >
                      View Course Details
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/student/courses?enroll=${rec.course_id}`}
                      className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-dark-900 mb-4">
            Want to Explore More Options?
          </h3>
          <p className="text-gray-600 mb-6">
            Browse all our courses or retake the quiz with different preferences.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/student/courses"
              className="px-8 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Browse All Courses
            </Link>
            <Link
              href="/course-finder"
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all"
            >
              Retake Quiz
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Back to Home
            </Link>
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
