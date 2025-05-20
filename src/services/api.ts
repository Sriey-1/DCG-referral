
import axios from 'axios';
import { mockReferrals, mockDeals, mockDashboardStats, delay } from './mockApi';

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
      // Simulating login response
      await delay(500);
      return {
        token: "mock-token",
        user: {
          id: "1",
          email: email,
          name: email.split('@')[0]
        }
      };
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  },
  register: async (name: string, email: string, password: string) => {
    await delay(500);
    return {
      token: "mock-token",
      user: {
        id: "1",
        email: email,
        name: name
      }
    };
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
    console.log('Getting all referrals (mock data)');
    await delay(500);
    return mockReferrals;
  },
  createReferral: async (referralData: any) => {
    await delay(500);
    const newReferral = {
      id: `${mockReferrals.length + 1}`,
      referring_company: referralData.referring_company,
      client_name: referralData.client_name,
      contact_person: referralData.contact_person,
      contact_email: referralData.contact_email,
      contact_phone: referralData.contact_phone,
      service: referralData.service,
      status: referralData.status,
      notes: referralData.notes,
      created_at: new Date().toISOString()
    };
    mockReferrals.push(newReferral);
    return newReferral;
  }
};

// Deal services
export const dealService = {
  getAllDeals: async () => {
    console.log('Getting all deals (mock data)');
    await delay(500);
    return mockDeals;
  },
  createDeal: async (dealData: any) => {
    await delay(500);
    const newDeal = {
      id: `${mockDeals.length + 1}`,
      title: dealData.title,
      referral_id: dealData.referral_id,
      value: dealData.value,
      client_name: dealData.client_name,
      stage: dealData.stage,
      expected_close_date: dealData.expected_close_date,
      description: dealData.description,
      created_at: new Date().toISOString()
    };
    mockDeals.push(newDeal);
    return newDeal;
  }
};

// Report services
export const reportService = {
  getReferralsReport: async (sortBy: string) => {
    await delay(500);
    // Simple sorting based on the provided field
    const sorted = [...mockReferrals].sort((a: any, b: any) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });
    return sorted;
  },
  getDealsReport: async (sortBy: string) => {
    await delay(500);
    // Simple sorting based on the provided field
    const sorted = [...mockDeals].sort((a: any, b: any) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });
    return sorted;
  }
};

// Dashboard services
export const dashboardService = {
  getStats: async () => {
    console.log('Getting dashboard stats (mock data)');
    await delay(500);
    return mockDashboardStats;
  }
};

export default api;
