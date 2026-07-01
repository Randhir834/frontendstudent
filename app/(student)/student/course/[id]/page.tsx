'use client';

import { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Users, BookOpen, CheckCircle2, CreditCard, Play, Star, Award, FileText, Video } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import type { Course } from '@/types';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [courseRes, enrollRes] = await Promise.all([
          courseService.getCourseById(courseId),
          enrollmentService.checkEnrollment(courseId).catch(() => ({ enrolled: false })),
        ]);
        setCourse(courseRes.course || null);
        setEnrolled(!!enrollRes.enrolled);
        setEnrollmentData(enrollRes);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [courseId]);

  const instructorNames = useMemo(() => {
    if (!course?.instructors?.length) return course?.instructor_name || 'No instructor';
    return course.instructors.map((i) => i.name).join(', ');
  }, [course]);

  const handleEnroll = async () => {
    if (!course) return;

    try {
      setEnrollLoading(true);
      
      if (course.price > 0) {
        // Redirect to checkout page for paid courses
        window.location.href = `/student/checkout?courseId=${courseId}`;
      } else {
        await enrollmentService.enrollCourse(courseId);
        setEnrolled(true);
        alert('Successfully enrolled in the free course!');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to enroll';
      alert(msg);
    } finally {
      setEnrollLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="size-12 text-[#E0E0E0] mx-auto mb-3" />
              <p className="text-sm text-[#78909C]">Course not found.</p>
              <Link href="/student/courses" className="inline-block mt-4">
                <Button variant="outline">Back to Courses</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Hero Section - Title and Badges */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-2xl blur-3xl opacity-30 -z-10"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full shadow-md ${
              course.level === 'beginner' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
              course.level === 'intermediate' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' :
              'bg-gradient-to-r from-red-500 to-pink-600 text-white'
            }`}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
            {enrolled && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-md flex items-center gap-2">
                <CheckCircle2 className="size-3 sm:size-4" />
                Enrolled
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight mb-3 sm:mb-4">
            {course.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="size-4 sm:size-5 text-white" />
              </div>
              <span className="font-medium text-xs sm:text-sm">{instructorNames}</span>
            </div>
            {course.rating && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="size-4 sm:size-5 text-white fill-white" />
                </div>
                <span className="font-semibold text-sm sm:text-base">{course.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price and Buy Button */}
      {!enrolled && (
        <div className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl opacity-50"></div>
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(course.price)}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">One-time payment</p>
            </div>
            
            <Button
              onClick={handleEnroll}
              disabled={enrollLoading}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
            >
              {enrollLoading ? (
                <>
                  <Loader2 className="size-4 sm:size-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {course.price > 0 ? (
                    <>
                      <CreditCard className="size-4 sm:size-5" />
                      Buy Now
                    </>
                  ) : (
                    <>
                      <Play className="size-4 sm:size-5" />
                      Enroll Free
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Progress Bar for Enrolled Students */}
      {enrolled && enrollmentData?.progress !== undefined && (
        <div className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-2xl opacity-50"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                <Award className="size-5 sm:size-6 text-purple-600" />
                Your Progress
              </span>
              <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round(enrollmentData.progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 h-3 sm:h-4 rounded-full transition-all duration-500"
                style={{ width: `${enrollmentData.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* About This Course */}
      {course.description && (
        <div className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl opacity-50"></div>
          <div className="relative">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <BookOpen className="size-5 sm:size-6 text-purple-600" />
              About This Course
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{course.description}</p>
          </div>
        </div>
      )}

      {/* What You'll Learn */}
      {course.what_you_learn && (
        <div className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-2xl opacity-50"></div>
          <div className="relative">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Award className="size-5 sm:size-6 text-blue-600" />
              What You'll Learn
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {course.what_you_learn.split('\n').filter(item => item.trim()).map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <CheckCircle2 className="size-4 sm:size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">{item.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Requirements */}
      {course.requirements && (
        <div className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 rounded-2xl opacity-50"></div>
          <div className="relative">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <FileText className="size-5 sm:size-6 text-pink-600" />
              Requirements
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {course.requirements.split('\n').filter(item => item.trim()).map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="size-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">{item.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course Includes */}
      {!enrolled && (
        <div className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl opacity-50"></div>
          <div className="relative">
            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">This course includes:</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-200">
                <CheckCircle2 className="size-4 sm:size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">One-on-one mentoring sessions</span>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
                <CheckCircle2 className="size-4 sm:size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Flexible scheduling</span>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-pink-50 rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition-all duration-200">
                <CheckCircle2 className="size-4 sm:size-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Course materials and resources</span>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-green-50 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-200">
                <CheckCircle2 className="size-4 sm:size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Certificate of completion</span>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-200">
                <CheckCircle2 className="size-4 sm:size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Lifetime access to course content</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Success Message */}
      {enrolled && (
        <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10"></div>
          <div className="relative text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <CheckCircle2 className="size-8 sm:size-10 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
              You're Enrolled!
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
              Your instructor will schedule live classes for you. Check the Live Classes page for upcoming sessions.
            </p>
            <Link href="/student/live-classes">
              <Button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 text-sm sm:text-base">
                <Video className="size-5 sm:size-6" />
                View Live Classes
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  function formatPrice(price: number) {
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  }
}