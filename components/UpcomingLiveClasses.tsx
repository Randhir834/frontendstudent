'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, Loader2, AlertCircle, PlayCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { liveClassService } from '@/services/liveClassService';
import type { LiveClass } from '@/types';

export default function UpcomingLiveClasses() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLiveClasses();

    // Auto-refresh every 30 seconds to update class statuses
    const interval = setInterval(() => {
      fetchLiveClasses();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const data = await liveClassService.getLiveClasses();
      const allClasses = data.liveClasses || [];
      
      // Filter classes that are not yet completed (upcoming or ongoing)
      const activeClasses = allClasses.filter((liveClass: LiveClass) => 
        !liveClassService.isCompleted(liveClass.scheduled_at, liveClass.duration_minutes)
      );

      // Sort: ongoing classes first, then by scheduled time
      const sortedClasses = activeClasses.sort((a: LiveClass, b: LiveClass) => {
        const aIsOngoing = liveClassService.isOngoing(a.scheduled_at, a.duration_minutes);
        const bIsOngoing = liveClassService.isOngoing(b.scheduled_at, b.duration_minutes);

        // Ongoing classes come first
        if (aIsOngoing && !bIsOngoing) return -1;
        if (!aIsOngoing && bIsOngoing) return 1;

        // For same status, sort by scheduled time (earliest first)
        return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
      });

      // Get only the top 3 classes
      const topClasses = sortedClasses.slice(0, 3);
      setClasses(topClasses);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch live classes:', err);
      
      // Don't show error for 404 (not found) - just show empty state
      // Don't show error for 401 (unauthorized) - user may not be logged in
      // Only show error for actual server errors (500+) or network errors
      const status = err.response?.status;
      if (!status || status >= 500) {
        // Genuine server error or network error
        setError('Failed to load live classes');
      } else {
        // 404, 401, or other client errors - just show empty state
        setError('');
      }
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
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

    if (diff < 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `In ${days}d`;
    }

    if (hours > 0) {
      return `In ${hours}h`;
    }

    return `In ${minutes}m`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Live Classes</CardTitle>
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
          <CardTitle>Upcoming Live Classes</CardTitle>
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

  if (classes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Live Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="size-10 text-[#E0E0E0] mx-auto mb-3" />
            <p className="text-sm text-[#78909C] mb-4">
              No upcoming live classes. Enroll in courses to see live sessions.
            </p>
            <Link href="/student/courses">
              <Button variant="outline" size="sm">
                Browse Courses
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
          <CardTitle>Upcoming Live Classes</CardTitle>
          <Link href="/student/live-classes">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classes.map((liveClass) => {
            const isOngoing = liveClassService.isOngoing(liveClass.scheduled_at, liveClass.duration_minutes);
            const isStartingSoon = liveClassService.isStartingSoon(liveClass.scheduled_at);
            const timeUntil = getTimeUntilClass(liveClass.scheduled_at);

            return (
              <div
                key={liveClass.id}
                className={`p-4 border rounded-lg transition-all ${
                  isOngoing
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg shadow-green-500/20'
                    : isStartingSoon
                    ? 'border-[#1E88E5] bg-[#F1F8E9]'
                    : 'border-[#E0E0E0] hover:border-[#1E88E5]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-[#1E3A5F] truncate">
                        {liveClass.title}
                      </h4>
                      {isOngoing && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full bg-green-500 text-white animate-pulse">
                          <PlayCircle className="size-3" />
                          LIVE NOW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#78909C] mt-1">
                      {liveClass.course_title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#78909C]">
                      <Calendar className="size-3" />
                      {formatDateTime(liveClass.scheduled_at)}
                      <Clock className="size-3 ml-2" />
                      {liveClass.duration_minutes} min
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {!isOngoing && timeUntil && (
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        isStartingSoon
                          ? 'bg-[#1E88E5] text-white'
                          : 'bg-[#E0E0E0] text-[#78909C]'
                      }`}>
                        {timeUntil}
                      </span>
                    )}
                    <a
                      href={liveClass.meet_link}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        isOngoing
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'text-[#1E88E5] hover:text-[#1565C0] hover:bg-blue-50'
                      }`}
                    >
                      {isOngoing ? (
                        <>
                          <PlayCircle className="size-3" />
                          Join Now
                        </>
                      ) : (
                        <>
                          <ExternalLink className="size-3" />
                          Join
                        </>
                      )}
                    </a>
                  </div>
                </div>
                {isOngoing && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-700 font-medium">
                      🔴 Class is in progress! Join now to participate.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
