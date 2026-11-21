import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Users, Star, Award, CheckCircle2, FileText } from 'lucide-react';
import type { Course } from '@/types';
import CourseSchema from '@/components/SEO/CourseSchema';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function getCourse(id: string) {
  try {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      next: { revalidate: 3600 },
      cache: 'force-cache'
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.course || null;
  } catch (error) {
    console.error('Failed to fetch course:', error);
    return null;
  }
}

// Generate static params for all courses at build time
export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) return [];
    const data = await response.json();
    const courses = data.courses || [];
    
    return courses.map((course: Course) => ({
      id: String(course.id),
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.',
    };
  }

  // Build age range if available
  const ageRange = course.min_age && course.max_age 
    ? `Ages ${course.min_age}–${course.max_age}` 
    : 'All Ages';

  // Build title with course name + age + location
  const title = `${course.title} for Kids (${ageRange}) – Online & Kolkata`;
  
  // Trim description to 155 characters
  let description = course.description || `Learn ${course.title} with expert instructors at PlayFit. Live interactive classes for kids.`;
  if (description.length > 155) {
    description = description.substring(0, 152) + '...';
  }

  const ogImage = course.thumbnail_url || '/logo.jpg';
  
  return {
    title,
    description,
    openGraph: {
      title: `${title} | PlayFit`,
      description,
      url: `https://playfitclasses.com/course/${course.id}`,
      images: course.thumbnail_url ? [
        {
          url: course.thumbnail_url,
          width: 1200,
          height: 630,
          alt: `${course.title} - PlayFit Online Course`,
        }
      ] : ['/logo.jpg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | PlayFit`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/course/${course.id}`,
    },
  };
}

export default async function PublicCourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  const instructorNames = course.instructors?.map((i: any) => i.name).join(', ') || course.instructor_name || 'Expert Instructors';
  const ageRange = course.min_age && course.max_age 
    ? `Ages ${course.min_age}–${course.max_age}` 
    : 'All Ages';

  return (
    <>
      {/* Course Schema with hasCourseInstance */}
      <CourseSchema
        id={course.id}
        name={course.title}
        description={course.description || `Learn ${course.title} with expert instructors at PlayFit.`}
        duration={course.duration_value > 0 ? {
          value: course.duration_value,
          unit: course.duration_unit || 'days'
        } : undefined}
        level={course.level}
        minAge={course.min_age}
        maxAge={course.max_age}
        language={course.language}
        totalLessons={course.total_lessons}
      />
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://playfitclasses.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Courses",
                "item": "https://playfitclasses.com/courses"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": course.title,
                "item": `https://playfitclasses.com/course/${course.id}`
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <Header />

        {/* Main Content - Server-side rendered */}
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-purple-600 transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{course.title}</span>
          </nav>

          {/* Hero Section - H1 and Badges */}
          <article className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-2xl blur-3xl opacity-30 -z-10"></div>
            
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

            {/* H1 - Course Title (CRITICAL FOR SEO) */}
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
          </article>

          {/* Book Free Trial Section */}
          <section className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl opacity-50"></div>
            <div className="relative text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Book a free trial class and experience our interactive learning firsthand!
              </p>
              <Link 
                href="/#trial"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                <Users className="size-4 sm:size-5" />
                Book a Free Trial
              </Link>
            </div>
          </section>

          {/* H2: What Your Child Will Learn */}
          {course.what_you_learn && (
            <section className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-2xl opacity-50"></div>
              <div className="relative">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <Award className="size-5 sm:size-6 text-blue-600" />
                  What Your Child Will Learn
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {course.what_you_learn.split('\n').filter((item: string) => item.trim()).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-blue-100 shadow-sm">
                      <CheckCircle2 className="size-4 sm:size-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* H2: Age Group & Duration */}
          <section className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl opacity-50"></div>
            <div className="relative">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <BookOpen className="size-5 sm:size-6 text-purple-600" />
                Age Group & Duration
              </h2>
              <div className="space-y-3">
                <p className="text-sm sm:text-base text-gray-700">
                  <strong>Perfect for:</strong> {ageRange}
                </p>
                {course.description && (
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{course.description}</p>
                )}
              </div>
            </div>
          </section>

          {/* H2: Class Format */}
          <section className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl opacity-50"></div>
            <div className="relative">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Class Format</h2>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-3 p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-100 shadow-sm">
                  <CheckCircle2 className="size-4 sm:size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">One-on-one mentoring sessions</span>
                </li>
                <li className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
                  <CheckCircle2 className="size-4 sm:size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Flexible scheduling</span>
                </li>
                <li className="flex items-start gap-3 p-3 sm:p-4 bg-pink-50 rounded-xl border border-pink-100 shadow-sm">
                  <CheckCircle2 className="size-4 sm:size-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Course materials and resources</span>
                </li>
                <li className="flex items-start gap-3 p-3 sm:p-4 bg-green-50 rounded-xl border border-green-100 shadow-sm">
                  <CheckCircle2 className="size-4 sm:size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Certificate of completion</span>
                </li>
                <li className="flex items-start gap-3 p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-100 shadow-sm">
                  <CheckCircle2 className="size-4 sm:size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Lifetime access to course content</span>
                </li>
              </ul>
            </div>
          </section>

          {/* H2: Instructors */}
          <section className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 rounded-2xl opacity-50"></div>
            <div className="relative">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="size-5 sm:size-6 text-indigo-600" />
                Instructors
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                This course is taught by <strong>{instructorNames}</strong>, experienced educators dedicated to helping children develop essential skills through engaging, interactive lessons.
              </p>
            </div>
          </section>

          {/* H2: Requirements (if available) */}
          {course.requirements && (
            <section className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 rounded-2xl opacity-50"></div>
              <div className="relative">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="size-5 sm:size-6 text-pink-600" />
                  Requirements
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {course.requirements.split('\n').filter((item: string) => item.trim()).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="size-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
