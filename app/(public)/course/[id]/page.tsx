'use client';

import { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Users, BookOpen, CheckCircle2, CreditCard, Play, Star, Award, FileText, Video, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';
import Footer from '@/components/layouts/Footer';

export default function PublicCourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseRes = await courseService.getCourseById(courseId);
        setCourse(courseRes.course || null);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const instructorNames = useMemo(() => {
    if (!course?.instructors?.length) return course?.instructor_name || 'No instructor';
    return course.instructors.map((i) => i.name).join(', ');
  }, [course]);

  const handleBuyNow = () => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login with return URL
      router.push(`/login?returnUrl=${encodeURIComponent(`/course/${courseId}`)}`);
      return;
    }


    // User is authenticated, redirect to checkout
    if (course && course.price > 0) {
      window.location.href = `/student/checkout?courseId=${courseId}`;
    } else {
      // Free course - redirect to student course page to enroll
      router.push(`/student/course/${courseId}`);
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.location.href = `/#${sectionId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center py-8">
              <BookOpen className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Course not found.</p>
              <Link href="/courses" className="inline-block mt-4">
                <Button variant="outline">Back to Courses</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Header - Same as homepage */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-200 safe-top shadow-lg shadow-purple-500/10">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1920px] mx-auto">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-16 lg:h-18 xl:h-20">
            <Link href="/" className="flex items-center flex-shrink-0 min-w-0">
              <img
                src="/logo.jpg"
                alt="Playfit"
                className="h-7 sm:h-9 md:h-11 lg:h-13 xl:h-15 w-auto object-contain max-w-[100px] xs:max-w-[110px] sm:max-w-[130px] md:max-w-[160px] transition-transform hover:scale-105"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-5">
              <Link 
                href="/courses"
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </Link>
              <a 
                href="/#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <a 
                href="/#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <a 
                href="/#trial" 
                onClick={(e) => scrollToSection(e, 'trial')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Free Trial
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <Link href="/login" className="ml-1 lg:ml-2 xl:ml-3 px-3 md:px-4 lg:px-5 xl:px-6 py-1.5 md:py-2 lg:py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white text-xs lg:text-sm xl:text-base font-bold rounded-full transition-all hover:scale-105 hover:shadow-xl whitespace-nowrap shadow-purple-500/40">
                Login
              </Link>
            </nav>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-purple-50 rounded-lg transition-colors touch-target"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-200 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top duration-300">
            <nav className="px-3 sm:px-4 py-3 space-y-2 max-w-md mx-auto">
              <Link 
                href="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95"
              >
                Courses
              </Link>
              <a 
                href="/#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                About
              </a>
              <a 
                href="/#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Contact
              </a>
              <a 
                href="/#trial" 
                onClick={(e) => scrollToSection(e, 'trial')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Free Trial
              </a>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-sm font-bold rounded-lg text-center hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all mt-2 touch-target shadow-lg shadow-purple-500/40 active:scale-95">
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6 pb-12">
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
              onClick={handleBuyNow}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
            >
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
            </Button>
          </div>
        </div>

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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );

  function formatPrice(price: number) {
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  }
}
