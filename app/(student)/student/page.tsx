'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Video, ClipboardList, Loader2,
  ChevronRight
} from 'lucide-react';
import { dashboardService, DashboardData } from '@/services/dashboardService';
import { userService, UserProfile } from '@/services/userService';
import { useSocket } from '@/hooks/useSocket';
import { useCallback } from 'react';
import UpcomingLiveClasses from '@/components/UpcomingLiveClasses';

export default function StudentHomePage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { onLiveClassScheduled, offLiveClassScheduled } = useSocket(user?.id);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [dashData, profile] = await Promise.all([
        dashboardService.getDashboardData(),
        userService.getProfile().catch(() => null)
      ]);
      setDashboardData(dashData);
      setUser(profile);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    onLiveClassScheduled(() => {
      console.log('New live class scheduled, refreshing dashboard...');
      fetchAll();
    });

    return () => {
      offLiveClassScheduled();
    };
  }, [onLiveClassScheduled, offLiveClassScheduled, fetchAll]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-73px)]">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-[#1E88E5] mx-auto mb-4" />
          <p className="text-[#78909C]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-73px)]">
        <div className="text-center">
          <p className="text-[#EC407A] mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || { enrolledCourses: 0, liveClasses: 0, assignments: 0 };
  const courses = dashboardData?.courses || [];

  const displayName = user?.name || 'Student';

  // Get the course with the highest progress (most recently worked on)
  const continueLearnCourse = courses.length > 0 
    ? courses.reduce((prev, current) => (current.progress > prev.progress ? current : prev))
    : null;

  return (
    <div className="flex flex-col xl:flex-row">
      {/* Center Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
          {/* Welcome Message */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-lg sm:text-xl text-[#1E3A5F]">Welcome back,</h1>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E88E5]">{displayName}! 👋</h1>
            <p className="text-xs sm:text-sm text-[#78909C] mt-1">Keep going! Your next milestone is closer than you think.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8">
            {[
              { label: 'Enrolled Courses', value: String(stats.enrolledCourses), icon: BookOpen, iconBg: 'bg-[#C5E1A5]', iconColor: 'text-[#1E88E5]', link: 'View all' },
              { label: 'Live Classes', value: String(stats.liveClasses), icon: Video, iconBg: 'bg-[#FEF3C7]', iconColor: 'text-[#D97706]', link: 'View schedule' },
              { label: 'Assignments', value: String(stats.assignments), icon: ClipboardList, iconBg: 'bg-[#DBEAFE]', iconColor: 'text-[#1E88E5]', link: 'View all' },
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#E0E0E0] p-3 sm:p-4 lg:p-5">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${card.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <card.icon size={16} className={`sm:size-5 lg:size-6 ${card.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#78909C] mb-0.5 truncate">{card.label}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1E3A5F]">{card.value}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#FAFAFA]">
                  <button className="text-xs text-[#78909C] font-medium flex items-center gap-1 hover:text-[#1E88E5] transition-colors">
                    {card.link} <ChevronRight size={10} className="sm:size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Learning Section */}
          {continueLearnCourse && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#1E3A5F] mb-5">Continue Learning</h2>
              <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                <div className="w-full sm:w-52 h-28 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  {continueLearnCourse.thumbnail_url ? (
                    <img
                      src={continueLearnCourse.thumbnail_url}
                      alt={continueLearnCourse.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E88E5]/10 to-[#1E88E5]/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="size-12 text-[#1E88E5]/60" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1E3A5F] mb-2">{continueLearnCourse.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#78909C]">
                      {continueLearnCourse.completedLessons} of {continueLearnCourse.totalLessons} lessons
                    </span>
                    <div className="flex-1 bg-[#FAFAFA] rounded-full h-1.5 max-w-[200px]">
                      <div 
                        className="bg-[#1E88E5] h-1.5 rounded-full" 
                        style={{ width: `${continueLearnCourse.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#78909C] font-medium">{Math.round(continueLearnCourse.progress)}%</span>
                  </div>
                </div>
                <a href={`/student/course/${continueLearnCourse.id}`}>
                  <button className="w-full sm:w-auto px-5 py-2.5 bg-[#1E88E5] text-white rounded-lg text-sm font-medium hover:bg-[#1565C0] transition-colors flex items-center justify-center gap-2">
                    Continue <ChevronRight size={16} />
                  </button>
                </a>
              </div>
            </div>
          )}

          {/* Upcoming Live Classes */}
          {courses.length > 0 && (
            <div className="mt-6">
              <UpcomingLiveClasses />
            </div>
          )}
        </main>
      </div>
  );
}
