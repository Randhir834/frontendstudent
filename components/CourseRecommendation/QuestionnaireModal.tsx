'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { recommendationService, Question, QuestionnaireResponses, CourseRecommendation } from '@/services/recommendationService';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (recommendations: CourseRecommendation[]) => void;
}

export default function QuestionnaireModal({ isOpen, onClose, onComplete }: QuestionnaireModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [contactInfo, setContactInfo] = useState({
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    child_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadQuestionnaire();
    }
  }, [isOpen]);

  const loadQuestionnaire = async () => {
    try {
      const data = await recommendationService.getQuestionnaire();
      setQuestions(data.questions);
    } catch (err) {
      console.error('Failed to load questionnaire:', err);
      setError('Failed to load questionnaire. Please try again.');
    }
  };

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
          return prev; // Don't add if max selections reached
        }
        return {
          ...prev,
          [questionId]: [...current, value]
        };
      }
    });
  };

  const isCurrentQuestionAnswered = () => {
    const question = questions[currentStep];
    if (!question) return false;
    
    const answer = responses[question.id];
    
    if (!question.required) return true;
    
    if (question.type === 'multiple_choice') {
      return answer && Array.isArray(answer) && answer.length > 0;
    }
    
    return answer !== undefined && answer !== null && answer !== '';
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowContactForm(true);
    }
  };

  const handleBack = () => {
    if (showContactForm) {
      setShowContactForm(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await recommendationService.submitQuestionnaire({
        ...contactInfo,
        responses: responses as QuestionnaireResponses
      });

      onComplete(result.recommendations);
      onClose();
    } catch (err: any) {
      console.error('Failed to submit questionnaire:', err);
      setError(err.response?.data?.error || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-900">Course Finder</h2>
              <p className="text-sm text-dark-600">Find the perfect courses for your child</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-600" />
          </button>
        </div>

        {/* Progress Bar */}
        {!showContactForm && (
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-dark-700">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm text-dark-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {showContactForm ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-dark-900 mb-2">Almost Done!</h3>
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
                  placeholder="Enter your name"
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
                  placeholder="your.email@example.com"
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
                  placeholder="+91 XXXXX XXXXX"
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
                  placeholder="Enter child's name"
                />
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-dark-900 mb-2">
                  {currentQuestion.question}
                </h3>
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
                    className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder={`Enter age (${currentQuestion.min}-${currentQuestion.max})`}
                  />
                </div>
              )}

              {currentQuestion.type === 'single_choice' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleResponse(currentQuestion.id, option.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        responses[currentQuestion.id] === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          responses[currentQuestion.id] === option.value
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {responses[currentQuestion.id] === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full" />
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
                    <p className="text-sm text-dark-600 mb-2">
                      Select up to {currentQuestion.max_selections} options
                    </p>
                  )}
                  {currentQuestion.options?.map((option) => {
                    const isSelected = responses[currentQuestion.id]?.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleMultipleChoice(currentQuestion.id, option.value, currentQuestion.max_selections)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 0 && !showContactForm}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-dark-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
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
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting Recommendations...
                </>
              ) : (
                <>
                  Get Recommendations
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === questions.length - 1 ? 'Continue' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
