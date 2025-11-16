import axios from 'axios';

// Base axios instance configuration
const API_BASE = 'https://fakestoreapi.com';

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased to 30 seconds for server-side calls
});

export default axiosInstance;

