'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Loader2 } from 'lucide-react';
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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E3A5F]">My Courses</h1>
          <p className="text-xs sm:text-sm text-[#78909C] mt-1">
            {search 
              ? `Search results for "${search}"`
              : 'Track your learning progress and continue your courses'
            }
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="size-12 text-[#E0E0E0] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#1E3A5F] mb-2">
                  {enrollments.length === 0 ? 'No enrolled courses' : 'No courses found'}
                </h3>
                <p className="text-sm text-[#78909C]">
                  {enrollments.length === 0 
                    ? 'Start your learning journey by enrolling in your first course.'
                    : search
                      ? 'Try adjusting your search terms.'
                      : 'No courses found.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                userRole="student"
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
  );
}

export default function MyCoursesPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    }>
      <MyCoursesContent />
    </Suspense>
  );
}
