'use client';

import Link from 'next/link';
import { Calendar, Clock, User, Star } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { formatBlogDate, calculateReadingTime, getBlogExcerpt } from '@/services/blogService';

interface BlogCardProps {
  blog: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const excerpt = getBlogExcerpt(blog.content, 150);
  const readingTime = calculateReadingTime(blog.content);
  const publishedDate = formatBlogDate(blog.publishedAt || blog.createdAt);

  return (
    <Link href={`/blog/${blog.id}`}>
      <div
        className={`group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-300 h-full flex flex-col ${
          featured ? 'ring-2 ring-purple-500 ring-offset-2' : ''
        }`}
      >
        {/* Featured Badge */}
        {featured && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 flex items-center justify-center gap-2">
            <Star className="w-4 h-4 fill-white" />
            <span className="text-sm font-semibold">Featured Post</span>
          </div>
        )}

        {/* Card Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-3">
            {excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
            {/* Author */}
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-700">{blog.author}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{publishedDate}</span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readingTime}</span>
            </div>
          </div>

          {/* Author Role Badge */}
          {blog.authorRole && (
            <div className="mt-3">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {blog.authorRole}
              </span>
            </div>
          )}
        </div>

        {/* Read More Indicator */}
        <div className="px-6 pb-6">
          <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
            <span>Read More</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
