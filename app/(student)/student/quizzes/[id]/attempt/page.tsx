'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  description: string;
  time_limit_minutes: number;
  total_marks: number;
}

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
}

interface Answer {
  question_id: number;
  selected_option: string;
}

export default function QuizAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = (params?.id as string) || '';

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startQuizAttempt();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [timeRemaining]);

  const startQuizAttempt = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch quiz details
      const quizResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!quizResponse.ok) throw new Error('Failed to fetch quiz');

      const quizData = await quizResponse.json();
      setQuiz(quizData.quiz);
      setQuestions(quizData.questions || []);
      setTimeRemaining(quizData.quiz.time_limit_minutes * 60);

      // Start attempt
      const attemptResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/attempt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!attemptResponse.ok) {
        const error = await attemptResponse.json();
        throw new Error(error.error || 'Failed to start attempt');
      }

      const attemptData = await attemptResponse.json();
      setAttemptId(attemptData.attempt.id);
      setStartTime(Date.now());
    } catch (err: any) {
      alert(err.message);
      router.push('/student/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, option: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.question_id === questionId);
      if (existing) {
        return prev.map((a) =>
          a.question_id === questionId ? { ...a, selected_option: option } : a
        );
      }
      return [...prev, { question_id: questionId, selected_option: option }];
    });
  };

  const calculateScore = async () => {
    const token = localStorage.getItem('token');
    let score = 0;

    // Submit each answer
    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.question_id);
      if (!question) continue;

      // Get correct answer from backend
      const questionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const questionData = await questionResponse.json();
      const correctQuestion = questionData.questions.find((q: any) => q.id === answer.question_id);

      const isCorrect = correctQuestion?.correct_option === answer.selected_option;

      if (isCorrect) {
        score += question.marks;
      }

      // Submit answer
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/attempts/${attemptId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question_id: answer.question_id,
          selected_option: answer.selected_option,
          is_correct: isCorrect,
        }),
      });
    }

    return score;
  };

  const handleSubmit = async () => {
    if (answers.length < questions.length) {
      if (
        !confirm(
          `You have answered ${answers.length} out of ${questions.length} questions. Do you want to submit anyway?`
        )
      ) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const score = await calculateScore();
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/attempts/${attemptId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score,
          total_marks: quiz?.total_marks || 0,
          time_taken_seconds: timeTaken,
        }),
      });

      alert('Quiz submitted successfully!');
      router.push(`/student/quizzes/${quizId}/my-attempts`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (submitting || !attemptId) return;
    alert('Time is up! Your quiz will be submitted automatically.');
    await handleSubmit();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return answers.length;
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="text-center py-8">Starting quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="text-center py-8">Quiz not found</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header with Timer */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
              {quiz.title}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              {getAnsweredCount()}/{questions.length} questions answered
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
            </div>

            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          </div>
        </div>

        {timeRemaining < 300 && (
          <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Less than 5 minutes remaining!</span>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const answer = answers.find((a) => a.question_id === question.id);

          return (
            <Card key={question.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary font-medium mb-1">{question.question_text}</p>
                    <p className="text-xs text-text-muted">Marks: {question.marks}</p>
                  </div>
                  {answer && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2 ml-11">
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionKey = `option_${option.toLowerCase()}` as keyof Question;
                    const isSelected = answer?.selected_option === option;

                    return (
                      <label
                        key={option}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(question.id, option)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-text-primary mr-2">{option}.</span>
                          <span className="text-text-primary">{question[optionKey] as string}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button at Bottom */}
      <div className="flex justify-center pt-4">
        <Button onClick={handleSubmit} disabled={submitting} size="lg">
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </Button>
      </div>
    </div>
  );
}
