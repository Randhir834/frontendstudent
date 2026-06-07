'use client';

import { Star, CheckCircle, TrendingUp, Award, ArrowRight, Sparkles } from 'lucide-react';
import { CourseRecommendation } from '@/services/recommendationService';
import Link from 'next/link';

interface RecommendationResultsProps {
  recommendations: CourseRecommendation[];
  onClose?: () => void;
}

export default function RecommendationResults({ recommendations, onClose }: RecommendationResultsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-dark-900 mb-2">No Recommendations Found</h3>
        <p className="text-dark-600 mb-6">
          We couldn't find courses matching your preferences. Please try adjusting your answers.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 px-5 py-2 rounded-full text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4" />
          Personalized Recommendations
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-3">
          Perfect Courses for Your Child
        </h2>
        <p className="text-lg text-dark-600 max-w-2xl mx-auto">
          Based on your responses, we've found {recommendations.length} courses that match your child's interests and learning style.
        </p>
      </div>

      {/* Recommendations Grid */}
      <div className="grid gap-6">
        {recommendations.map((recommendation, index) => (
          <div
            key={recommendation.course_id}
            className="bg-white rounded-2xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="flex flex-col md:flex-row">
              {/* Course Image */}
              <div className="md:w-1/3 relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
                {recommendation.course_thumbnail ? (
                  <img
                    src={recommendation.course_thumbnail}
                    alt={recommendation.course_title}
                    className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-64 md:h-full flex items-center justify-center">
                    <Award className="w-20 h-20 text-primary-300" />
                  </div>
                )}
                
                {/* Match Score Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  {recommendation.score}% Match
                </div>

                {/* Rank Badge */}
                {index === 0 && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    #1 Pick
                  </div>
                )}
              </div>

              {/* Course Details */}
              <div className="md:w-2/3 p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {recommendation.course_title}
                    </h3>
                    <p className="text-dark-600 line-clamp-2 mb-4">
                      {recommendation.course_description}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      ₹{recommendation.course_price}
                    </div>
                    <div className="text-sm text-dark-500">{recommendation.course_level}</div>
                  </div>
                </div>

                {/* Why Recommended */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-dark-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                    Why This Course?
                  </h4>
                  <ul className="space-y-1">
                    {recommendation.reasons.slice(0, 3).map((reason, idx) => (
                      <li key={idx} className="text-sm text-dark-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Developed */}
                {recommendation.skills_developed && recommendation.skills_developed.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-dark-900 mb-2">Skills Developed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.skills_developed.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                        >
                          {skill.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {recommendation.benefits && recommendation.benefits.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-dark-900 mb-2">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {recommendation.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="text-sm text-dark-600 flex items-start gap-2">
                          <Award className="w-4 h-4 text-secondary-500 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/courses/${recommendation.course_id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group"
                  >
                    View Course Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#trial"
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary-200 hover:border-primary-500 text-primary-600 rounded-xl font-semibold transition-all"
                  >
                    Book Free Trial
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-2xl p-8 text-center border-2 border-primary-100">
        <h3 className="text-2xl font-bold text-dark-900 mb-3">Ready to Get Started?</h3>
        <p className="text-dark-600 mb-6 max-w-2xl mx-auto">
          Book a free trial for any of these courses and see how they can help your child grow and develop new skills.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#trial"
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Book Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </a>
          <Link
            href="/login"
            className="px-8 py-4 bg-white border-2 border-primary-200 hover:border-primary-500 text-primary-600 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            Login to Enroll
          </Link>
        </div>
      </div>
    </div>
  );
}
