'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { recommendationService, Question, CourseRecommendation } from '@/services/recommendationService';
import RecommendationResults from '@/components/CourseRecommendation/RecommendationResults';

export default function CourseFinderPage() {
  const [step, setStep] = useState<'questionnaire' | 'results'>('questionnaire');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [contactInfo, setContactInfo] = useState({
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    child_name: ''
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);

  const loadQuestionnaire = async () => {
    try {
      setLoadingQuestions(true);
      const data = await recommendationService.getQuestionnaire();
      setQuestions(data.questions);
    } catch (err) {
      console.error('Failed to load questionnaire:', err);
      setError('Failed to load questionnaire. Please try again.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Load questionnaire on mount
  useEffect(() => {
    loadQuestionnaire();
  }, []);

  const handleResponse = (questionId: string, value: any) => {
    setResponses((prev: any) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultipleChoice = (questionId: string, value: string, maxSelections?: number) => {
    setResponses((prev: any) => {
      const current = prev[questionId] || [];
      const isSelected = current.includes(value);
      
      if (isSelected) {
        return {
          ...prev,
          [questionId]: current.filter((v: string) => v !== value)
        };
      } else {
        if (maxSelections && current.length >= maxSelections) {
          return prev;
        }
        return {
          ...prev,
          [questionId]: [...current, value]
        };
      }
    });
  };

  const isCurrentQuestionAnswered = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return false;
    
    const answer = responses[question.id];
    
    if (!question.required) return true;
    
    if (question.type === 'multiple_choice') {
      return answer && Array.isArray(answer) && answer.length > 0;
    }
    
    return answer !== undefined && answer !== null && answer !== '';
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowContactForm(true);
    }
  };

  const handleBack = () => {
    if (showContactForm) {
      setShowContactForm(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await recommendationService.submitQuestionnaire({
        ...contactInfo,
        responses: responses
      });

      setRecommendations(result.recommendations);
      setStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to submit questionnaire:', err);
      setError(err.response?.data?.error || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setStep('questionnaire');
    setCurrentQuestionIndex(0);
    setResponses({});
    setContactInfo({
      parent_name: '',
      parent_email: '',
      parent_phone: '',
      child_name: ''
    });
    setShowContactForm(false);
    setRecommendations([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-dark-600">Loading Course Finder...</p>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30">
        {/* Results */}
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <RecommendationResults 
              recommendations={recommendations}
              onClose={handleRetake}
            />
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Section */}
        {!showContactForm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-dark-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-dark-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Question Card or Contact Form */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {showContactForm ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-dark-900 mb-2">Almost Done!</h2>
                  <p className="text-dark-600">Share your contact details to receive personalized recommendations</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">
                    Parent's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactInfo.parent_name}
                    onChange={(e) => setContactInfo({ ...contactInfo, parent_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={contactInfo.parent_email}
                    onChange={(e) => setContactInfo({ ...contactInfo, parent_email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.parent_phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, parent_phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">
                    Child's Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={contactInfo.child_name}
                    onChange={(e) => setContactInfo({ ...contactInfo, child_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-dark-900 mb-3">
                    {currentQuestion.question}
                  </h2>
                  {!currentQuestion.required && (
                    <p className="text-sm text-dark-500">Optional</p>
                  )}
                </div>

                {currentQuestion.type === 'number' && (
                  <div>
                    <input
                      type="number"
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      value={responses[currentQuestion.id] || ''}
                      onChange={(e) => handleResponse(currentQuestion.id, parseInt(e.target.value))}
                      className="w-full px-6 py-4 text-xl rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors" />
                  </div>
                )}

                {currentQuestion.type === 'single_choice' && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleResponse(currentQuestion.id, option.value)}
                        className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                          responses[currentQuestion.id] === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            responses[currentQuestion.id] === option.value
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-gray-300'
                          }`}>
                            {responses[currentQuestion.id] === option.value && (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="font-medium text-dark-900">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {currentQuestion.max_selections && (
                      <p className="text-sm text-dark-600 mb-3">
                        Select up to {currentQuestion.max_selections} options
                      </p>
                    )}
                    {currentQuestion.options?.map((option) => {
                      const isSelected = responses[currentQuestion.id]?.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleMultipleChoice(currentQuestion.id, option.value, currentQuestion.max_selections)}
                          className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium text-dark-900">{option.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Navigation Footer */}
          <div className="px-8 md:px-12 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0 && !showContactForm}
              className="px-6 py-3 rounded-xl font-medium text-dark-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {showContactForm ? (
              <button
                onClick={handleSubmit}
                disabled={loading || !contactInfo.parent_name || !contactInfo.parent_email || !contactInfo.parent_phone}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Getting Recommendations...
                  </>
                ) : (
                  <>
                    Get Recommendations
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered()}
                className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Continue' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
