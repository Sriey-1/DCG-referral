
import axios from 'axios';

// Create axios instance with base URL
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API error:', error);
    if (error.response && error.response.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Login request to:', `${API_URL}/auth/login`);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response received:', response.status);
      return response.data;
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }
};

// Referral services
export const referralService = {
  getAllReferrals: async () => {
    const response = await api.get('/referrals');
    return response.data;
  },
  createReferral: async (referralData: any) => {
    const response = await api.post('/referrals', referralData);
    return response.data;
  }
};

// Deal services
export const dealService = {
  getAllDeals: async () => {
    const response = await api.get('/deals');
    return response.data;
  },
  createDeal: async (dealData: any) => {
    const response = await api.post('/deals', dealData);
    return response.data;
  }
};

// Report services
export const reportService = {
  getReferralsReport: async (sortBy: string) => {
    const response = await api.get(`/reports/referrals?sortBy=${sortBy}`);
    return response.data;
  },
  getDealsReport: async (sortBy: string) => {
    const response = await api.get(`/reports/deals?sortBy=${sortBy}`);
    return response.data;
  }
};

// Dashboard services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

export default api;
