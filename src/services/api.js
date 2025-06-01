import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Accept': 'application/json'
    // Remove default Content-Type to allow FormData to set it automatically
  }
});

// Request interceptor to add auth token and logging
API.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('ecoquest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set Content-Type only for non-FormData requests
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Enhanced logging for debugging
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? '[PRESENT]' : '[MISSING]'
      },
      data: config.data instanceof FormData ? '[FormData]' : config.data,
      isFormData: config.data instanceof FormData
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for enhanced error handling (keep the same as before)
API.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.config?.data instanceof FormData ? '[FormData]' : error.config?.data,
      responseData: error.response?.data
    };
    
    console.error('❌ API Error Details:', errorDetails);
    
    // Handle different error statuses
    switch (error.response?.status) {
      case 400:
        console.error('🔴 Bad Request (400):', {
          url: error.config?.url,
          sentData: error.config?.data instanceof FormData ? '[FormData]' : error.config?.data,
          serverResponse: error.response?.data,
          possibleCauses: [
            'Invalid request data format',
            'Missing required fields', 
            'Invalid challenge ID',
            'Challenge already completed',
            'User not joined to challenge',
            'FormData Content-Type issue'
          ]
        });
        break;
        
      case 401:
        console.warn('🔐 Unauthorized (401): Redirecting to login...');
        localStorage.removeItem('ecoquest_token');
        localStorage.removeItem('ecoquest_user');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        break;
        
      case 403:
        console.error('🚫 Forbidden (403): Access denied');
        break;
        
      case 404:
        console.error('🔍 Not Found (404): Resource not found');
        break;
        
      case 422:
        console.error('📝 Validation Error (422):', error.response?.data);
        break;
        
      case 500:
        console.error('💥 Server Error (500): Internal server error');
        break;
        
      default:
        console.error('❓ Unknown Error:', error.response?.status);
    }
    
    return Promise.reject(error);
  }
);

// Rest of the code remains the same...
export const validateToken = () => {
  const token = localStorage.getItem('ecoquest_token');
  if (!token) {
    console.warn('⚠️ No authentication token found');
    return false;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      console.warn('⚠️ Token expired');
      localStorage.removeItem('ecoquest_token');
      localStorage.removeItem('ecoquest_user');
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('❌ Invalid token format');
    localStorage.removeItem('ecoquest_token');
    localStorage.removeUser('ecoquest_user');
    return false;
  }
};

export const debugApiCall = async (method, url, data = null) => {
  console.log('🔍 Debug API Call:', {
    method: method.toUpperCase(),
    fullUrl: `${API.defaults.baseURL}${url}`,
    hasToken: !!localStorage.getItem('ecoquest_token'),
    data: data instanceof FormData ? '[FormData]' : data,
    isFormData: data instanceof FormData
  });
  
  try {
    const response = await API[method.toLowerCase()](url, data);
    console.log('✅ Debug Response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Debug Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      fullError: error.response?.data
    });
    throw error;
  }
};

export default API;