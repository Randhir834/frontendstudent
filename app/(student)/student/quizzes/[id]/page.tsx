'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, Play, Clock, Award, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  description: string;
  course_title: string;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  total_marks: number;
  deadline: string | null;
  my_attempts: number;
  my_best_score: number | null;
  last_attempt_status: string | null;
}

interface Attempt {
  id: number;
  attempt_number: number;
  score: number;
  total_marks: number;
  status: string;
  time_taken_seconds: number | null;
  started_at: string;
  completed_at: string | null;
}

export default function StudentQuizDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = (params?.id as string) || '';

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch quiz details
      const quizResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!quizResponse.ok) throw new Error('Failed to fetch quiz');

      const quizData = await quizResponse.json();
      setQuiz(quizData.quiz);

      // Fetch my attempts
      const attemptsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/my-attempts/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (attemptsResponse.ok) {
        const attemptsData = await attemptsResponse.json();
        const quizAttempts = attemptsData.attempts || [];
        setAttempts(quizAttempts);
      }
    } catch (err: any) {
      alert(err.message);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isDeadlinePassed = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const canAttempt = (quiz: Quiz) => {
    if (isDeadlinePassed(quiz.deadline)) return false;
    if (quiz.my_attempts >= quiz.max_attempts) return false;
    if (quiz.last_attempt_status === 'in_progress') return false;
    return true;
  };

  const getScorePercentage = (score: number, total: number) => {
    return ((score / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="text-center py-8">Loading...</div>
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

  const deadlinePassed = isDeadlinePassed(quiz.deadline);
  const attemptsRemaining = quiz.max_attempts - quiz.my_attempts;
  const canStart = canAttempt(quiz);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
            {quiz.title}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">{quiz.course_title}</p>
        </div>
        {canStart && (
          <Button onClick={() => router.push(`/student/quizzes/${quizId}/attempt`)}>
            <Play className="w-4 h-4 mr-2" />
            Start Quiz
          </Button>
        )}
      </div>

      {/* Quiz Information */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.description && (
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-1">Description</h3>
              <p className="text-text-primary">{quiz.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-text-muted">Time Limit</p>
                <p className="text-sm font-semibold text-text-primary">
                  {quiz.time_limit_minutes} minutes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-text-muted">Total Marks</p>
                <p className="text-sm font-semibold text-text-primary">{quiz.total_marks}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-text-muted">Passing Score</p>
                <p className="text-sm font-semibold text-text-primary">{quiz.passing_score}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-xs text-text-muted">Max Attempts</p>
                <p className="text-sm font-semibold text-text-primary">{quiz.max_attempts}</p>
              </div>
            </div>
          </div>

          {quiz.deadline && (
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${deadlinePassed ? 'text-red-600' : 'text-orange-600'}`} />
              <div>
                <p className="text-xs text-text-muted">Deadline</p>
                <p className={`text-sm font-semibold ${deadlinePassed ? 'text-red-600' : 'text-text-primary'}`}>
                  {formatDate(quiz.deadline)}
                  {deadlinePassed && ' (Expired)'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Progress */}
      <Card>
        <CardHeader>
          <CardTitle>My Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{quiz.my_attempts}</p>
              <p className="text-sm text-text-muted">Attempts Used</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {quiz.my_best_score !== null ? quiz.my_best_score : 'N/A'}
              </p>
              <p className="text-sm text-text-muted">Best Score</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{attemptsRemaining}</p>
              <p className="text-sm text-text-muted">Attempts Remaining</p>
            </div>
          </div>

          {!canStart && (
            <div className="mt-4">
              {deadlinePassed && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <XCircle className="w-5 h-5" />
                  <span>This quiz deadline has passed. You can no longer attempt it.</span>
                </div>
              )}
              {attemptsRemaining === 0 && !deadlinePassed && (
                <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>You have used all your attempts for this quiz.</span>
                </div>
              )}
              {quiz.last_attempt_status === 'in_progress' && (
                <div className="flex items-center gap-2 text-blue-600 text-sm bg-blue-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>You have an attempt in progress. Please complete it first.</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Attempts */}
      {attempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attempts.map((attempt) => {
                const percentage = parseFloat(getScorePercentage(attempt.score, attempt.total_marks));
                const passed = percentage >= quiz.passing_score;

                return (
                  <div
                    key={attempt.id}
                    className={`p-4 rounded-lg border-2 ${
                      passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          passed ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {attempt.attempt_number}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">
                            Attempt #{attempt.attempt_number}
                          </p>
                          <p className="text-xs text-text-muted">
                            {attempt.completed_at ? formatDate(attempt.completed_at) : 'In Progress'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-lg font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                          {attempt.score}/{attempt.total_marks}
                        </p>
                        <p className="text-sm text-text-muted">
                          {percentage}% • {formatTime(attempt.time_taken_seconds)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {passed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
                        {passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      {canStart && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => router.push(`/student/quizzes/${quizId}/attempt`)}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Quiz Attempt
          </Button>
        </div>
      )}
    </div>
  );
}