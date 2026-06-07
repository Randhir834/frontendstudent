'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { liveClassService } from '@/services/liveClassService';
import type { LiveClass } from '@/types';

interface CourseLiveClassesProps {
  courseId: number;
}

export default function CourseLiveClasses({ courseId }: CourseLiveClassesProps) {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        setLoading(true);
        const data = await liveClassService.getLiveClasses(courseId);
        // Filter for upcoming classes only
        const upcomingClasses = (data.liveClasses || []).filter(
          (lc: LiveClass) => new Date(lc.scheduled_at) > new Date()
        );
        setLiveClasses(upcomingClasses);
        setError('');
      } catch (err) {
        console.error('Failed to fetch live classes:', err);
        setError('Failed to load live classes');
        setLiveClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClasses();
  }, [courseId]);

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

  const isStartingSoon = (scheduledAt: string) => {
    const now = new Date();
    const classTime = new Date(scheduledAt);
    const diff = classTime.getTime() - now.getTime();
    return diff > 0 && diff < 15 * 60 * 1000; // Within 15 minutes
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
          <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-lg flex items-start gap-3">
            <AlertCircle className="size-5 text-[#EC407A] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#991B1B]">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (liveClasses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Live Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="size-12 text-[#E0E0E0] mx-auto mb-3" />
            <p className="text-sm text-[#78909C]">No upcoming live classes scheduled</p>
            <p className="text-xs text-[#78909C] mt-1">Check back soon for new classes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Live Classes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {liveClasses.map((liveClass) => (
            <div
              key={liveClass.id}
              className={`p-4 border rounded-lg transition-all ${
                isStartingSoon(liveClass.scheduled_at)
                  ? 'border-[#EC407A] bg-[#FEF2F2]'
                  : 'border-[#E0E0E0] hover:border-[#1E88E5]/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-[#1E3A5F]">{liveClass.title}</h4>
                    {isStartingSoon(liveClass.scheduled_at) && (
                      <span className="px-2 py-1 text-xs font-medium bg-[#EC407A] text-white rounded-full">
                        Starting Soon
                      </span>
                    )}
                  </div>

                  {liveClass.description && (
                    <p className="text-sm text-[#78909C] mb-3 line-clamp-2">{liveClass.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#78909C]">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>{formatDateTime(liveClass.scheduled_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span>{liveClass.duration_minutes} minutes</span>
                    </div>
                    {liveClass.instructor_name && (
                      <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        <span>{liveClass.instructor_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-sm font-medium text-[#1E88E5]">
                    {getTimeUntilClass(liveClass.scheduled_at)}
                  </div>
                </div>

                <a
                  href={liveClass.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white"
                  >
                    <ExternalLink className="size-4" />
                    Join Now
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
