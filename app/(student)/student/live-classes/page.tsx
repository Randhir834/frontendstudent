'use client';

import { useEffect, useState } from 'react';
import { Video, Calendar, Clock, ExternalLink, Sparkles, BookOpen, Filter, User } from 'lucide-react';
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

export default function StudentLiveClassesPage() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  useEffect(() => {
    fetchLiveClasses();
    
    // Set up Socket.IO listener for real-time updates
    if (typeof window !== 'undefined' && (window as any).io) {
      const socket = (window as any).io;
      
      socket.on('live-class-scheduled', (data: any) => {
        console.log('New live class scheduled:', data);
        // Refresh the list when a new class is scheduled
        fetchLiveClasses();
      });

      return () => {
        socket.off('live-class-scheduled');
      };
    }
  }, []);

  useEffect(() => {
    // Filter classes when selection changes
    if (selectedCourse === 'all') {
      setFilteredClasses(liveClasses);
    } else {
      setFilteredClasses(liveClasses.filter(c => c.course_id.toString() === selectedCourse));
    }
  }, [selectedCourse, liveClasses]);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setError('Please log in to view your live classes');
        setLiveClasses([]);
        setFilteredClasses([]);
        setLoading(false);
        return;
      }
      
      // Use the proper live-classes endpoint that returns upcoming classes for students
      const response = await api.get('/live-classes');
      const classes = response.data.liveClasses || [];
      
      // Sort classes by scheduled date/time
      const sortedClasses = classes.sort((a: LiveClass, b: LiveClass) => {
        return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
      });
      
      setLiveClasses(sortedClasses);
      setFilteredClasses(sortedClasses);
      setError('');
    } catch (error: any) {
      console.error('Failed to fetch live classes:', error);
      
      // Set user-friendly error message
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view live classes.');
      } else if (!error.response) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('Failed to load live classes. Please try again.');
      }
      
      setLiveClasses([]);
      setFilteredClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (scheduledAt: string): { date: string; time: string; fullDate: string } => {
    if (!scheduledAt) return { date: 'Date not available', time: '', fullDate: '' };
    try {
      const date = new Date(scheduledAt);
      if (isNaN(date.getTime())) return { date: 'Date not available', time: '', fullDate: '' };
      
      return {
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        time: date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        fullDate: date.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })
      };
    } catch (error) {
      return { date: 'Date not available', time: '', fullDate: '' };
    }
  };

  const isToday = (scheduledAt: string): boolean => {
    if (!scheduledAt) return false;
    try {
      const date = new Date(scheduledAt);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    } catch (error) {
      return false;
    }
  };

  const isPast = (scheduledAt: string): boolean => {
    if (!scheduledAt) return false;
    try {
      return new Date(scheduledAt).getTime() < new Date().getTime();
    } catch (error) {
      return false;
    }
  };

  const isUpcoming = (scheduledAt: string): boolean => {
    if (!scheduledAt) return false;
    try {
      const classTime = new Date(scheduledAt).getTime();
      const now = new Date().getTime();
      const today = new Date().setHours(0, 0, 0, 0);
      const classDate = new Date(scheduledAt).setHours(0, 0, 0, 0);
      
      return classDate > today || (classDate === today && classTime > now);
    } catch (error) {
      return false;
    }
  };

  // Get unique courses for filter
  const uniqueCourses = Array.from(
    new Map(liveClasses.map(c => [c.course_id, { id: c.course_id, title: c.course_title }])).values()
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header with Enhanced Gradient Blur Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl blur-3xl opacity-30 -z-10 animate-pulse"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Live Classes
                </h1>
              </div>
            </div>
            {!loading && liveClasses.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">{liveClasses.length} {liveClasses.length === 1 ? 'Class' : 'Classes'}</span>
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 ml-0 sm:ml-14">
            Join your scheduled classes with one click 🚀
          </p>
        </div>
      </div>

      {/* Enhanced Summary Stats - 2 Cards */}
      {!loading && liveClasses.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10">
          <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-white shadow-lg hover:shadow-2xl shadow-green-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            <div className="relative p-4 sm:p-5 md:p-6">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Total Classes</p>
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    {liveClasses.length}
                  </p>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 opacity-5 rounded-bl-full"></div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-white shadow-lg hover:shadow-2xl shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            <div className="relative p-4 sm:p-5 md:p-6">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Today's Classes</p>
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    {liveClasses.filter(c => isToday(c.scheduled_at)).length}
                  </p>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 rounded-bl-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Live Classes Content */}
      {error ? (
        <div className="relative bg-red-50 rounded-2xl p-8 sm:p-12 border-2 border-red-200 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-red-100 to-red-50 rounded-2xl opacity-50"></div>
          
          <div className="relative text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Video className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-3">Unable to Load Live Classes</h3>
            <p className="text-red-700 mb-6 max-w-md mx-auto">{error}</p>
            <Button
              onClick={() => {
                if (error.includes('log in')) {
                  window.location.href = '/login';
                } else {
                  fetchLiveClasses();
                }
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {error.includes('log in') ? 'Go to Login' : 'Try Again'}
            </Button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                <Video className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Loading your classes...</p>
          </div>
        </div>
      ) : liveClasses.length === 0 ? (
        <div className="relative bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl opacity-50"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-teal-200 to-green-200 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:scale-110 transition-transform duration-300">
              <Video className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">No Live Classes Yet</h3>
            <p className="text-gray-600 mb-2 max-w-md mx-auto">
              You don't have any scheduled classes at the moment.
            </p>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Your instructor will schedule live classes for you. Check back soon!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              Your Scheduled Classes
            </h2>
            
            {/* Course Filter */}
            <div className="w-full sm:w-auto">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 appearance-none cursor-pointer shadow-sm"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map((course) => (
                    <option key={course.id} value={course.id.toString()}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Filter Results Info */}
          {selectedCourse !== 'all' && (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-sm font-medium text-green-700">
                  Showing {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'}
                </span>
                <button
                  onClick={() => setSelectedCourse('all')}
                  className="text-green-600 hover:text-green-800 font-semibold text-sm underline"
                >
                  Clear filter
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredClasses.map((liveClass, index) => {
              const isTodayClass = isToday(liveClass.scheduled_at);
              const isPastClass = isPast(liveClass.scheduled_at);
              const isUpcomingClass = isUpcoming(liveClass.scheduled_at);
              const { date, time } = formatDateTime(liveClass.scheduled_at);
              
              return (
                <div
                  key={liveClass.id}
                  className={`group bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${
                    isTodayClass 
                      ? 'border-green-400 shadow-lg shadow-green-500/30' 
                      : isPastClass
                      ? 'border-gray-300 opacity-60'
                      : 'border-gray-200 hover:border-green-400 shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Course Name with Today/Past/Upcoming Badge */}
                    <div className="space-y-2">
                      {isTodayClass && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                          <Sparkles className="w-3 h-3 text-white" />
                          <span className="text-xs font-bold text-white">Today's Class</span>
                        </div>
                      )}
                      {isPastClass && !isTodayClass && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-400 rounded-full">
                          <span className="text-xs font-bold text-white">Past Class</span>
                        </div>
                      )}
                      {isUpcomingClass && !isTodayClass && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                          <span className="text-xs font-bold text-white">Upcoming</span>
                        </div>
                      )}
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-snug">
                        {liveClass.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {liveClass.course_title}
                      </p>
                    </div>

                    {/* Schedule Info with Better Spacing */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Date</p>
                          <p className="text-sm font-bold text-gray-900">{date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Time</p>
                          <p className="text-sm font-bold text-gray-900">{time}</p>
                        </div>
                      </div>

                      {liveClass.instructor_name && (
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Instructor</p>
                            <p className="text-sm font-bold text-gray-900">{liveClass.instructor_name}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-teal-50 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Duration</p>
                          <p className="text-sm font-bold text-teal-600">{liveClass.duration_minutes} minutes</p>
                        </div>
                      </div>
                    </div>

                    {/* Description - Hidden */}

                    {/* Enhanced Join Button */}
                    <div className="pt-2">
                      {isPastClass ? (
                        <Button
                          disabled
                          className="w-full bg-gray-400 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold cursor-not-allowed"
                        >
                          <span>Class Ended</span>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => window.open(liveClass.meet_link, '_blank')}
                          className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                            isTodayClass ? 'animate-pulse shadow-green-500/50' : ''
                          }`}
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>{isTodayClass ? 'Join Now' : 'Join Class'}</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Decorative Corner Gradient */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 opacity-5 rounded-full group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
