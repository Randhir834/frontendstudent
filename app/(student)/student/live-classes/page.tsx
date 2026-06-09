'use client';

import { useEffect, useState } from 'react';
import { Loader2, Video, Calendar, Clock, Users, PlayCircle, CheckCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { liveClassService, type LiveClass } from '@/services/liveClassService';

export default function StudentLiveClassesPage() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

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
      const response = await liveClassService.getLiveClasses();
      setLiveClasses(response.liveClasses || []);
    } catch (error) {
      console.error('Failed to fetch live classes:', error);
      setLiveClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // Categorize classes by status
  const upcomingClasses = liveClasses.filter((liveClass) => 
    liveClassService.getClassStatus(liveClass.scheduled_at, liveClass.duration_minutes) === 'upcoming'
  );

  const ongoingClasses = liveClasses.filter((liveClass) => 
    liveClassService.getClassStatus(liveClass.scheduled_at, liveClass.duration_minutes) === 'ongoing'
  );

  const completedClasses = liveClasses.filter((liveClass) => 
    liveClassService.getClassStatus(liveClass.scheduled_at, liveClass.duration_minutes) === 'completed'
  );

  const renderClassCard = (liveClass: LiveClass) => {
    const status = liveClassService.getClassStatus(liveClass.scheduled_at, liveClass.duration_minutes);
    const isToday = liveClassService.isToday(liveClass.scheduled_at);
    const isStartingSoon = liveClassService.isStartingSoon(liveClass.scheduled_at);

    return (
      <Card
        key={liveClass.id}
        className={`${
          status === 'ongoing'
            ? 'border-green-500 shadow-lg shadow-green-500/10'
            : isStartingSoon
            ? 'border-[#1E88E5] shadow-lg shadow-[#1E88E5]/10'
            : isToday && status === 'upcoming'
            ? 'border-[#1E88E5]'
            : ''
        }`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnail */}
            {liveClass.thumbnail_url && (
              <div className="w-full md:w-48 h-32 flex-shrink-0">
                <img
                  src={liveClass.thumbnail_url}
                  alt={liveClass.course_title || 'Course'}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-[#1E293B]">{liveClass.title}</h3>
                      {status === 'ongoing' && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-500 text-white animate-pulse flex items-center gap-1">
                          <PlayCircle className="size-3" />
                          Live Now
                        </span>
                      )}
                      {status === 'upcoming' && isStartingSoon && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white animate-pulse">
                          Starting Soon
                        </span>
                      )}
                      {status === 'upcoming' && isToday && !isStartingSoon && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#1E88E5] text-white">
                          Today
                        </span>
                      )}
                      {status === 'upcoming' && !isToday && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#DBEAFE] text-[#1E88E5]">
                          Upcoming
                        </span>
                      )}
                      {status === 'completed' && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center gap-1">
                          <CheckCircle className="size-3" />
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#1E88E5] font-medium">
                      {liveClass.course_title}
                    </p>
                  </div>
                </div>

                {liveClass.description && (
                  <p className="text-sm text-[#64748B] mt-2">{liveClass.description}</p>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>{liveClassService.formatDate(liveClass.scheduled_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{liveClassService.formatTime(liveClass.scheduled_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{liveClass.duration_minutes} minutes</span>
                </div>
                {liveClass.instructor_name && (
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>Instructor: {liveClass.instructor_name}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {status === 'ongoing' && (
                  <>
                    <Button
                      onClick={() => window.open(liveClass.meet_link, '_blank')}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <PlayCircle className="size-4" />
                      Join Live Class Now
                    </Button>
                    <p className="text-xs text-green-600 font-medium mt-2">
                      Class is currently in progress! You can join at any time.
                    </p>
                  </>
                )}
                {status === 'upcoming' && (
                  <>
                    <Button
                      onClick={() => window.open(liveClass.meet_link, '_blank')}
                      className={`flex items-center gap-2 ${
                        isStartingSoon ? 'bg-red-500 hover:bg-red-600' : ''
                      }`}
                    >
                      <Video className="size-4" />
                      {isStartingSoon ? 'Join Now - Starting Soon!' : 'Join Class'}
                    </Button>
                  </>
                )}
                {status === 'completed' && (
                  <>
                    <Button
                      disabled
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="size-4" />
                      Class Ended
                    </Button>
                    <p className="text-xs text-[#64748B] mt-2">
                      This class has ended. The meeting link is no longer active.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = (type: 'upcoming' | 'ongoing' | 'completed') => {
    const messages = {
      upcoming: {
        title: 'No Upcoming Classes',
        description: 'No classes are scheduled for the future at the moment.',
      },
      ongoing: {
        title: 'No Ongoing Classes',
        description: 'No classes are currently in progress.',
      },
      completed: {
        title: 'No Completed Classes',
        description: 'You haven\'t attended any classes yet.',
      },
    };

    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Video className="size-16 text-[#CBD5E1] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#1E293B] mb-2">
              {messages[type].title}
            </h3>
            <p className="text-sm text-[#64748B]">
              {messages[type].description}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Live Classes</h1>
          <p className="text-sm text-[#64748B] mt-1">Join scheduled live sessions for your enrolled courses</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-[#1E88E5] text-white'
              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'ongoing'
              ? 'bg-green-500 text-white'
              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
          }`}
        >
          <span className="flex items-center gap-2">
            Ongoing
            {ongoingClasses.length > 0 && (
              <span className="size-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-[#64748B] text-white'
              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Live Classes Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'upcoming' && (
            <>
              {upcomingClasses.length === 0 ? (
                renderEmptyState('upcoming')
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {upcomingClasses.map(renderClassCard)}
                </div>
              )}
            </>
          )}

          {activeTab === 'ongoing' && (
            <>
              {ongoingClasses.length === 0 ? (
                renderEmptyState('ongoing')
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {ongoingClasses.map(renderClassCard)}
                </div>
              )}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              {completedClasses.length === 0 ? (
                renderEmptyState('completed')
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {completedClasses.map(renderClassCard)}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Auto-refresh indicator */}

    </div>
  );
}
