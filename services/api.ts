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
      // Don't add Authorization header for public auth endpoints
      const publicEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/refresh-token'];
      const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
      
      if (!isPublicEndpoint) {
        const token = localStorage.getItem('token');
        const sessionToken = localStorage.getItem('sessionToken');
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (sessionToken) {
          config.headers['X-Session-Token'] = sessionToken;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network errors for debugging
    if (!error.response) {
      console.error('[API] Network Error:', error.message);
      console.error('[API] Request URL:', error.config?.url);
      console.error('[API] Base URL:', error.config?.baseURL);
    }

    // Handle 401 - Unauthorized (invalid/expired token)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        // Only redirect to login if we had a token (meaning we were trying to access protected resource)
        if (token) {
          // Clear all auth data including session token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('sessionToken');
          sessionStorage.removeItem('auth_session');
          sessionStorage.setItem('logout_initiated', 'true');
          
          // Dispatch logout event
          window.dispatchEvent(new Event('auth:logout'));
          
          // Hard redirect to login with cache busting
          window.location.href = `/login?session_expired=${Date.now()}`;
        }
      }
    }
    
    // Don't modify the error - let components handle user-friendly messages
    // via the errorHandler utility
    return Promise.reject(error);
  }
);

export default api;
