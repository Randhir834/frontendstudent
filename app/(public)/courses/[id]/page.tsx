'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, BookOpen, Clock, Users, Star, CheckCircle, Menu, X,
  Award, TrendingUp, Globe, BarChart, PlayCircle, FileText, Video,
  Calendar, Shield, Zap
} from 'lucide-react';
import { courseService } from '@/services/courseService';
import type { Course, Section, Lesson } from '@/types';
import Footer from '@/components/layouts/Footer';

interface CourseDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<(Section & { lessons: Lesson[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseData = await courseService.getPublicCourseById(parseInt(id));
        setCourse(courseData.course);

        // Fetch course sections and lessons (optional - may require authentication)
        try {
          const sectionsData = await courseService.getCourseSections(parseInt(id));
          setSections(sectionsData.sections || []);
        } catch (error) {
          // Silently handle if sections endpoint requires auth or doesn't exist
          console.log('Sections not available:', error);
          setSections([]);
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  };

  const formatDuration = (value: number, unit: string) => {
    return `${value} ${unit}`;
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.location.href = `/#${sectionId}`;
  };

  const handleBuyNow = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Redirect to login with return URL
      router.push(`/login?returnUrl=/courses/${id}`);
    } else {
      // Redirect to payment page
      router.push(`/student/courses/${id}/enroll`);
    }
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Link href="/courses" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const instructorNames = course.instructors?.map(i => i.name).join(', ') || course.instructor_name || 'No instructor';
  const totalLessons = sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
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
                className="text-xs lg:text-sm xl:text-base font-bold text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></span>
              </Link>
              <Link 
                href="/blog"
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Blog
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
                className="block py-3 px-4 text-sm font-bold text-purple-600 bg-purple-50 rounded-lg transition-all touch-target"
              >
                Courses
              </Link>
              <Link 
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Blog
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
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-sm font-bold rounded-lg text-center hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all mt-2 touch-target shadow-lg shadow-purple-500/40 active:scale-95">
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg border border-gray-200">
              {/* Thumbnail */}
              {course.thumbnail_url && (
                <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                </div>
              )}

              {/* Title and Level */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {course.title}
                </h1>
                <span className={`px-3 py-1.5 text-sm font-semibold rounded-lg whitespace-nowrap flex-shrink-0 shadow-md ${
                  course.level === 'beginner' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700' :
                  course.level === 'intermediate' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700' :
                  'bg-gradient-to-r from-red-100 to-pink-100 text-pink-700'
                }`}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
              </div>

              {/* Description */}
              {course.description && (
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                  {course.description}
                </p>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {course.rating && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-100">
                    <Star className="w-6 h-6 text-yellow-600 mb-2 fill-yellow-400" />
                    <div className="text-xs text-gray-600">Rating</div>
                    <div className="text-sm font-bold text-gray-900">{course.rating.toFixed(1)}</div>
                  </div>
                )}
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600">Instructor{course.instructors && course.instructors.length > 1 ? 's' : ''}</div>
                  <div className="font-semibold text-gray-900">{instructorNames}</div>
                </div>
              </div>
            </div>

            {/* Purchase Card - Full Width */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {formatPrice(course.price)}
                  </div>
                  {course.price > 0 && (
                    <div className="text-sm text-gray-600">One-time payment</div>
                  )}
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold rounded-lg transition-all hover:shadow-2xl hover:scale-105 text-lg"
                >
                  {course.price === 0 ? 'Enroll for Free' : 'Buy Now'}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Access on mobile and desktop</span>
                </div>
              </div>
            </div>

            {/* Course Includes - Full Width */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 sm:p-8 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">This course includes:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <Video className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">{totalLessons} video lessons</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">Downloadable resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">Certificate of completion</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">Direct instructor support</span>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            {course.what_you_learn && (
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  What You'll Learn
                </h2>
                <div className="space-y-3">
                  {course.what_you_learn.split('\n').filter(item => item.trim()).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item.replace(/^[•\-*]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && (
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  Requirements
                </h2>
                <div className="space-y-3">
                  {course.requirements.split('\n').filter(item => item.trim()).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item.replace(/^[•\-*]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum */}
            {sections.length > 0 && (
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                  Course Curriculum
                </h2>
                <div className="space-y-3">
                  {sections.map((section, index) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 hover:from-gray-100 hover:to-purple-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-lg text-sm font-bold">
                            {index + 1}
                          </span>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{section.title}</h3>
                            <p className="text-sm text-gray-600">{section.lessons?.length || 0} lessons</p>
                          </div>
                        </div>
                        <div className={`transform transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </button>
                      
                      {expandedSection === section.id && section.lessons && section.lessons.length > 0 && (
                        <div className="p-4 bg-white space-y-2">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                              <PlayCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{lesson.title}</div>
                                {lesson.description && (
                                  <div className="text-sm text-gray-600">{lesson.description}</div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {lesson.duration_minutes} min
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
