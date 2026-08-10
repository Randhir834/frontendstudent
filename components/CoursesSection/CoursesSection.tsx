'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Use public method - no authentication required
        const data = await courseService.getPublicCourses({});
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  };

  const formatDuration = (value: number, unit: string) => {
    return `${value} ${unit}${value > 1 ? '' : ''}`;
  };

  // Show first 6 courses on homepage
  const displayedCourses = courses.slice(0, 6);

  if (loading) {
    return (
      <section id="courses" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null; // Don't show section if no courses
  }

  return (
    <section id="courses" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 xs:px-5 py-2 xs:py-2.5 bg-white/80 backdrop-blur-md rounded-full mb-4 xs:mb-6 border border-purple-200 shadow-lg">
            <BookOpen className="w-4 xs:w-5 h-4 xs:h-5 text-purple-600" />
            <span className="text-xs xs:text-sm font-bold text-purple-600">Explore Our Courses</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 xs:mb-4 sm:mb-5 leading-tight">
            Available{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Courses
            </span>
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our collection of expertly designed courses to help you master new skills
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8 mb-8 sm:mb-10 md:mb-12">
          {displayedCourses.map((course) => {
            const instructorNames = course.instructors?.map(i => i.name).join(', ') || course.instructor_name || 'No instructor';

            return (
              <Link 
                key={course.id} 
                href={`/courses/${course.id}`}
                className="group"
              >
                <div className="h-full flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-44 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-44 sm:h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center transition-all duration-300 group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-pink-200">
                        <BookOpen className="w-12 h-12 text-purple-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      {/* Title and Level */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-base sm:text-lg text-gray-800 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight">
                            {course.title}
                          </h3>
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 shadow-sm ${
                            course.level === 'beginner' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700' :
                            course.level === 'intermediate' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700' :
                            'bg-gradient-to-r from-red-100 to-pink-100 text-pink-700'
                          }`}>
                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                          </span>
                        </div>
                        
                        {course.description && (
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        )}
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 p-2 rounded-lg border border-indigo-100">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-gray-700 font-medium truncate">{instructorNames}</span>
                      </div>

                      {/* Course Stats */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-lg">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span className="text-gray-700 font-medium whitespace-nowrap">{formatDuration(course.duration_value, course.duration_unit)}</span>
                          </div>
                          
                          {course.rating && (
                            <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-gray-700 font-semibold">{course.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {formatPrice(course.price)}
                        </div>
                        <div className="text-xs font-semibold text-purple-600 group-hover:text-pink-600 transition-colors flex items-center gap-1">
                          View Details
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        {courses.length > 6 && (
          <div className="text-center">
            <Link href="/courses">
              <button className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-sm sm:text-base font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:scale-105">
                View All Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
