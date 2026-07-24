'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Clock, AlertCircle, CheckCircle, Upload, ClipboardList } from 'lucide-react';

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
  my_feedback: string | null;
  graded_at: string | null;
  submitted_at: string | null;
  assigned_at: string;
  allow_late_submission: boolean;
  allow_resubmission: boolean;
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
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
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E3A5F]">Assignments</h1>
          <p className="text-xs sm:text-sm text-[#78909C] mt-1">View and submit your assignments</p>
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
          onClick={() => setFilter('submitted')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'submitted'
              ? 'border-[#1E88E5] text-[#1E88E5]'
              : 'border-transparent text-[#78909C] hover:text-[#1E3A5F]'
          }`}
        >
          Submitted
        </button>
      </div>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ClipboardList className="size-16 text-[#E0E0E0] mx-auto mb-4" />
            <p className="text-[#78909C] text-lg mb-2">No assignments found</p>
            <p className="text-sm text-[#B0BEC5]">
              {filter === 'pending' && 'You have no pending assignments'}
              {filter === 'submitted' && 'You haven\'t submitted any assignments yet'}
              {filter === 'all' && 'No assignments available at the moment'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAssignments.map((assignment) => {
            const overdue = isOverdue(assignment.due_date);
            const canSubmit = !overdue || assignment.allow_late_submission;
            const isGraded = assignment.my_score !== null && assignment.my_score !== undefined;
            const canResubmit = canSubmit && assignment.allow_resubmission && !isGraded;

            return (
              <Card key={assignment.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1E3A5F] mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-[#78909C] mb-3">{assignment.description}</p>

                      <div className="flex flex-wrap gap-2 text-xs mb-3">
                        <span className="bg-[#F5F5F5] text-[#1E3A5F] px-2 py-1 rounded">{assignment.course_title}</span>
                        <span className="bg-[#E3F2FD] text-[#1E88E5] px-2 py-1 rounded flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {assignment.max_score} Points
                        </span>
                        {assignment.due_date && (
                          <span
                            className={`px-2 py-1 rounded flex items-center gap-1 ${
                              overdue
                                ? 'bg-[#FFEBEE] text-[#C62828]'
                                : 'bg-[#FFF3E0] text-[#F57C00]'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {overdue ? 'Overdue' : `Due: ${formatDate(assignment.due_date)}`}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-[#78909C]">Submissions: </span>
                          <span className="font-semibold text-[#1E3A5F]">
                            {assignment.my_submissions}
                          </span>
                        </div>
                        {assignment.my_score !== null && (
                          <div>
                            <span className="text-[#78909C]">Score: </span>
                            <span className="font-semibold text-[#4CAF50]">
                              {assignment.my_score}/{assignment.max_score} ({Math.round((assignment.my_score / assignment.max_score) * 100)}%)
                            </span>
                          </div>
                        )}
                        {assignment.my_status && (
                          <div>
                            <span className="text-[#78909C]">Status: </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                              assignment.my_status === 'graded' ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#E3F2FD] text-[#1E88E5]'
                            }`}>
                              {assignment.my_status === 'graded' && <CheckCircle className="w-3 h-3" />}
                              {assignment.my_status.charAt(0).toUpperCase() + assignment.my_status.slice(1)}
                            </span>
                          </div>
                        )}
                        {assignment.graded_at && (
                          <div>
                            <span className="text-[#78909C]">Graded: </span>
                            <span className="font-medium text-[#1E3A5F]">
                              {formatDate(assignment.graded_at)}
                            </span>
                          </div>
                        )}
                      </div>

                      {assignment.my_feedback && (
                        <div className="mt-3 p-3 bg-[#E8F5E9] border border-[#4CAF50] rounded-lg">
                          <div className="text-xs font-semibold text-[#2E7D32] mb-1">Instructor Feedback:</div>
                          <p className="text-sm text-[#1E3A5F]">{assignment.my_feedback}</p>
                        </div>
                      )}

                      {overdue && !assignment.allow_late_submission && (
                        <div className="mt-3 flex items-center gap-2 text-[#C62828] text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Deadline has passed. Late submissions not allowed.</span>
                        </div>
                      )}

                      {isGraded && assignment.allow_resubmission && (
                        <div className="mt-3 flex items-center gap-2 text-[#1E88E5] text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Assignment graded and locked. Resubmission not allowed.</span>
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
                      {!canSubmit && assignment.my_submissions === 0 && (
                        <Button disabled title="Deadline has passed">
                          <Upload className="w-4 h-4 mr-2" />
                          Submit
                        </Button>
                      )}
                      {canResubmit && (
                        <Button 
                          onClick={() => router.push(`/student/assignments/${assignment.id}/submit`)}
                          variant="outline"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Resubmit
                        </Button>
                      )}
                      {assignment.my_submissions > 0 && assignment.allow_resubmission && !canResubmit && (
                        <Button 
                          disabled
                          variant="outline"
                          title={isGraded ? "Assignment graded and locked" : "Deadline has passed"}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Resubmit
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
