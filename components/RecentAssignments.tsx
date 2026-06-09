'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { assignmentService } from '@/services/assignmentService';
import type { AssignmentSubmission } from '@/types';

export default function RecentAssignments() {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await assignmentService.getMySubmissions();
        // Get only the 3 most recent submissions
        const recent = (data.submissions || []).slice(0, 3);
        setSubmissions(recent);
        setError('');
      } catch (err: any) {
        console.error('Failed to fetch assignments:', err);
        // Only show error if it's a genuine error (not 404 or empty response)
        if (err.response?.status && err.response.status !== 404) {
          setError('Failed to load assignments');
        }
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700">
            <CheckCircle2 className="size-3" />
            Graded
          </span>
        );
      case 'submitted':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">
            <Clock className="size-3" />
            Submitted
          </span>
        );
      case 'late':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">
            <AlertCircle className="size-3" />
            Late
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
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
          <CardTitle>Recent Assignments</CardTitle>
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

  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ClipboardList className="size-10 text-[#E0E0E0] mx-auto mb-3" />
            <p className="text-sm text-[#78909C] mb-4">
              No assignments assigned yet
            </p>
            <Link href="/student/assignments">
              <Button variant="outline" size="sm">
                View Assignments
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
          <CardTitle>Recent Assignments</CardTitle>
          <Link href="/student/assignments">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#1E3A5F] truncate">
                    {submission.assignment_title}
                  </h4>
                  <p className="text-xs text-[#78909C] mt-1">
                    {submission.course_title}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#78909C]">
                    <Clock className="size-3" />
                    Submitted: {formatDate(submission.submitted_at)}
                  </div>
                  {submission.score !== null && submission.score !== undefined && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-[#1E88E5]">
                        Score: {submission.score}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {getStatusBadge(submission.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
