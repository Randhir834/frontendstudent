import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogSlugs, getRelatedBlogPosts } from '@/lib/blog';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/siteConfig';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  const canonicalUrl = `${SITE_CONFIG.urls.main}/blog/${params.slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      url: canonicalUrl,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Server component for blog post
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post || !post.published) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug, post.category, 3);

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

  // Structured Data for Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${SITE_CONFIG.urls.main}${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.business.name,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.urls.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.urls.main}/blog/${post.slug}`,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />

        <main className="py-8 sm:py-12 md:py-16">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6 sm:mb-8 group transition-all"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            {/* Article Header */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl mb-6 sm:mb-8">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Written by</p>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <time dateTime={post.date} className="font-medium">
                    {formatDate(post.date)}
                  </time>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{post.readingTime}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed border-l-4 border-purple-500 pl-4 sm:pl-6 bg-purple-50 py-4 rounded-r-lg">
                {post.description}
              </p>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative h-64 sm:h-96">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Article Content */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl mb-8">
              <div className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-700 prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
                prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100
                prose-table:w-full prose-table:border-collapse
                prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 prose-th:font-semibold
                prose-td:border prose-td:border-gray-300 prose-td:p-2
              ">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Related Courses */}
            {post.relatedCourses && post.relatedCourses.length > 0 && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Interested? Check Out These Courses
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.relatedCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/course/${course.id}`}
                      className="block bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-4 border-2 border-white/20 hover:border-white/40 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white/80 mb-1">Course</p>
                          <h4 className="text-lg font-bold text-white">{course.name}</h4>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Share this article</h3>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Share2 className="w-5 h-5" />
                  Share Article
                </button>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      <div className="relative h-40 bg-gradient-to-br from-purple-100 to-pink-100">
                        {relatedPost.image && (
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                View All Articles
              </Link>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
