'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Video, ClipboardList, Loader2,
  ChevronRight, Award, Trophy
} from 'lucide-react';
import { dashboardService, DashboardData } from '@/services/dashboardService';
import { certificateService } from '@/services/certificateService';
import { userService, UserProfile } from '@/services/userService';
import UpcomingLiveClasses from '@/components/UpcomingLiveClasses';
import RecentAssignments from '@/components/RecentAssignments';
import RecentQuizzes from '@/components/RecentQuizzes';

export default function StudentHomePage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [certificateCount, setCertificateCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [dashData, profile, certs] = await Promise.all([
          dashboardService.getDashboardData(),
          userService.getProfile().catch(() => null),
          certificateService.getMyCertificates().catch(() => ({ certificates: [], total: 0 }))
        ]);
        setDashboardData(dashData);
        setUser(profile);
        setCertificateCount(certs.total);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    // Auto-refresh dashboard data every 60 seconds
    const interval = setInterval(() => {
      fetchAll();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

  const stats = dashboardData?.stats || { enrolledCourses: 0, liveClasses: 0, assignments: 0, achievements: 0 };
  const courses = dashboardData?.courses || [];

  const displayName = user?.name || 'Student';

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8">
            {[
              { label: 'Enrolled Courses', value: String(stats.enrolledCourses), icon: BookOpen, iconBg: 'bg-[#C5E1A5]', iconColor: 'text-[#1E88E5]' },
              { label: 'Live Classes', value: String(stats.liveClasses), icon: Video, iconBg: 'bg-[#FEF3C7]', iconColor: 'text-[#D97706]' },
              { label: 'Assignments', value: String(stats.assignments), icon: ClipboardList, iconBg: 'bg-[#DBEAFE]', iconColor: 'text-[#1E88E5]' },
              { label: 'Quizzes', value: String(stats.achievements), icon: Trophy, iconBg: 'bg-[#F8BBD0]', iconColor: 'text-[#C2185B]' },
              { label: 'Certificates', value: String(certificateCount), icon: Award, iconBg: 'bg-[#F3E5AB]', iconColor: 'text-[#F57C00]' },
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
              </div>
            ))}
          </div>

          {/* Upcoming Live Classes */}
          {courses.length > 0 && (
            <div className="mt-6">
              <UpcomingLiveClasses />
            </div>
          )}

          {/* Recent Assignments and Quizzes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RecentAssignments />
            <RecentQuizzes />
          </div>
        </main>
      </div>
  );
}
