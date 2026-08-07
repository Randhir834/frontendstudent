'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import BlogDetail from '@/components/Blog/BlogDetail';
import BlogList from '@/components/Blog/BlogList';
import { BlogPost } from '@/types/blog';
import { getBlogById, getLatestBlogs } from '@/services/blogService';
import toast from 'react-hot-toast';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const blogId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (blogId) {
      fetchBlogPost();
      fetchRelatedBlogs();
    }
  }, [blogId]);

  const fetchBlogPost = async () => {
    if (!blogId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getBlogById(blogId);
      
      // Check if blog is published (approved status)
      if (data.status !== 'approved') {
        setError('This blog post is not available.');
        return;
      }
      
      setBlog(data);
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load blog post. It may not exist or is no longer available.');
      toast.error('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const blogs = await getLatestBlogs(3);
      // Filter out the current blog
      const filtered = blogs.filter(b => b.id !== blogId);
      setRelatedBlogs(filtered.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading blog post...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The blog post you are looking for does not exist or is no longer available.'}</p>
            <button
              onClick={() => router.push('/blog')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogDetail blog={blog} />

        {/* Related Posts Section */}
        {relatedBlogs.length > 0 && (
          <div className="mt-20">
            <div className="border-t border-gray-200 pt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                More from Our Blog
              </h2>
              <BlogList blogs={relatedBlogs} />
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            Get notified when we publish new blog posts about learning, creativity, and skill development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="w-full sm:w-auto px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-white/70 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
