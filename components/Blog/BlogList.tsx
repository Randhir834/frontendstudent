'use client';

import { BlogPost } from '@/types/blog';
import BlogCard from './BlogCard';

interface BlogListProps {
  blogs: BlogPost[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function BlogList({ 
  blogs, 
  loading = false, 
  emptyMessage = 'No blog posts found.' 
}: BlogListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="flex gap-4 pt-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Posts</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  // Separate featured blogs (priority 5) from regular blogs
  const featuredBlogs = blogs.filter(blog => blog.featuredPriority === 5);
  const regularBlogs = blogs.filter(blog => blog.featuredPriority !== 5);

  return (
    <div className="space-y-12">
      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-purple-600">⭐</span>
            Featured Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} featured={true} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Blogs Section */}
      {regularBlogs.length > 0 && (
        <div>
          {featuredBlogs.length > 0 && (
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
