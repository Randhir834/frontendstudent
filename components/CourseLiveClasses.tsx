'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Loader2, ExternalLink, AlertCircle, Video } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { liveClassService, type LiveClass } from '@/services/liveClassService';

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
        const data = await liveClassService.getLiveClassesByCourse(courseId);
        // Filter for upcoming classes only
        const upcomingClasses = (data.liveClasses || []).filter(
          (lc: LiveClass) => liveClassService.isUpcoming(lc.scheduled_at)
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
            <Video className="size-12 text-[#E0E0E0] mx-auto mb-3" />
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
          {liveClasses.map((liveClass) => {
            const isStartingSoon = liveClassService.isStartingSoon(liveClass.scheduled_at);
            const isToday = liveClassService.isToday(liveClass.scheduled_at);

            return (
              <div
                key={liveClass.id}
                className={`p-4 border rounded-lg transition-all ${
                  isStartingSoon
                    ? 'border-red-500 bg-[#FEF2F2] shadow-lg'
                    : isToday
                    ? 'border-[#1E88E5] bg-[#EFF6FF]'
                    : 'border-[#E0E0E0] hover:border-[#1E88E5]/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#1E3A5F]">{liveClass.title}</h4>
                      {isStartingSoon && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
                          Starting Soon!
                        </span>
                      )}
                      {isToday && !isStartingSoon && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-[#1E88E5] text-white rounded-full">
                          Today
                        </span>
                      )}
                    </div>

                    {liveClass.description && (
                      <p className="text-sm text-[#78909C] mb-3 line-clamp-2">{liveClass.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#78909C]">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{liveClassService.formatDate(liveClass.scheduled_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{liveClassService.formatTime(liveClass.scheduled_at)}</span>
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

                    <div className={`mt-3 text-sm font-medium ${isStartingSoon ? 'text-red-500' : 'text-[#1E88E5]'}`}>
                      {getTimeUntilClass(liveClass.scheduled_at)}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => window.open(liveClass.meet_link, '_blank')}
                    className={`flex items-center gap-2 flex-shrink-0 ${
                      isStartingSoon ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1E88E5] hover:bg-[#1E88E5]/90'
                    }`}
                  >
                    <Video className="size-4" />
                    Join Class
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
