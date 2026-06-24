'use client';

import { useEffect, useState, Suspense } from 'react';
import { BookOpen } from 'lucide-react';
import CourseCard from '@/components/ui/CourseCard';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import { useAuth } from '@/hooks/useAuth';
import type { Course } from '@/types';

function StudentCoursesContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Get published courses with enrollment status
      const data = await courseService.getPublishedCourses({});
      
      // Check enrollment status for each course
      const coursesWithEnrollment = await Promise.all(
        (data.courses || []).map(async (course: Course) => {
          try {
            const enrollmentData = await enrollmentService.checkEnrollment(course.id);
            return {
              ...course,
              is_enrolled: enrollmentData.enrolled,
              progress: enrollmentData.progress || 0
            };
          } catch {
            return { ...course, is_enrolled: false, progress: 0 };
          }
        })
      );
      
      setCourses(coursesWithEnrollment);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch courses after authentication is confirmed
    if (isAuthenticated && !authLoading) {
      fetchCourses();
    }
  }, [isAuthenticated, authLoading]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const enrolledCourses = courses.filter(c => c.is_enrolled);

  const stats = {
    total: courses.length,
    enrolled: enrolledCourses.length,
    available: courses.filter(c => !c.is_enrolled).length,
    completed: enrolledCourses.filter(c => c.progress === 100).length
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Header with Gradient Blur Background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-2xl blur-3xl opacity-30 -z-10"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Browse Courses
              </h1>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 ml-0 sm:ml-14">
              Discover and enroll in courses that match your interests and goals
            </p>
          </div>
        </div>

        {/* Summary Cards - Same as Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10">
          {[
            { 
              label: 'Available Courses', 
              value: String(stats.available), 
              icon: BookOpen, 
              gradient: 'from-purple-500 to-pink-500',
              bgGradient: 'from-purple-50 to-pink-50',
              shadowColor: 'shadow-purple-500/20'
            },
            { 
              label: 'Enrolled', 
              value: String(stats.enrolled), 
              icon: BookOpen, 
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-50 to-cyan-50',
              shadowColor: 'shadow-blue-500/20'
            },
          ].map((card, index) => (
            <div 
              key={index} 
              className={`group relative bg-gradient-to-br ${card.bgGradient} rounded-2xl border border-white shadow-lg hover:shadow-2xl ${card.shadowColor} transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
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
          ))}
        </div>

        {/* Course Sections */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="relative bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl opacity-50"></div>
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BookOpen className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No Courses Available</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                No courses are currently available. Check back later for exciting new content and learning opportunities!
              </p>
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl shadow-lg">
                Coming Soon! 🚀
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Available Courses Section */}
            {stats.available > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
                  Available Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {courses
                    .filter(c => !c.is_enrolled)
                    .map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        userRole="student"
                        showActions={true}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Enrolled Courses Section */}
            {stats.enrolled > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
                  Enrolled Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {courses
                    .filter(c => c.is_enrolled && c.progress !== 100)
                    .map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        userRole="student"
                        showActions={true}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Completed Courses Section */}
            {stats.completed > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
                  Completed Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {courses
                    .filter(c => c.is_enrolled && c.progress === 100)
                    .map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        userRole="student"
                        showActions={true}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
  );
}

export default function StudentCoursesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <StudentCoursesContent />
    </Suspense>
  );
}
