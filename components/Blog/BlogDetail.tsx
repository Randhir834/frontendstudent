'use client';

import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { formatBlogDate, calculateReadingTime } from '@/services/blogService';

interface BlogDetailProps {
  blog: BlogPost;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const publishedDate = formatBlogDate(blog.publishedAt || blog.createdAt);
  const readingTime = calculateReadingTime(blog.content);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {/* Blog Header */}
      <header className="mb-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold">
              {blog.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{blog.author}</p>
              {blog.authorRole && (
                <p className="text-sm text-gray-500">{blog.authorRole}</p>
              )}
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{publishedDate}</span>
          </div>

          {/* Reading Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readingTime}</span>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </header>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Content with preserved formatting */}
          <div
            className="text-gray-800 leading-relaxed whitespace-pre-wrap"
            style={{ lineHeight: '1.8' }}
          >
            {blog.content}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          {/* Author Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl font-semibold">
              {blog.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-600">Written by</p>
              <p className="font-bold text-gray-900 text-lg">{blog.author}</p>
              {blog.authorRole && (
                <p className="text-sm text-gray-600">{blog.authorRole}</p>
              )}
            </div>
          </div>

          {/* Back to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
          >
            Back to Top ↑
          </button>
        </div>
      </footer>
    </article>
  );
}
