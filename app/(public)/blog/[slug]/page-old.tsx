'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, Menu, X } from 'lucide-react';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types';
import Footer from '@/components/layouts/Footer';

export default function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogBySlug(slug);
        setBlog(data.blog);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.location.href = `/#${sectionId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
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
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </Link>
              <Link 
                href="/blog"
                className="text-xs lg:text-sm xl:text-base font-bold text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Blog
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></span>
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
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95"
              >
                Courses
              </Link>
              <Link 
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-sm font-bold text-purple-600 bg-purple-50 rounded-lg transition-all touch-target"
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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6 sm:mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          {/* Blog Header */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Written by</p>
                  <p className="font-semibold text-gray-900">{blog.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-medium">{formatDate(blog.publication_date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-medium">{calculateReadTime(blog.content)}</span>
              </div>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-purple-500 pl-4 bg-purple-50 py-3 rounded-r-lg">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Featured Image */}
          {blog.featured_image_url && (
            <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={blog.featured_image_url}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl mb-6 sm:mb-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {blog.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return null;
                  
                  // Check if it's a heading (starts with #)
                  if (paragraph.trim().startsWith('# ')) {
                    return (
                      <h2 key={index} className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">
                        {paragraph.replace('# ', '')}
                      </h2>
                    );
                  }
                  
                  // Check if it's a subheading (starts with ##)
                  if (paragraph.trim().startsWith('## ')) {
                    return (
                      <h3 key={index} className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-3">
                        {paragraph.replace('## ', '')}
                      </h3>
                    );
                  }

                  // Check if it's a list item (starts with - or *)
                  if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                    return (
                      <li key={index} className="ml-6 mb-2">
                        {paragraph.replace(/^[*-]\s/, '')}
                      </li>
                    );
                  }

                  // Regular paragraph
                  return (
                    <p key={index} className="mb-4 text-base sm:text-lg">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share this article</h3>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Share2 className="w-5 h-5" />
                Copy Link
              </button>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-8 sm:mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              View All Articles
            </Link>
          </div>
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
