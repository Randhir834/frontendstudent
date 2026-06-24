'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, Loader2, AlertCircle, PlayCircle, Video } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/services/api';

interface LiveClass {
  id: number;
  course_id: number;
  course_title: string;
  thumbnail_url?: string;
  title: string;
  description?: string;
  meet_link: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  instructor_name?: string;
  created_at: string;
}

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
      
      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        console.log('No auth token found, skipping live classes fetch');
        setClasses([]);
        setError('');
        setLoading(false);
        return;
      }
      
      // Use the new live-classes endpoint (returns scheduled classes for enrolled courses)
      const response = await api.get('/live-classes');
      const allClasses = response.data.liveClasses || [];
      
      // Get current date/time
      const now = new Date();
      
      // Filter for upcoming classes only (future or happening soon)
      const upcomingClasses = allClasses.filter((liveClass: LiveClass) => {
        const scheduledTime = new Date(liveClass.scheduled_at);
        return scheduledTime.getTime() > now.getTime() && liveClass.status === 'scheduled';
      });

      // Sort by scheduled date/time (earliest first)
      const sortedClasses = upcomingClasses.sort((a: LiveClass, b: LiveClass) => {
        return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
      });

      // Get only the top 3 classes
      const topClasses = sortedClasses.slice(0, 3);
      setClasses(topClasses);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch live classes:', err);
      
      const status = err.response?.status;
      if (status === 401) {
        // Don't show error for auth issues - user might not be logged in yet
        console.log('Authentication required for live classes');
        setError('');
      } else if (!status || status >= 500) {
        setError('Failed to load live classes');
      } else {
        setError('');
      }
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (scheduledAt: string) => {
    try {
      const date = new Date(scheduledAt);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  const getTimeUntilClass = (scheduledAt: string) => {
    try {
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
    } catch (error) {
      return null;
    }
  };

  const isToday = (scheduledAt: string): boolean => {
    if (!scheduledAt) return false;
    try {
      const today = new Date();
      const classDate = new Date(scheduledAt);
      return today.toDateString() === classDate.toDateString();
    } catch (error) {
      return false;
    }
  };

  const isStartingSoon = (scheduledAt: string): boolean => {
    try {
      const classTime = new Date(scheduledAt);
      const now = new Date();
      const diff = classTime.getTime() - now.getTime();
      const thirtyMinutes = 30 * 60 * 1000;
      return diff <= thirtyMinutes && diff > 0;
    } catch (error) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="relative">
        {/* Background Gradient Blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
        
        <Card className="relative bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
          <CardHeader className="px-8 sm:px-10 py-6 sm:py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Upcoming Live Classes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 sm:px-10 py-6 sm:py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-75"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Loading your classes...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        {/* Background Gradient Blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-100 via-orange-100 to-pink-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
        
        <Card className="relative bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
          <CardHeader className="px-8 sm:px-10 py-6 sm:py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                Upcoming Live Classes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 sm:px-10 py-6 sm:py-8">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl shadow-md">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-800 mb-1">Oops! Something went wrong</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="relative">
        {/* Background Gradient Blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
        
        <Card className="relative bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
          <CardHeader className="px-8 sm:px-10 py-6 sm:py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Upcoming Live Classes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 sm:px-10 py-6 sm:py-8">
            <div className="relative py-12 px-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl opacity-50"></div>
              <div className="relative text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No Upcoming Classes</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Enroll in courses and book time slots to see your live sessions here.
                </p>
                <Link href="/student/courses">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Gradient Blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
      
      <Card className="relative bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
        <CardHeader className="px-8 sm:px-10 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Upcoming Live Classes
              </CardTitle>
            </div>
            <Link href="/student/live-classes">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto text-xs sm:text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-8 sm:px-10 py-6 sm:py-8">
          <div className="space-y-3 sm:space-y-4">
            {classes.map((liveClass, index) => {
              const isTodayClass = isToday(liveClass.scheduled_at);
              const isStartingSoonClass = isStartingSoon(liveClass.scheduled_at);
              const timeUntil = getTimeUntilClass(liveClass.scheduled_at);

              // Define gradient colors for each class card
              const gradients = [
                { from: 'from-blue-500', to: 'to-cyan-500', bg: 'from-blue-50', bgTo: 'to-cyan-50', shadow: 'shadow-blue-500/20' },
                { from: 'from-purple-500', to: 'to-pink-500', bg: 'from-purple-50', bgTo: 'to-pink-50', shadow: 'shadow-purple-500/20' },
                { from: 'from-orange-500', to: 'to-red-500', bg: 'from-orange-50', bgTo: 'to-red-50', shadow: 'shadow-orange-500/20' },
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <div
                  key={liveClass.id}
                  className={`group relative bg-gradient-to-br ${gradient.bg} ${gradient.bgTo} rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden ${
                    isStartingSoonClass
                      ? 'border-green-400 shadow-xl shadow-green-500/30 animate-pulse'
                      : isTodayClass
                      ? `border-transparent shadow-lg ${gradient.shadow}`
                      : 'border-white shadow-md hover:border-opacity-50'
                  }`}
                >
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.to} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Header with Badge */}
                        <div className="flex flex-col gap-2 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {isStartingSoonClass && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg animate-pulse">
                                <PlayCircle className="w-3.5 h-3.5" />
                                STARTING SOON
                              </span>
                            )}
                            {isTodayClass && !isStartingSoonClass && (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${gradient.from} ${gradient.to} text-white shadow-md`}>
                                <Calendar className="w-3.5 h-3.5" />
                                TODAY
                              </span>
                            )}
                            {timeUntil && (
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                isStartingSoonClass
                                  ? 'bg-green-500 text-white shadow-md'
                                  : isTodayClass
                                  ? `bg-gradient-to-r ${gradient.from} ${gradient.to} text-white shadow-md`
                                  : 'bg-white/80 text-gray-700 shadow-sm'
                              }`}>
                                {timeUntil}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-pink-600 transition-all break-words leading-tight">
                            {liveClass.title}
                          </h4>
                          <p className="text-xs text-gray-600 font-medium">{liveClass.course_title}</p>
                        </div>

                        {/* Date and Time Info */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg">
                            <Calendar className={`w-4 h-4 bg-gradient-to-r ${gradient.from} ${gradient.to} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                            <span className="text-xs font-semibold text-gray-700">{formatDateTime(liveClass.scheduled_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg">
                            <Clock className={`w-4 h-4 bg-gradient-to-r ${gradient.from} ${gradient.to} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                            <span className="text-xs font-semibold text-gray-700">{liveClass.duration_minutes} min</span>
                          </div>
                        </div>

                        {/* Instructor Name */}
                        {liveClass.instructor_name && (
                          <div className="text-xs text-gray-500">
                            Instructor: <span className="font-semibold text-gray-700">{liveClass.instructor_name}</span>
                          </div>
                        )}
                      </div>

                      {/* Join Button */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                        <a
                          href={liveClass.meet_link}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap ${
                            isStartingSoonClass
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                              : `bg-gradient-to-r ${gradient.from} ${gradient.to} text-white hover:opacity-90`
                          }`}
                        >
                          {isStartingSoonClass ? (
                            <>
                              <PlayCircle className="w-4 h-4" />
                              Join Now
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              Join Class
                            </>
                          )}
                        </a>
                      </div>
                    </div>

                    {/* Starting Soon Alert */}
                    {isStartingSoonClass && (
                      <div className="mt-4 pt-4 border-t-2 border-green-200">
                        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <span className="text-xl">🔴</span>
                          <p className="text-xs sm:text-sm text-green-800 font-bold">
                            Class starts in less than 30 minutes! Join now to participate.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Decorative Corner Gradient */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient.from} ${gradient.to} opacity-5 rounded-bl-full`}></div>
                  <div className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${gradient.from} ${gradient.to} opacity-5 rounded-tr-full`}></div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
