import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your backend API URL
  timeout: 5000, // Timeout after 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
