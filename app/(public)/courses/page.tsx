import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Star, ArrowRight } from 'lucide-react';
import type { Course } from '@/types';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const metadata: Metadata = {
  title: 'All Courses for Kids (Ages 4–10) – Live Online & Kolkata',
  description: 'Browse 11+ live online courses for kids: Phonics, Public Speaking, Art, Chess, Piano, Abacus, Coding, and Rubik\'s Cube. Expert instructors, flexible scheduling.',
  openGraph: {
    title: 'All Courses for Kids (Ages 4–10) – Live Online & Kolkata | PlayFit',
    description: 'Browse 11+ live online courses for kids: Phonics, Public Speaking, Art, Chess, Piano, Abacus, Coding, and Rubik\'s Cube. Expert instructors, flexible scheduling.',
    url: 'https://playfitclasses.com/courses',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Courses for Kids (Ages 4–10) – Live Online & Kolkata | PlayFit',
    description: 'Browse 11+ courses: Phonics, Art, Chess, Piano, Public Speaking, Abacus, Coding. Live online classes for kids aged 4–10.',
    images: ['/logo.jpg'],
  },
  alternates: {
    canonical: '/courses',
  },
};

async function getCourses() {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      next: { revalidate: 3600 },
      cache: 'force-cache'
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.courses || [];
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />

      {/* Main Content - Server-side rendered */}
      <main className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header with H1 */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
                Online Courses for Kids
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore our live, interactive skill development courses for children aged 4-10. Expert instructors, flexible scheduling, and personalized learning.
            </p>
          </div>

          {/* Courses Grid */}
          {courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: Course) => {
                const instructorNames = course.instructors?.map((i: any) => i.name).join(', ') || course.instructor_name || 'Expert Instructor';

                return (
                  <Link 
                    key={course.id} 
                    href={`/course/${course.id}`}
                    className="group"
                  >
                    <article className="h-full flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden h-48">
                        {course.thumbnail_url ? (
                          <Image
                            src={course.thumbnail_url}
                            alt={`${course.title} - Online course for kids`}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                            width={400}
                            height={192}
                            loading="lazy"
                            unoptimized={!course.thumbnail_url.includes('supabase')}
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
                              <h2 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight pb-0.5">
                                {course.title}
                              </h2>
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

                          {/* Course Stats */}
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              {course.rating && (
                                <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-gray-700 font-semibold">{course.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="text-xs font-semibold text-purple-600 group-hover:text-pink-600 transition-colors flex items-center gap-1 ml-auto">
                              View Details
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Courses Available</h2>
              <p className="text-gray-600 mb-6">
                Check back soon for new courses!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
