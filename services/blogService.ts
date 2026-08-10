import api from './api';
import type { Blog } from '@/types';

interface GetBlogsParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface BlogsResponse {
  success: boolean;
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface BlogResponse {
  success: boolean;
  blog: Blog;
}

interface RecentBlogsResponse {
  success: boolean;
  blogs: Blog[];
}

export const blogService = {
  // Get published blogs (public - no auth required)
  getPublishedBlogs: async (params?: GetBlogsParams): Promise<BlogsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    const url = `/blogs/published${query ? `?${query}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get blog by slug (public - no auth required)
  getBlogBySlug: async (slug: string): Promise<BlogResponse> => {
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  // Get recent blogs (public - no auth required)
  getRecentBlogs: async (limit: number = 3): Promise<RecentBlogsResponse> => {
    const response = await api.get(`/blogs/recent?limit=${limit}`);
    return response.data;
  },
};
