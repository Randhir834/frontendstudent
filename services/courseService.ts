import api from './api';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const courseService = {
  getCourses: async (filters?: { 
    search?: string; 
    category_id?: string; 
    level?: string; 
    price_range?: string; 
    sort_by?: string; 
    sort_order?: string; 
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/courses${query}`);
    return response.data;
  },

  getPublishedCourses: async (filters?: { 
    search?: string; 
    category_id?: string; 
    level?: string; 
    price_range?: string; 
    sort_by?: string; 
    sort_order?: string; 
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/courses/published${query}`);
    return response.data;
  },

  // Public method - no authentication required
  getPublicCourses: async (filters?: { 
    search?: string; 
    category_id?: string; 
    level?: string; 
    price_range?: string; 
    sort_by?: string; 
    sort_order?: string;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await axios.get(`${API_URL}/courses/published${query}`);
    return response.data;
  },

  // Public method - no authentication required
  getPublicCourseById: async (id: number) => {
    const response = await axios.get(`${API_URL}/courses/${id}`);
    return response.data;
  },

  getCourseById: async (id: number) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Get course sections and lessons
  getCourseSections: async (courseId: number) => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/sections`);
    return response.data;
  },
};
