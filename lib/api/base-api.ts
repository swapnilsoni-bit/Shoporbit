import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base axios instance with improved configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com';

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token and logging
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token (client-side only)
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 (Unauthorized) - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Handle network errors - preserve error structure for retry logic
    if (!error.response) {
      // Preserve the original AxiosError so retry logic can detect it
      // Add a flag to indicate it's a network error
      (error as any).isNetworkError = true;
      (error as any).message = error.message || 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    // Handle other errors - preserve structure but add user-friendly message
    const message = (error.response?.data as any)?.message || error.message || 'An error occurred';
    (error as any).userMessage = message;
    return Promise.reject(error);
  }
);

export default axiosInstance;

