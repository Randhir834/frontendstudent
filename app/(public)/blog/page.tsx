'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import BlogList from '@/components/Blog/BlogList';
import { BlogPost } from '@/types/blog';
import { getPublishedBlogs } from '@/services/blogService';
import toast from 'react-hot-toast';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getPublishedBlogs({ limit: 100 });
      setBlogs(response.blogs);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              PlayFit Blog
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Insights, stories, and updates from the PlayFit community. Discover tips on learning, creativity, and skill development for kids.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Banner */}
        {!loading && blogs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 mb-12">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600">{blogs.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Posts</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-pink-600">
                  {blogs.filter(b => b.featuredPriority === 5).length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Featured</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {new Set(blogs.map(b => b.author)).size}
                </div>
                <div className="text-sm text-gray-600 font-medium">Authors</div>
              </div>
            </div>
          </div>
        )}

        {/* Blog List */}
        <BlogList
          blogs={blogs}
          loading={loading}
          emptyMessage="No blog posts available yet. Check back soon for updates!"
        />

        {/* CTA Section */}
        {!loading && blogs.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Want to Share Your Story?</h2>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              We'd love to feature your experiences and insights on our blog. Share your learning journey with the PlayFit community!
            </p>
            <a
              href="mailto:contact@playfitclasses.com?subject=Blog Contribution"
              className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
