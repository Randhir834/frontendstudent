'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Upload,
  Award,
  Calendar,
} from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  course_id: number;
  course_title: string;
  due_date: string | null;
  max_score: number;
  created_at: string;
  instructions?: string;
  allow_late_submission: boolean;
  allow_resubmission: boolean;
}

interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  file_url?: string;
  file_name?: string;
  notes?: string;
  score?: number;
  status: 'submitted' | 'graded' | 'late';
  submitted_at: string;
  graded_at?: string;
  feedback?: string;
  version: number;
  is_latest: boolean;
  graded_by_name?: string;
}

export default function AssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentDetails();
    }
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch assignment details
      const assignmentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (assignmentRes.ok) {
        const assignmentData = await assignmentRes.json();
        setAssignment(assignmentData.assignment);

        // Fetch submission history for this specific assignment
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const historyRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}/history/${user.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (historyRes.ok) {
            const historyData = await historyRes.json();
            setSubmissions(historyData.history || []);
          }
        }
      }

      setError('');
    } catch (err) {
      console.error('Failed to fetch assignment details:', err);
      setError('Failed to load assignment details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  const canSubmitAssignment = (assignment: Assignment, hasSubmission: boolean) => {
    const overdue = isOverdue(assignment.due_date);
    
    // If there's no submission yet
    if (!hasSubmission) {
      // Can submit only if not overdue OR late submissions are allowed
      return !overdue || assignment.allow_late_submission;
    }
    
    // If there's already a submission
    // Can resubmit only if resubmission is allowed AND (not overdue OR late submissions are allowed)
    return assignment.allow_resubmission && (!overdue || assignment.allow_late_submission);
  };

  const isGraded = (latestSubmission: Submission | null) => {
    if (!latestSubmission) return false;
    // Check if submission has been graded (has a score or status is 'graded')
    return (latestSubmission.score !== null && latestSubmission.score !== undefined) || 
           latestSubmission.status === 'graded';
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="text-center py-8">Loading assignment details...</div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700">{error || 'Assignment not found'}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => router.push('/student/assignments')}
            >
              Back to Assignments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const overdue = isOverdue(assignment.due_date);
  const hasSubmission = submissions.length > 0;
  const latestSubmission = hasSubmission ? submissions.find(s => s.is_latest) || submissions[0] : null;
  const submissionIsGraded = isGraded(latestSubmission);
  const canSubmit = canSubmitAssignment(assignment, hasSubmission);
  const canResubmit = hasSubmission && canSubmit && !submissionIsGraded;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F]">{assignment.title}</h1>
        <p className="text-sm text-[#78909C] mt-2">{assignment.course_title}</p>
      </div>

      {/* Assignment Details Card */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Assignment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100">
              <Award className="size-5 text-[#1E88E5] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#78909C] font-medium">Max Score</p>
                <p className="text-xl font-bold text-[#1E3A5F]">{assignment.max_score} Points</p>
              </div>
            </div>

            {assignment.due_date && (
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                <Calendar className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#78909C] font-medium">Due Date</p>
                  <p className="text-sm font-semibold text-[#1E3A5F]">
                    {formatDate(assignment.due_date)}
                  </p>
                  {overdue && (
                    <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded mt-1 inline-block">Overdue</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
              <FileText className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#78909C] font-medium">Status</p>
                <p className="text-sm font-semibold text-[#1E3A5F]">
                  {hasSubmission ? 'Submitted' : 'Not Submitted'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-base font-semibold text-[#1E3A5F] mb-3">Description</h3>
            <p className="text-sm text-[#546E7A] whitespace-pre-wrap leading-relaxed">{assignment.description}</p>
          </div>

          {assignment.instructions && (
            <div className="pt-2">
              <h3 className="text-base font-semibold text-[#1E3A5F] mb-3">Instructions</h3>
              <p className="text-sm text-[#546E7A] whitespace-pre-wrap leading-relaxed">
                {assignment.instructions}
              </p>
            </div>
          )}

          {overdue && !assignment.allow_late_submission && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl border border-red-200">
              <AlertCircle className="size-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">
                The deadline has passed. Submissions are no longer accepted for this assignment.
              </p>
            </div>
          )}

          {overdue && assignment.allow_late_submission && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
              <AlertCircle className="size-5 text-orange-600 flex-shrink-0" />
              <p className="text-sm text-orange-700 font-medium">
                This assignment is past due, but late submissions are still accepted.
              </p>
            </div>
          )}

          {canSubmit && !hasSubmission && (
            <div className="flex justify-end pt-2">
              <Button onClick={() => router.push(`/student/assignments/${assignmentId}/submit`)} className="shadow-sm">
                <Upload className="w-4 h-4 mr-2" />
                Submit Assignment
              </Button>
            </div>
          )}

          {canResubmit && (
            <div className="flex justify-end pt-2">
              <Button onClick={() => router.push(`/student/assignments/${assignmentId}/submit`)} className="shadow-sm">
                <Upload className="w-4 h-4 mr-2" />
                Resubmit Assignment
              </Button>
            </div>
          )}

          {hasSubmission && assignment.allow_resubmission && submissionIsGraded && (
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
              <CheckCircle className="size-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-700 font-semibold">
                Resubmission disabled - this assignment has been graded and is now locked
              </p>
            </div>
          )}

          {!canSubmit && !hasSubmission && overdue && (
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
              <AlertCircle className="size-5 text-gray-600 flex-shrink-0" />
              <p className="text-sm text-gray-700 font-semibold">
                Submission disabled - deadline has expired
              </p>
            </div>
          )}

          {!canSubmit && hasSubmission && overdue && assignment.allow_resubmission && !submissionIsGraded && (
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
              <AlertCircle className="size-5 text-gray-600 flex-shrink-0" />
              <p className="text-sm text-gray-700 font-semibold">
                Resubmission disabled - deadline has expired
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Submission */}
      {hasSubmission && latestSubmission && (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Your Latest Submission</CardTitle>
              {submissions.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Hide' : 'View'} History
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${
                      latestSubmission.status === 'graded'
                        ? 'bg-green-100 text-green-700'
                        : latestSubmission.status === 'late'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {latestSubmission.status === 'graded' ? (
                      <CheckCircle className="size-3.5" />
                    ) : (
                      <Clock className="size-3.5" />
                    )}
                    {latestSubmission.status.charAt(0).toUpperCase() + latestSubmission.status.slice(1)}
                  </span>
                  {submissions.length > 1 && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-semibold">
                      Version {latestSubmission.version}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#78909C] font-medium">
                  Submitted on {formatDate(latestSubmission.submitted_at)}
                </p>
              </div>

              {latestSubmission.notes && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-xs font-semibold text-[#78909C] mb-1.5">Your Notes:</p>
                  <p className="text-sm text-[#1E3A5F]">{latestSubmission.notes}</p>
                </div>
              )}

              {latestSubmission.file_url && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-xs font-semibold text-[#78909C] mb-1.5">Submitted File:</p>
                  <a
                    href={latestSubmission.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#1E88E5] hover:text-[#1565C0] font-medium inline-flex items-center gap-1.5 hover:underline"
                  >
                    <FileText className="size-4" />
                    {latestSubmission.file_name || 'View File'}
                  </a>
                </div>
              )}

              {/* Grading Information */}
              {latestSubmission.score !== undefined && latestSubmission.score !== null && (
                <div className="p-5 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-sm border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-green-800">Grade</h4>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-700">
                        {latestSubmission.score}/{assignment.max_score}
                      </div>
                      <div className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">
                        {Math.round((latestSubmission.score / assignment.max_score) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  {latestSubmission.feedback && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="text-xs font-bold text-green-800 mb-2">Instructor Feedback:</p>
                      <p className="text-sm text-[#1E3A5F] leading-relaxed whitespace-pre-wrap bg-white rounded-lg p-3">{latestSubmission.feedback}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-green-200 flex items-center justify-between text-xs text-green-700 font-medium">
                    <span>
                      Graded on {latestSubmission.graded_at && formatDate(latestSubmission.graded_at)}
                    </span>
                    {latestSubmission.graded_by_name && (
                      <span>by {latestSubmission.graded_by_name}</span>
                    )}
                  </div>
                </div>
              )}

              {/* No grade yet message */}
              {latestSubmission.status === 'submitted' && (latestSubmission.score === undefined || latestSubmission.score === null) && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Clock className="size-5 text-blue-600" />
                    <p className="text-sm text-blue-700 font-medium">
                      Your submission is awaiting grading from the instructor.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission History */}
      {showHistory && submissions.length > 1 && (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl">Submission History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissions
                .filter(s => !s.is_latest)
                .map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-semibold">
                          Version {submission.version}
                        </span>
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                            submission.status === 'graded'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#78909C] font-medium">
                        {formatDate(submission.submitted_at)}
                      </p>
                    </div>

                    {submission.file_url && (
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#1E88E5] hover:text-[#1565C0] font-medium inline-flex items-center gap-1.5 hover:underline"
                      >
                        <FileText className="size-4" />
                        {submission.file_name || 'View File'}
                      </a>
                    )}

                    {submission.score !== undefined && submission.score !== null && (
                      <div className="mt-3 text-sm">
                        <span className="text-[#78909C] font-medium">Score: </span>
                        <span className="font-bold text-green-700">
                          {submission.score}/{assignment.max_score}
                        </span>
                        <span className="text-xs ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          {Math.round((submission.score / assignment.max_score) * 100)}%
                        </span>
                      </div>
                    )}

                    {submission.feedback && (
                      <div className="mt-3 p-3 bg-white rounded-lg text-sm shadow-sm">
                        <span className="text-[#78909C] font-semibold">Feedback: </span>
                        <span className="text-[#1E3A5F]">{submission.feedback}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
