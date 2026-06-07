'use client';

import { useEffect, useState, Suspense } from 'react';
import { Calendar, Clock, Users, Loader2, ExternalLink, AlertCircle, BookOpen } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StudentDashboardLayout from '@/components/layouts/StudentDashboardLayout';
import { liveClassService } from '@/services/liveClassService';
import Link from 'next/link';
import type { LiveClass } from '@/types';

function StudentLiveClassesContent() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        setLoading(true);
        const data = await liveClassService.getLiveClasses();
        setClasses(data.liveClasses || []);
        setError('');
      } catch (err) {
        console.error('Failed to fetch live classes:', err);
        setError('Failed to load live classes');
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClasses();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeUntilClass = (scheduledAt: string) => {
    const now = new Date();
    const classTime = new Date(scheduledAt);
    const diff = classTime.getTime() - now.getTime();

    if (diff < 0) return 'Class ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `In ${days} day${days > 1 ? 's' : ''}`;
    }

    if (hours > 0) {
      return `In ${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `In ${minutes} minutes`;
    }

    return 'Starting now!';
  };

  return (
    <StudentDashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E3A5F]">Live Classes</h1>
            <p className="text-xs sm:text-sm text-[#78909C] mt-1">
              Join your scheduled live classes and interact with instructors
            </p>
          </div>

          <Link href="/student/live-classes/courses">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <BookOpen className="size-4" />
              View by Course
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
          </div>
        ) : classes.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="size-12 text-[#E0E0E0] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#1E3A5F] mb-2">
                  No upcoming live classes
                </h3>
                <p className="text-sm text-[#78909C] mb-6">
                  Enroll in courses to see upcoming live classes from your instructors.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {classes.map((liveClass) => {
              const timeUntil = getTimeUntilClass(liveClass.scheduled_at);
              const isStartingSoon = new Date(liveClass.scheduled_at).getTime() - new Date().getTime() < 15 * 60 * 1000;

              return (
                <Card
                  key={liveClass.id}
                  className={`hover:shadow-md transition-all ${
                    isStartingSoon ? 'border-[#1E88E5] border-2' : ''
                  }`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Class Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            isStartingSoon ? 'bg-[#1E88E5]/10' : 'bg-[#AB47BC]/10'
                          }`}>
                            <Calendar className={`size-5 ${
                              isStartingSoon ? 'text-[#1E88E5]' : 'text-[#AB47BC]'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-[#1E3A5F] truncate">
                              {liveClass.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#78909C] mt-1">
                              {liveClass.course_title}
                            </p>
                            {liveClass.instructor_name && (
                              <p className="text-xs sm:text-sm text-[#78909C] mt-1">
                                Instructor: {liveClass.instructor_name}
                              </p>
                            )}
                            {liveClass.description && (
                              <p className="text-xs sm:text-sm text-[#78909C] mt-2 line-clamp-2">
                                {liveClass.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Date, Time, Duration */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 text-[#78909C]">
                            <Calendar className="size-4 flex-shrink-0" />
                            <span className="truncate">{formatDateTime(liveClass.scheduled_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#78909C]">
                            <Clock className="size-4 flex-shrink-0" />
                            <span>{liveClass.duration_minutes} min</span>
                          </div>
                          <div className={`flex items-center gap-2 font-medium ${
                            isStartingSoon ? 'text-[#1E88E5]' : 'text-[#AB47BC]'
                          }`}>
                            <span className={`inline-block size-2 rounded-full ${
                              isStartingSoon ? 'bg-[#1E88E5]' : 'bg-[#AB47BC]'
                            }`} />
                            {timeUntil}
                          </div>
                        </div>
                      </div>

                      {/* Join Button */}
                      <a
                        href={liveClass.meet_link}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                          isStartingSoon
                            ? 'bg-[#1E88E5] text-white hover:bg-[#1565C0]'
                            : 'bg-[#AB47BC] text-white hover:bg-[#6d28d9]'
                        }`}
                      >
                        <ExternalLink className="size-4" />
                        <span className="hidden xs:inline">Join Now</span>
                        <span className="xs:hidden">Join</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        {classes.length > 0 && (
          <Card className="bg-[#F0F9FF] border-[#0EA5E9]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex gap-3">
                <BookOpen className="size-5 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#1E3A5F] text-sm">Tips for Live Classes</h4>
                  <ul className="text-xs sm:text-sm text-[#78909C] mt-2 space-y-1">
                    <li>• Join 5 minutes early to test your audio and video</li>
                    <li>• Keep your microphone muted unless speaking</li>
                    <li>• Use the chat to ask questions and interact</li>
                    <li>• Classes are recorded for future reference</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default function StudentLiveClassesPage() {
  return (
    <Suspense fallback={
      <StudentDashboardLayout>
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
          </div>
        </div>
      </StudentDashboardLayout>
    }>
      <StudentLiveClassesContent />
    </Suspense>
  );
}
