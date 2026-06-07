'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Clock, AlertCircle, CheckCircle, Upload } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  course_title: string;
  due_date: string | null;
  max_score: number;
  my_submissions: number;
  my_score: number | null;
  my_status: string | null;
  assigned_at: string;
  allow_late_submission: boolean;
}

export default function StudentAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setAssignments([]);
        return;
      }

      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (err: any) {
      setAssignments([]);
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

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === 'pending') return assignment.my_submissions === 0;
    if (filter === 'submitted') return assignment.my_submissions > 0;
    return true;
  });

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">Assignments</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">Assignments</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">View and submit your assignments</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          All ({assignments.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'pending'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Pending ({assignments.filter((a) => a.my_submissions === 0).length})
        </button>
        <button
          onClick={() => setFilter('submitted')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'submitted'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Submitted ({assignments.filter((a) => a.my_submissions > 0).length})
        </button>
      </div>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-text-muted">No assignments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAssignments.map((assignment) => {
            const overdue = isOverdue(assignment.due_date);
            const canSubmit = !overdue || assignment.allow_late_submission;

            return (
              <Card key={assignment.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-text-muted mb-3">{assignment.description}</p>

                      <div className="flex flex-wrap gap-2 text-xs mb-3">
                        <span className="bg-gray-100 px-2 py-1 rounded">{assignment.course_title}</span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {assignment.max_score} Points
                        </span>
                        {assignment.due_date && (
                          <span
                            className={`px-2 py-1 rounded flex items-center gap-1 ${
                              overdue
                                ? 'bg-red-100 text-red-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {overdue ? 'Overdue' : `Due: ${formatDate(assignment.due_date)}`}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-text-muted">Submissions: </span>
                          <span className="font-semibold text-text-primary">
                            {assignment.my_submissions}
                          </span>
                        </div>
                        {assignment.my_score !== null && (
                          <div>
                            <span className="text-text-muted">Score: </span>
                            <span className="font-semibold text-green-600">
                              {assignment.my_score}/{assignment.max_score}
                            </span>
                          </div>
                        )}
                        {assignment.my_status && (
                          <div>
                            <span className="text-text-muted">Status: </span>
                            <span className={`font-semibold ${
                              assignment.my_status === 'graded' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {assignment.my_status}
                            </span>
                          </div>
                        )}
                      </div>

                      {overdue && !assignment.allow_late_submission && (
                        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Deadline has passed. Late submissions not allowed.</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => router.push(`/student/assignments/${assignment.id}`)}
                        variant="outline"
                      >
                        View Details
                      </Button>
                      {canSubmit && assignment.my_submissions === 0 && (
                        <Button onClick={() => router.push(`/student/assignments/${assignment.id}/submit`)}>
                          <Upload className="w-4 h-4 mr-2" />
                          Submit
                        </Button>
                      )}
                      {assignment.my_submissions > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/student/assignments/${assignment.id}/submissions`)}
                        >
                          View Submissions
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
