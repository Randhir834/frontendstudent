'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Users, Star, Search, Filter, X, Menu, ArrowRight } from 'lucide-react';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const filters: any = {};
        if (searchTerm) filters.search = searchTerm;
        if (levelFilter) filters.level = levelFilter;
        if (sortBy) {
          const [sort_by, sort_order] = sortBy.split('_');
          filters.sort_by = sort_by;
          filters.sort_order = sort_order;
        }
        
        const data = await courseService.getPublicCourses(filters);
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, levelFilter, sortBy]);

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

  const clearFilters = () => {
    setSearchTerm('');
    setLevelFilter('');
    setSortBy('');
  };

  const hasActiveFilters = searchTerm || levelFilter || sortBy;

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
      <main className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full mb-6 border border-purple-200 shadow-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">All Courses</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
              Explore Our{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Courses
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through our comprehensive collection of courses designed to help you achieve your learning goals
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                )}
              </button>

              {/* Filters (Desktop) */}
              <div className="hidden sm:flex gap-4">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">Sort By</option>
                  <option value="title_asc">Title (A-Z)</option>
                  <option value="title_desc">Title (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="created_at_desc">Newest First</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="sm:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">Sort By</option>
                  <option value="title_asc">Title (A-Z)</option>
                  <option value="title_desc">Title (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="created_at_desc">Newest First</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-3 text-purple-600 hover:text-purple-700 font-semibold border border-purple-200 rounded-lg"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-6 text-gray-600">
              <span className="font-semibold">{courses.length}</span> course{courses.length !== 1 ? 's' : ''} found
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
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
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center transition-all duration-300 group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-pink-200">
                            <BookOpen className="w-12 h-12 text-purple-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="space-y-3 flex-1">
                          {/* Title and Level */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight">
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
                              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
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
                            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
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
          )}

          {/* Empty State */}
          {!loading && courses.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters 
                  ? "Try adjusting your filters or search terms"
                  : "No courses are available at the moment"
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
