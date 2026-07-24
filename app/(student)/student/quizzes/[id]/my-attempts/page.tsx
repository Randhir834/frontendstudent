'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, CheckCircle, XCircle, Clock, Award } from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  course_title: string;
  total_marks: number;
  passing_score: number;
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

export default function StudentMyAttemptsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = (params?.id as string) || '';

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const fetchData = async () => {
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

      if (!attemptsResponse.ok) throw new Error('Failed to fetch attempts');

      const attemptsData = await attemptsResponse.json();
      const quizAttempts = attemptsData.attempts?.filter(
        (a: any) => a.quiz_id === parseInt(quizId)
      ) || [];
      setAttempts(quizAttempts);
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

  const completedAttempts = attempts.filter(a => a.status === 'completed');
  const bestScore = completedAttempts.length > 0 
    ? Math.max(...completedAttempts.map(a => a.score))
    : 0;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
            My Attempts
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {quiz.title} - {quiz.course_title}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Attempts</p>
                <p className="text-2xl font-bold text-text-primary">{attempts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Best Score</p>
                <p className="text-2xl font-bold text-text-primary">
                  {bestScore}/{quiz.total_marks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Best Percentage</p>
                <p className="text-2xl font-bold text-text-primary">
                  {completedAttempts.length > 0 
                    ? getScorePercentage(bestScore, quiz.total_marks)
                    : '0'}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attempts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted mb-4">You haven't attempted this quiz yet</p>
              <Button onClick={() => router.push(`/student/quizzes/${quizId}`)}>
                View Quiz Details
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => {
                const percentage = parseFloat(getScorePercentage(attempt.score, attempt.total_marks));
                const passed = percentage >= quiz.passing_score;
                const isCompleted = attempt.status === 'completed';

                return (
                  <div
                    key={attempt.id}
                    className={`p-4 rounded-lg border-2 ${
                      !isCompleted
                        ? 'border-blue-200 bg-blue-50'
                        : passed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          !isCompleted
                            ? 'bg-blue-600'
                            : passed 
                            ? 'bg-green-600' 
                            : 'bg-red-600'
                        }`}>
                          {attempt.attempt_number}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-text-primary">
                            Attempt #{attempt.attempt_number}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-text-muted mt-1">
                            <span>Started: {formatDate(attempt.started_at)}</span>
                            {attempt.completed_at && (
                              <span>Completed: {formatDate(attempt.completed_at)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {isCompleted ? (
                          <>
                            <p className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                              {attempt.score}/{attempt.total_marks}
                            </p>
                            <p className="text-sm text-text-muted">
                              {percentage}% • {formatTime(attempt.time_taken_seconds)}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-semibold text-blue-600">In Progress</p>
                        )}
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {passed ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-green-600">Passed</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Failed</span>
                            </>
                          )}
                          <span className="text-sm text-text-muted ml-2">
                            (Required: {quiz.passing_score}%)
                          </span>
                        </div>

                        {attempt.score === bestScore && completedAttempts.length > 1 && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                            Best Score
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      {completedAttempts.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-text-primary mb-3">Score Progression</h4>
                <div className="space-y-2">
                  {completedAttempts.map((attempt, index) => {
                    const percentage = parseFloat(getScorePercentage(attempt.score, attempt.total_marks));
                    const prevPercentage = index > 0 
                      ? parseFloat(getScorePercentage(completedAttempts[index - 1].score, completedAttempts[index - 1].total_marks))
                      : 0;
                    const improvement = index > 0 ? percentage - prevPercentage : 0;

                    return (
                      <div key={attempt.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-text-primary">Attempt {attempt.attempt_number}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-text-primary">{percentage}%</span>
                          {index > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              improvement > 0 
                                ? 'bg-green-100 text-green-700' 
                                : improvement < 0
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-3">Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">Average Score:</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {(completedAttempts.reduce((sum, a) => sum + a.score, 0) / completedAttempts.length).toFixed(1)}/{quiz.total_marks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">Average Time:</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {formatTime(
                        Math.round(
                          completedAttempts
                            .filter(a => a.time_taken_seconds)
                            .reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0) / 
                          completedAttempts.filter(a => a.time_taken_seconds).length
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">Pass Rate:</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {((completedAttempts.filter(a => 
                        parseFloat(getScorePercentage(a.score, a.total_marks)) >= quiz.passing_score
                      ).length / completedAttempts.length) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}