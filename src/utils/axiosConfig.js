import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Add any auth tokens if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (!error.response && error.message === 'Network Error') {
      // Show offline message using custom event
      window.dispatchEvent(new CustomEvent('app-offline'));
      
      // Try to get cached data if available
      const cachedData = localStorage.getItem(`cache_${error.config.url}`);
      if (cachedData) {
        return Promise.resolve({ data: JSON.parse(cachedData), fromCache: true });
      }
    }
    
    return Promise.reject({
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status || 'ERROR',
      originalError: error
    });
  }
);

// Cache successful responses
axiosInstance.interceptors.response.use(
  response => {
    if (response.config.method === 'get') {
      localStorage.setItem(
        `cache_${response.config.url}`,
        JSON.stringify(response.data)
      );
    }
    return response;
  }
);

export default axiosInstance; 