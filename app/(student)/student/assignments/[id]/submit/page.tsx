'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Upload,
  ArrowLeft,
  AlertCircle,
  FileText,
  X,
  Loader2,
} from 'lucide-react';
import { assignmentService } from '@/services/assignmentService';

interface Assignment {
  id: number;
  title: string;
  description: string;
  course_title: string;
  due_date: string | null;
  max_score: number;
  allow_late_submission: boolean;
  allow_resubmission: boolean;
}

export default function SubmitAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const [isAlreadyGraded, setIsAlreadyGraded] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  const checkDeadline = (assignment: Assignment) => {
    const overdue = isOverdue(assignment.due_date);
    if (overdue && !assignment.allow_late_submission) {
      setDeadlineError('The deadline for this assignment has passed. Submissions are no longer accepted.');
      return false;
    }
    setDeadlineError('');
    return true;
  };

  const checkIfGraded = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!userStr) return false;
      
      const user = JSON.parse(userStr);
      const historyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}/history/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        const submissions = historyData.history || [];
        if (submissions.length > 0) {
          const latestSubmission = submissions.find((s: any) => s.is_latest) || submissions[0];
          // Check if graded (has score or status is 'graded')
          const graded = (latestSubmission.score !== null && latestSubmission.score !== undefined) || 
                        latestSubmission.status === 'graded';
          setIsAlreadyGraded(graded);
          if (graded) {
            setDeadlineError('Cannot resubmit: This assignment has already been graded and is now locked.');
          }
          return graded;
        }
      }
      return false;
    } catch (err) {
      console.error('Failed to check grading status:', err);
      return false;
    }
  };

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAssignment(data.assignment);
        // Check deadline immediately after fetching
        checkDeadline(data.assignment);
        // Check if already graded
        await checkIfGraded();
      } else {
        setError('Failed to load assignment');
      }
    } catch (err) {
      console.error('Failed to fetch assignment:', err);
      setError('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignment) {
      alert('Assignment not loaded');
      return;
    }

    // Check if already graded
    if (isAlreadyGraded) {
      alert('Cannot submit: This assignment has already been graded and is now locked.');
      return;
    }

    // Check deadline before submission
    if (!checkDeadline(assignment)) {
      alert('Cannot submit: The deadline for this assignment has passed.');
      return;
    }

    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('assignment_id', assignmentId);
      formData.append('file', file);
      if (notes) {
        formData.append('notes', notes);
      }

      await assignmentService.submitAssignment(parseInt(assignmentId), formData);

      alert('Assignment submitted successfully!');
      router.push(`/student/assignments/${assignmentId}`);
    } catch (err: any) {
      console.error('Failed to submit assignment:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to submit assignment';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="text-center py-8">Loading...</div>
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

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/student/assignments/${assignmentId}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assignment
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F]">Submit Assignment</h1>
        <p className="text-sm text-[#78909C] mt-2">{assignment.title}</p>
      </div>

      {/* Assignment Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-[#78909C]">{assignment.course_title}</p>
              <p className="text-lg font-semibold text-[#1E3A5F] mt-1">{assignment.title}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <span className="text-sm text-[#78909C]">Max Score</span>
              <span className="text-lg font-semibold text-[#1E88E5]">
                {assignment.max_score} Points
              </span>
            </div>
          </div>
          {assignment.due_date && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-[#78909C]">
                Due: {formatDate(assignment.due_date)}
              </p>
              {isOverdue(assignment.due_date) && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  ⚠ This assignment is overdue
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deadline Warning */}
      {deadlineError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <AlertCircle className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 mb-1">Submission Not Allowed</p>
            <p className="text-sm text-red-600">{deadlineError}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => router.push(`/student/assignments/${assignmentId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assignment
            </Button>
          </div>
        </div>
      )}

      {/* Submission Form */}
      {!deadlineError && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Work</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Assignment File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-[#E0E0E0] rounded-lg p-6">
                {!file ? (
                  <div className="text-center">
                    <Upload className="mx-auto size-12 text-[#78909C] mb-3" />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-[#1E88E5] hover:text-[#1565C0] font-medium"
                    >
                      Click to upload
                    </label>
                    <p className="text-xs text-[#78909C] mt-1">
                      PDF, DOC, DOCX, or ZIP (max 10MB)
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.zip"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-[#1E88E5]" />
                      <div>
                        <p className="text-sm font-medium text-[#1E3A5F]">{file.name}</p>
                        <p className="text-xs text-[#78909C]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-[#78909C] hover:text-red-600"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-[#1E3A5F] mb-2"
              >
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/student/assignments/${assignmentId}`)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!file || submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Assignment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}

      {/* Guidelines */}
      {!deadlineError && (
        <Card>
        <CardHeader>
          <CardTitle>Submission Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-[#78909C]">
            <li className="flex items-start gap-2">
              <span className="text-[#1E88E5] font-bold">•</span>
              <span>Ensure your file is properly named and contains all required work</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1E88E5] font-bold">•</span>
              <span>Maximum file size is 10MB</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1E88E5] font-bold">•</span>
              <span>Accepted formats: PDF, DOC, DOCX, ZIP</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1E88E5] font-bold">•</span>
              <span>Once submitted, you cannot modify your submission</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1E88E5] font-bold">•</span>
              <span>Late submissions may not be accepted depending on instructor policy</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
