'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { recommendationService, type Question, type QuestionnaireResponses } from '@/services/recommendationService';

export default function CourseFinderPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
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

  const currentQuestion = questions[currentStep];
  const isContactStep = currentStep === questions.length;
  const totalSteps = questions.length + 1; // Questions + contact info
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultipleChoice = (questionId: string, value: string) => {
    const current = responses[questionId] || [];
    const maxSelections = currentQuestion?.max_selections;

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

  const canProceed = () => {
    if (isContactStep) {
      // Contact info is optional
      return true;
    }

    const question = currentQuestion;
    if (!question || !question.required) return true;

    const response = responses[question.id];

    if (question.type === 'number') {
      return response && response >= (question.min || 0) && response <= (question.max || 100);
    }

    if (question.type === 'multiple_choice') {
      return response && Array.isArray(response) && response.length > 0;
    }

    if (question.type === 'single_choice') {
      return response && response.length > 0;
    }

    return false;
  };

  const handleNext = () => {
    if (canProceed()) {
      if (isContactStep) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Course Finder
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-dark-900 mb-2">
            Find Your Child's Perfect Course
          </h1>
          <p className="text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {!isContactStep ? (
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-6">
                {currentQuestion?.question}
              </h2>

              {/* Number Input */}
              {currentQuestion?.type === 'number' && (
                <div>
                  <input
                    type="number"
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    value={responses[currentQuestion.id] || ''}
                    onChange={(e) => handleResponse(currentQuestion.id, parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-lg"
                    placeholder={`Enter age (${currentQuestion.min}-${currentQuestion.max})`}
                  />
                </div>
              )}

              {/* Single Choice */}
              {currentQuestion?.type === 'single_choice' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleResponse(currentQuestion.id, option.value)}
                      className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                        responses[currentQuestion.id] === option.value
                          ? 'border-primary-600 bg-primary-50 text-primary-900'
                          : 'border-gray-300 hover:border-primary-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          responses[currentQuestion.id] === option.value
                            ? 'border-primary-600'
                            : 'border-gray-400'
                        }`}>
                          {responses[currentQuestion.id] === option.value && (
                            <div className="w-3 h-3 rounded-full bg-primary-600" />
                          )}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Multiple Choice */}
              {currentQuestion?.type === 'multiple_choice' && (
                <div className="space-y-3">
                  {currentQuestion.max_selections && (
                    <p className="text-sm text-gray-600 mb-3">
                      Select up to {currentQuestion.max_selections} options
                    </p>
                  )}
                  {currentQuestion.options?.map((option) => {
                    const isSelected = (responses[currentQuestion.id] || []).includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleMultipleChoice(currentQuestion.id, option.value)}
                        className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary-600 bg-primary-50 text-primary-900'
                            : 'border-gray-300 hover:border-primary-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-primary-600 bg-primary-600'
                              : 'border-gray-400'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Contact Info Step */
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-2">
                Almost Done! Get Your Results
              </h2>
              <p className="text-gray-600 mb-6">
                Optionally provide your contact details to receive personalized recommendations via email.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    value={contactInfo.parent_name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, parent_name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactInfo.parent_email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, parent_email: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.parent_phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, parent_phone: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    value={contactInfo.child_name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, child_name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="Enter child's name"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || submitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : isContactStep ? (
              <>
                Get My Recommendations
                <Sparkles className="w-5 h-5" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Skip Contact Info */}
        {isContactStep && (
          <div className="text-center mt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Skip and see results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
