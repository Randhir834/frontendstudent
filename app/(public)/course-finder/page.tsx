'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { recommendationService, type Question, type QuestionnaireResponses } from '@/services/recommendationService';

export default function CourseFinderPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [contactInfo, setContactInfo] = useState({
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    child_name: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch questionnaire on mount
  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const data = await recommendationService.getQuestionnaire();
        setQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questionnaire:', err);
        setError('Failed to load questionnaire. Please try again.');
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, []);

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultipleChoice = (questionId: string, value: string, question: Question) => {
    const current = responses[questionId] || [];
    const maxSelections = question.max_selections;

    if (current.includes(value)) {
      // Remove if already selected
      handleResponse(questionId, current.filter((v: string) => v !== value));
    } else {
      // Add if not at max selections
      if (!maxSelections || current.length < maxSelections) {
        handleResponse(questionId, [...current, value]);
      }
    }
  };

  const validateForm = () => {
    // Check all required questions are answered
    for (const question of questions) {
      if (question.required) {
        const response = responses[question.id];

        if (question.type === 'number') {
          if (!response || response < (question.min || 0) || response > (question.max || 100)) {
            return false;
          }
        } else if (question.type === 'multiple_choice') {
          if (!response || !Array.isArray(response) || response.length === 0) {
            return false;
          }
        } else if (question.type === 'single_choice') {
          if (!response || response.length === 0) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please answer all required questions.');
      // Scroll to first unanswered question
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await recommendationService.submitQuestionnaire({
        parent_name: contactInfo.parent_name || undefined,
        parent_email: contactInfo.parent_email || undefined,
        parent_phone: contactInfo.parent_phone || undefined,
        child_name: contactInfo.child_name || undefined,
        responses: responses as QuestionnaireResponses
      });

      // Navigate to results page with session ID
      router.push(`/course-finder/results?session=${result.session_id}`);
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
      setError('Failed to get recommendations. Please try again.');
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-base sm:text-lg text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Form Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-1">Error</h3>
                  <p className="text-sm sm:text-base text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Questions Form */}
          <div className="space-y-6 sm:space-y-8">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8 hover:shadow-md transition-shadow"
              >
                <div className="mb-6">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        {question.question}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Number Input */}
                {question.type === 'number' && (
                  <div>
                    <input
                      type="number"
                      min={question.min}
                      max={question.max}
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponse(question.id, parseInt(e.target.value) || '')}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base sm:text-lg"
                      placeholder={`Enter age (${question.min}-${question.max})`}
                    />
                  </div>
                )}

                {/* Single Choice */}
                {question.type === 'single_choice' && (
                  <div className="space-y-3">
                    {question.options?.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleResponse(question.id, option.value)}
                        className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 transition-all ${
                          responses[question.id] === option.value
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            responses[question.id] === option.value
                              ? 'border-blue-600'
                              : 'border-gray-400'
                          }`}>
                            {responses[question.id] === option.value && (
                              <div className="w-3 h-3 rounded-full bg-blue-600" />
                            )}
                          </div>
                          <span className="font-medium text-sm sm:text-base">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Multiple Choice */}
                {question.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {question.max_selections && (
                      <p className="text-sm sm:text-base text-gray-600 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        Select up to {question.max_selections} option{question.max_selections > 1 ? 's' : ''}
                      </p>
                    )}
                    {question.options?.map((option) => {
                      const isSelected = (responses[question.id] || []).includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleMultipleChoice(question.id, option.value, question)}
                          className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-900'
                              : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-400'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium text-sm sm:text-base">{option.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Contact Information Section */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl border-2 border-blue-200 p-6 sm:p-8">
              <div className="mb-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      Get Your Personalized Results
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Optionally provide your contact details to receive recommendations via email (all fields are optional)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    value={contactInfo.parent_name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, parent_name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm sm:text-base bg-white"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactInfo.parent_email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, parent_email: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm sm:text-base bg-white"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.parent_phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, parent_phone: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm sm:text-base bg-white"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    value={contactInfo.child_name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, child_name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm sm:text-base bg-white"
                    placeholder="Enter child's name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button Section */}
          <div className="mt-8 sm:mt-12">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-6 sm:p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Ready to Discover Perfect Courses?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Click below to get your personalized course recommendations instantly
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!validateForm() || submitting}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base sm:text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    Analyzing Your Responses...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    Get My Personalized Recommendations
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  </>
                )}
              </button>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-gray-600 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span>Takes 2 minutes</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section - Matching Homepage Style */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Why Choose Our AI-Powered Course Finder?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed mb-6 sm:mb-8">
              Our intelligent recommendation system analyzes your child's unique characteristics to match them with courses that will maximize their learning potential and enjoyment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                { number: "10,000+", label: "Happy Students" },
                { number: "11+", label: "Skill Courses" },
                { number: "98%", label: "Satisfaction Rate" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base font-medium text-blue-100">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
