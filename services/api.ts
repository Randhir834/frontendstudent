import axios from 'axios';
import API_BASE_URL from './apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Unauthorized (invalid/expired token)
    // BUT only redirect if the request had an auth token
    // This prevents redirecting on public endpoints that return 401
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        // Only redirect to login if we had a token (meaning we were trying to access protected resource)
        if (token) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    
    // Pass through all other errors (404, 500, network errors, etc.)
    // Let the page handle them appropriately
    return Promise.reject(error);
  }
);

export default api;
