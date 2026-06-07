'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Loader2, Award } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CourseCard from '@/components/ui/CourseCard';
import UpcomingLiveClasses from '@/components/UpcomingLiveClasses';
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

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter(e => e.progress > 0 && e.progress < 100).length,
    completed: enrollments.filter(e => e.progress === 100).length,
    notStarted: enrollments.filter(e => e.progress === 0).length
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E3A5F]">My Courses</h1>
            <p className="text-xs sm:text-sm text-[#78909C] mt-1">
              {search 
                ? `Search results for "${search}"`
                : 'Track your learning progress and continue your courses'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/student/courses">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <BookOpen className="size-3 sm:size-4" />
                <span className="hidden xs:inline">Browse Courses</span>
                <span className="xs:hidden">Browse</span>
              </Button>
            </Link>
            <Link href="/student/certificates">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <Award className="size-4" />
                Certificates
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E3A5F]">{stats.total}</div>
                <div className="text-sm text-[#78909C]">Enrolled Courses</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E88E5]">{stats.completed}</div>
                <div className="text-sm text-[#78909C]">Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#D97706]">{stats.inProgress}</div>
                <div className="text-sm text-[#78909C]">In Progress</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#78909C]">{stats.notStarted}</div>
                <div className="text-sm text-[#78909C]">Not Started</div>
              </div>
            </CardContent>
          </Card>
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
                <p className="text-sm text-[#78909C] mb-6">
                  {enrollments.length === 0 
                    ? 'Start your learning journey by enrolling in your first course.'
                    : search
                      ? 'Try adjusting your search terms.'
                      : 'No courses found.'
                  }
                </p>
                {enrollments.length === 0 && (
                  <Link href="/student/courses">
                    <Button className="flex items-center gap-2">
                      <BookOpen className="size-4" />
                      Browse Courses
                    </Button>
                  </Link>
                )}
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

        {/* Upcoming Live Classes */}
        {enrollments.length > 0 && (
          <div className="mt-6">
            <UpcomingLiveClasses />
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