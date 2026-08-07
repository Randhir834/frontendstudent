import axios from 'axios';
import { BlogPost, BlogPostSubmission, BlogListResponse } from '@/types/blog';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Helper function to transform review API response to blog format
const transformReviewToBlog = (review: any): BlogPost => ({
  id: review.id,
  title: review.course_name || 'Untitled Post',
  content: review.message,
  author: review.name,
  authorRole: review.role || 'Guest Author',
  featuredPriority: review.rating || 3,
  status: review.status,
  email: review.email,
  phone: review.phone,
  adminNotes: review.admin_notes,
  publishedBy: review.reviewed_by,
  publishedByName: review.reviewed_by_name,
  publishedAt: review.reviewed_at,
  createdAt: review.created_at,
  updatedAt: review.updated_at,
});

// Get all published blog posts (public endpoint)
export const getPublishedBlogs = async (params?: {
  limit?: number;
  featuredPriority?: number;
}): Promise<BlogListResponse> => {
  try {
    const response = await axios.get(`${API_URL}/api/reviews/approved`, {
      params: {
        limit: params?.limit || 50,
        rating: params?.featuredPriority,
      },
    });

    return {
      blogs: response.data.reviews.map(transformReviewToBlog),
      total: response.data.total,
    };
  } catch (error: any) {
    console.error('Error fetching published blogs:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch blog posts');
  }
};

// Get a single blog post by ID (public endpoint)
export const getBlogById = async (id: number): Promise<BlogPost> => {
  try {
    const response = await axios.get(`${API_URL}/api/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
      },
    });

    return transformReviewToBlog(response.data.review);
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch blog post');
  }
};

// Submit a new blog post (public endpoint - goes to pending status)
export const submitBlogPost = async (data: BlogPostSubmission): Promise<{ message: string; id: number }> => {
  try {
    const response = await axios.post(`${API_URL}/api/reviews/submit`, {
      name: data.author,
      role: data.authorRole || 'Guest Author',
      rating: data.featuredPriority || 3,
      message: data.content,
      courseName: data.title,
      email: data.email,
      phone: data.phone,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error submitting blog post:', error);
    throw new Error(error.response?.data?.error || 'Failed to submit blog post');
  }
};

// Get blog posts by featured priority (5 stars = featured)
export const getFeaturedBlogs = async (limit: number = 10): Promise<BlogPost[]> => {
  try {
    const response = await getPublishedBlogs({ limit, featuredPriority: 5 });
    return response.blogs;
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return [];
  }
};

// Get latest blog posts
export const getLatestBlogs = async (limit: number = 10): Promise<BlogPost[]> => {
  try {
    const response = await getPublishedBlogs({ limit });
    return response.blogs;
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
    return [];
  }
};

// Get excerpt from blog content (first n characters)
export const getBlogExcerpt = (content: string, maxLength: number = 200): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

// Format blog date
export const formatBlogDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate reading time (assuming 200 words per minute)
export const calculateReadingTime = (content: string): string => {
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
};
