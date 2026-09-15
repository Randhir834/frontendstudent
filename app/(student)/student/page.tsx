'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Video, ChevronRight, Trophy, TrendingUp, 
  Zap, Target, Clock, Users, PlayCircle, ArrowRight, GraduationCap
} from 'lucide-react';
import { dashboardService, DashboardData, CourseProgress } from '@/services/dashboardService';
import { userService, UserProfile } from '@/services/userService';
import UpcomingLiveClasses from '@/components/UpcomingLiveClasses';
import { PageLoading, SectionLoading } from '@/components/ui/LoadingSpinner';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function StudentHomePage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
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
    };

    fetchAll();

    // Auto-refresh dashboard data every 60 seconds
    const interval = setInterval(() => {
      fetchAll();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <PageLoading message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] sm:min-h-[70vh] p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <p className="text-base text-red-600 mb-4 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || { enrolledCourses: 0, liveClasses: 0, achievements: 0 };
  const courses = dashboardData?.courses || [];
  const displayName = user?.name || 'Student';

  return (
    <div className="flex flex-col xl:flex-row">
      {/* Center Content */}
      <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 min-w-0 max-w-[1600px] mx-auto w-full">
        {/* Welcome Message - Enhanced */}
        <div className="mb-6 sm:mb-8 md:mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-7 md:p-8 border border-gray-200 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">Welcome back,</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent break-words mb-3">
                  {displayName}!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                  Keep going! Your next milestone is closer than you think. 🚀
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl transform rotate-6 hover:rotate-12 transition-transform">
                  <Target className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards - Fully Responsive Grid with Gradients */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10 md:mb-12">
          {[
            { 
              label: 'Enrolled Courses', 
              value: String(stats.enrolledCourses), 
              icon: BookOpen, 
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-50 to-cyan-50',
              shadowColor: 'shadow-blue-500/20',
              href: '/student/my-courses'
            },
            { 
              label: 'Live Classes', 
              value: String(stats.liveClasses), 
              icon: Video, 
              gradient: 'from-purple-500 to-pink-500',
              bgGradient: 'from-purple-50 to-pink-50',
              shadowColor: 'shadow-purple-500/20',
              href: '/student/live-classes'
            },
          ].map((card, index) => (
            <Link key={index} href={card.href}>
              <div 
                className={`group relative bg-gradient-to-br ${card.bgGradient} rounded-2xl border border-white shadow-lg hover:shadow-2xl ${card.shadowColor} transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer`}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative p-4 sm:p-5 md:p-6">
                  <div className="flex flex-col gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <card.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    
                    {/* Stats */}
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">{card.label}</p>
                      <p className={`text-3xl sm:text-4xl font-bold bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`}>
                        {card.value}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative Corner */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-5 rounded-bl-full`}></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Enrolled Courses Section */}
        <EnrolledCoursesSection courses={courses} loading={loading} />

        {/* Upcoming Live Classes */}
        <div className="mt-8 sm:mt-10">
          <UpcomingLiveClasses />
        </div>
      </main>
    </div>
  );
}

// Enrolled Courses Section Component
function EnrolledCoursesSection({ courses, loading }: { courses: CourseProgress[]; loading: boolean }) {
  if (loading) {
    return <SectionLoading />;
  }

  return (
    <div className="mb-8 sm:mb-10 relative">
      {/* Background Gradient Blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
      
      <Card className="relative bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
        <CardHeader className="px-6 sm:px-8 md:px-10 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                My Enrolled Courses
              </CardTitle>
            </div>
            <Link href="/student/my-courses">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                View All Courses
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 md:px-10 py-6 sm:py-8">
          {courses.length === 0 ? (
            <EmptyCoursesState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Empty State Component
function EmptyCoursesState() {
  return (
    <div className="relative py-12 px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl opacity-50"></div>
      <div className="relative text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <BookOpen className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">No Enrolled Courses Yet</h3>
        <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
          Start your learning journey today! Browse our course catalog and enroll in courses that interest you.
        </p>
        <Link href="/student/courses">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course }: { course: CourseProgress }) {
  const progressPercentage = Math.round(course.progress);
  
  return (
    <Link href={`/student/courses/${course.id}`}>
      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer">
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
        
        <div className="relative">
          {/* Course Thumbnail */}
          <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
            {course.thumbnail_url ? (
              <img 
                src={course.thumbnail_url} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-400">
                <BookOpen className="w-16 h-16 text-white opacity-40" />
              </div>
            )}
            
            {/* Progress Badge */}
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white">
              <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {progressPercentage}% Complete
              </span>
            </div>
          </div>

          {/* Course Info */}
          <div className="p-4 sm:p-5">
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-cyan-600 transition-all leading-tight min-h-[3rem]">
              {course.title}
            </h3>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Progress</span>
                <span className="text-xs font-bold text-blue-600">{course.completedLessons} / {course.totalLessons} lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:from-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2"
              size="sm"
            >
              Continue Learning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 rounded-br-full"></div>
        </div>
      </div>
    </Link>
  );
}
