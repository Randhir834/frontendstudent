'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import CourseCard from '@/components/ui/CourseCard';
import { enrollmentService } from '@/services/enrollmentService';
import type { Course } from '@/types';

function MyCoursesContent() {
  const searchParams = useSearchParams();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const search = searchParams?.get('search') || '';

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const data = await enrollmentService.getEnrollments();
        setEnrollments(data.enrollments || []);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  // Filter enrollments based on search only
  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = !search || 
      enrollment.course_title?.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.course_description?.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  // Convert enrollments to course format for CourseCard
  const courses: Course[] = filteredEnrollments.map(enrollment => ({
    id: enrollment.course_id,
    title: enrollment.course_title || 'Untitled Course',
    description: enrollment.course_description,
    thumbnail_url: enrollment.thumbnail_url,
    price: 0,
    status: 'published' as const,
    duration_value: enrollment.duration_value || 0,
    duration_unit: enrollment.duration_unit || 'days',
    level: enrollment.level || 'beginner',
    language: 'English',
    is_enrolled: true,
    progress: enrollment.progress,
    instructors: enrollment.instructors,
    created_at: enrollment.created_at,
    updated_at: enrollment.updated_at
  }));

  return (
    <div className="p-4 sm:p-5 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5 sm:space-y-6">
        {/* Header - Enhanced */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl blur-3xl opacity-30 -z-10"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  My Courses
                </h1>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 ml-15">
              {search 
                ? `Search results for "${search}"`
                : 'Track your learning progress and continue your courses'
              }
            </p>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 border border-gray-200 shadow-lg">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {enrollments.length === 0 ? 'No enrolled courses yet' : 'No courses found'}
              </h3>
              <p className="text-base text-gray-600 max-w-md mx-auto mb-6">
                {enrollments.length === 0 
                  ? 'Start your learning journey by enrolling in your first course.'
                  : search
                    ? 'Try adjusting your search terms.'
                    : 'No courses found.'
                }
              </p>
              {enrollments.length === 0 && (
                <button
                  onClick={() => window.location.href = '/student/courses'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all hover:scale-105 shadow-lg"
                >
                  Browse Courses
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
        )}
      </div>
  );
}

export default function MyCoursesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <MyCoursesContent />
    </Suspense>
  );
}
