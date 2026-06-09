'use client';

import { useEffect, useState, Suspense } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import CourseCard from '@/components/ui/CourseCard';
import { courseService } from '@/services/courseService';
import { categoryService } from '@/services/categoryService';
import { enrollmentService } from '@/services/enrollmentService';
import type { Course } from '@/types';

function StudentCoursesContent() {
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
    fetchCourses();
  }, []);

  const enrolledCourses = courses.filter(c => c.is_enrolled);

  const stats = {
    total: courses.length,
    enrolled: enrolledCourses.length,
    available: courses.filter(c => !c.is_enrolled).length,
    completed: enrolledCourses.filter(c => c.progress === 100).length
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E3A5F]">
            Browse Courses
          </h1>
          <p className="text-xs sm:text-sm text-[#78909C] mt-1">
            Discover and enroll in courses that match your interests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1E3A5F]">{stats.total}</div>
                <div className="text-xs sm:text-sm text-[#78909C]">Available Courses</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1E88E5]">{stats.enrolled}</div>
                <div className="text-xs sm:text-sm text-[#78909C]">Enrolled</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#AB47BC]">{stats.completed}</div>
                <div className="text-xs sm:text-sm text-[#78909C]">Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#D97706]">{stats.available}</div>
                <div className="text-xs sm:text-sm text-[#78909C]">New Courses</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Sections */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="size-12 text-[#E0E0E0] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#1E3A5F] mb-2">No courses found</h3>
                <p className="text-sm text-[#78909C] mb-6">
                  No courses are currently available. Check back later for new content.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* All Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-[#1E3A5F]">All Courses</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    userRole="student"
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default function StudentCoursesPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    }>
      <StudentCoursesContent />
    </Suspense>
  );
}
