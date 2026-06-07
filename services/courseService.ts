import api from './api';

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

  getCourseById: async (id: number) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
};
