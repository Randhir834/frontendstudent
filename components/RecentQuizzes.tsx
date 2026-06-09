'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileQuestion, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { quizService } from '@/services/quizService';
import type { QuizAttempt } from '@/types';

export default function RecentQuizzes() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await quizService.getMyAttempts();
        // Get only the 3 most recent completed attempts
        const recent = (data.attempts || [])
          .filter((attempt: QuizAttempt) => attempt.status === 'completed')
          .slice(0, 3);
        setAttempts(recent);
        setError('');
      } catch (err: any) {
        console.error('Failed to fetch quizzes:', err);
        // Only show error if it's a genuine error (not 404 or empty response)
        if (err.response?.status && err.response.status !== 404) {
          setError('Failed to load quizzes');
        }
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getScorePercentage = (score: number, totalMarks: number) => {
    if (totalMarks === 0) return 0;
    return Math.round((score / totalMarks) * 100);
  };

  const getScoreBadge = (score: number, totalMarks: number) => {
    const percentage = getScorePercentage(score, totalMarks);
    
    if (percentage >= 80) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700">
          <CheckCircle2 className="size-3" />
          Excellent
        </span>
      );
    } else if (percentage >= 60) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">
          <CheckCircle2 className="size-3" />
          Good
        </span>
      );
    } else if (percentage >= 40) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">
          <AlertCircle className="size-3" />
          Fair
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-700">
          <XCircle className="size-3" />
          Needs Work
        </span>
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-[#1E88E5]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (attempts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileQuestion className="size-10 text-[#E0E0E0] mx-auto mb-3" />
            <p className="text-sm text-[#78909C] mb-4">
              No quizzes assigned yet
            </p>
            <Link href="/student/quizzes">
              <Button variant="outline" size="sm">
                View Quizzes
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Quizzes</CardTitle>
          <Link href="/student/quizzes">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attempts.map((attempt) => {
            const percentage = getScorePercentage(attempt.score, attempt.total_marks);

            return (
              <div
                key={attempt.id}
                className="p-4 border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#1E3A5F] truncate">
                      {attempt.quiz_title}
                    </h4>
                    <p className="text-xs text-[#78909C] mt-1">
                      {attempt.course_title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#78909C]">
                      <Clock className="size-3" />
                      Completed: {formatDate(attempt.completed_at || attempt.created_at)}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-sm font-medium text-[#1E88E5]">
                        Score: {attempt.score}/{attempt.total_marks}
                      </span>
                      <span className="text-sm font-medium text-[#78909C]">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {getScoreBadge(attempt.score, attempt.total_marks)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
