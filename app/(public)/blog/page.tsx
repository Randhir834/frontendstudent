import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { generatePageMetadata } from '@/lib/metadata';
import { getPublishedBlogPostsMetadata } from '@/lib/blog';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'Education Blog for Parents – Tips for Kids\' Learning',
    description: `Expert advice on online learning, child development, and skill-building for kids aged ${SITE_CONFIG.audience.ageRange}. Parenting tips, activity ideas, and education insights.`,
    path: '/blog',
  }),
  // Set noindex until we have 3+ published posts
  robots: {
    index: false,
    follow: true,
  },
};

// Server-side rendered blog page
export default function BlogPage() {
  const posts = getPublishedBlogPostsMetadata();
  const hasEnoughPosts = posts.length >= 3;

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-12 sm:mb-16 text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Education & Parenting</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 pb-2">
                {SITE_CONFIG.business.name} Blog
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Expert articles on child education, online learning tips, and skill development strategies for kids aged {SITE_CONFIG.audience.ageDisplay}.
            </p>
          </div>

          {posts.length === 0 ? (
            /* Coming Soon Section */
            <>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-xl mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
                  Blog Coming Soon
                </h2>
                <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
                  We're working on bringing you valuable content about child education, online learning, and skill development. Check back soon!
                </p>
              </div>

              {/* Suggested Topics Grid */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Upcoming Topics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {[
                    { title: "10 Benefits of Online Learning for Kids", desc: "Discover how digital education enhances learning outcomes." },
                    { title: "Building Confidence Through Public Speaking", desc: "How classes help children develop self-assurance." },
                    { title: "Phonics vs Traditional Reading Methods", desc: "Comparing approaches to teaching children to read." },
                    { title: "Parent's Guide to Choosing Online Classes", desc: "Tips for selecting the right courses for your child." },
                  ].map((topic, i) => (
                    <article key={i} className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-800 mb-2">{topic.title}</h3>
                      <p className="text-sm text-gray-600">{topic.desc}</p>
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Blog Posts Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.map((post) => (
                <article key={post.slug} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  {/* Featured Image */}
                  <Link href={`/blog/${post.slug}`} className="block relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-purple-300" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-purple-600 shadow-md">
                        {post.category}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-purple-600 font-semibold text-sm hover:gap-2 transition-all"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 sm:mt-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Your Child's Learning Journey?
            </h2>
            <p className="text-white/90 text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join {SITE_CONFIG.stats.students} students learning with expert instructors at {SITE_CONFIG.business.name}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#trial"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Book Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-all border-2 border-white/30"
              >
                View All Courses
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
