'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Play, Clock, Award, AlertCircle, CheckCircle, XCircle, FileQuestion } from 'lucide-react';

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
  assigned_at: string;
}

export default function StudentQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setQuizzes([]);
        return;
      }

      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (err: any) {
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (filter === 'pending') return quiz.my_attempts === 0;
    if (filter === 'completed') return quiz.my_attempts > 0;
    return true;
  });

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
          Quizzes / Tests
        </h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E3A5F]">
            Quizzes / Tests
          </h1>
          <p className="text-xs sm:text-sm text-[#78909C] mt-1">
            Test your knowledge and track your performance
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#E0E0E0]">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-[#1E88E5] text-[#1E88E5]'
              : 'border-transparent text-[#78909C] hover:text-[#1E3A5F]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'pending'
              ? 'border-[#1E88E5] text-[#1E88E5]'
              : 'border-transparent text-[#78909C] hover:text-[#1E3A5F]'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'completed'
              ? 'border-[#1E88E5] text-[#1E88E5]'
              : 'border-transparent text-[#78909C] hover:text-[#1E3A5F]'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Quiz List */}
      {filteredQuizzes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileQuestion className="size-16 text-[#E0E0E0] mx-auto mb-4" />
            <p className="text-[#78909C] text-lg mb-2">No quizzes found</p>
            <p className="text-sm text-[#B0BEC5]">
              {filter === 'pending' && 'You have no pending quizzes'}
              {filter === 'completed' && 'You haven\'t completed any quizzes yet'}
              {filter === 'all' && 'No quizzes available at the moment'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredQuizzes.map((quiz) => {
            const deadlinePassed = isDeadlinePassed(quiz.deadline);
            const attemptsRemaining = quiz.max_attempts - quiz.my_attempts;
            const canStart = canAttempt(quiz);

            return (
              <Card key={quiz.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1E3A5F] mb-1">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-[#78909C] mb-3">{quiz.description}</p>

                      <div className="flex flex-wrap gap-2 text-xs mb-3">
                        <span className="bg-[#F5F5F5] text-[#1E3A5F] px-2 py-1 rounded">{quiz.course_title}</span>
                        <span className="bg-[#E3F2FD] text-[#1E88E5] px-2 py-1 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {quiz.time_limit_minutes} min
                        </span>
                        <span className="bg-[#F3E5F5] text-[#7B1FA2] px-2 py-1 rounded flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {quiz.total_marks} marks
                        </span>
                        <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded">
                          Pass: {quiz.passing_score}%
                        </span>
                        {quiz.deadline && (
                          <span
                            className={`px-2 py-1 rounded flex items-center gap-1 ${
                              deadlinePassed
                                ? 'bg-[#FFEBEE] text-[#C62828]'
                                : 'bg-[#FFF3E0] text-[#F57C00]'
                            }`}
                          >
                            <AlertCircle className="w-3 h-3" />
                            {deadlinePassed ? 'Expired' : `Due: ${formatDate(quiz.deadline)}`}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-[#78909C]">Attempts: </span>
                          <span className="font-semibold text-[#1E3A5F]">
                            {quiz.my_attempts}/{quiz.max_attempts}
                          </span>
                        </div>
                        {quiz.my_best_score !== null && (
                          <div>
                            <span className="text-[#78909C]">Best Score: </span>
                            <span className="font-semibold text-[#4CAF50]">
                              {quiz.my_best_score}/{quiz.total_marks}
                            </span>
                          </div>
                        )}
                      </div>

                      {!canStart && (
                        <div className="mt-3">
                          {deadlinePassed && (
                            <div className="flex items-center gap-2 text-[#C62828] text-sm">
                              <XCircle className="w-4 h-4" />
                              <span>Deadline has passed</span>
                            </div>
                          )}
                          {attemptsRemaining === 0 && !deadlinePassed && (
                            <div className="flex items-center gap-2 text-[#F57C00] text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>Maximum attempts reached</span>
                            </div>
                          )}
                          {quiz.last_attempt_status === 'in_progress' && (
                            <div className="flex items-center gap-2 text-[#1E88E5] text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>You have an attempt in progress</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {canStart ? (
                        <Button onClick={() => router.push(`/student/quizzes/${quiz.id}/attempt`)}>
                          <Play className="w-4 h-4 mr-2" />
                          Start Quiz
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/student/quizzes/${quiz.id}`)}
                        >
                          View Details
                        </Button>
                      )}
                      {quiz.my_attempts > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/student/quizzes/${quiz.id}/my-attempts`)}
                        >
                          View My Attempts
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
