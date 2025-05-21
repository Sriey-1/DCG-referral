
import axios from 'axios';

// Create axios instance with base URL
const API_URL = 'http://localhost:5000/api';

// Mock data for local development
const mockData = {
  referrals: [
    {
      id: "1",
      referring_company: "Alpha Consulting",
      client_name: "Dubai Properties",
      contact_person: "Ahmed Al Mansouri",
      contact_email: "ahmed@dubaiproperties.ae",
      contact_phone: "+971-50-1234567",
      service: "Real Estate Advisory",
      status: "Active",
      notes: "Interested in commercial property valuation",
      created_at: "2023-09-15T10:30:00Z",
      user_id: "1"
    },
    {
      id: "2",
      referring_company: "Beta Investments",
      client_name: "Emirates Group",
      contact_person: "Fatima Rahman",
      contact_email: "fatima@emiratesgroup.ae",
      contact_phone: "+971-55-7654321",
      service: "Financial Consultation",
      status: "Completed",
      notes: "Portfolio restructuring project",
      created_at: "2023-08-20T14:45:00Z",
      user_id: "1"
    },
    {
      id: "3",
      referring_company: "Gamma Partners",
      client_name: "Dubai Holding",
      contact_person: "Mohammed Al Qasimi",
      contact_email: "mohammed@dubaiholding.ae",
      contact_phone: "+971-54-3698521",
      service: "Legal Advisory",
      status: "Pending",
      notes: "Requires follow-up on contract details",
      created_at: "2023-09-01T09:15:00Z",
      user_id: "1"
    }
  ],
  deals: [
    {
      id: "1",
      title: "Dubai Properties Portfolio Valuation",
      referral_id: "1",
      value: "750000",
      client_name: "Dubai Properties",
      stage: "Proposal",
      expected_close_date: "2023-12-15",
      description: "Comprehensive valuation of commercial properties",
      created_at: "2023-09-18T11:30:00Z",
      user_id: "1"
    },
    {
      id: "2",
      title: "Emirates Group Investment Strategy",
      referral_id: "2",
      value: "1200000",
      client_name: "Emirates Group",
      stage: "Negotiation",
      expected_close_date: "2023-11-30",
      description: "Strategic investment planning for next fiscal year",
      created_at: "2023-08-25T16:45:00Z",
      user_id: "1"
    },
    {
      id: "3",
      title: "Dubai Holding Legal Framework",
      referral_id: "3",
      value: "580000",
      client_name: "Dubai Holding",
      stage: "Discovery",
      expected_close_date: "2024-01-20",
      description: "Legal framework evaluation for new subsidiaries",
      created_at: "2023-09-05T10:15:00Z",
      user_id: "1"
    }
  ],
  users: [
    {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      created_at: "2023-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "John Manager",
      email: "john@example.com",
      created_at: "2023-01-02T00:00:00Z"
    }
  ],
  stats: {
    referralCount: 3,
    dealCount: 3,
    totalDealValue: 2530000,
    conversionRate: 67
  }
};

// Helper function for mocked API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Configure axios with mock interceptors for local development
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Instead of real API calls, we'll use mock data
api.interceptors.request.use(
  async (config) => {
    console.log(`Mock API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  }
);

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    console.log(`Mock Login: ${email}`);
    await delay(500);
    
    const user = mockData.users.find(u => u.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    const response = {
      token: "mock-jwt-token",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
    
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("isAuthenticated", "true");
    
    return response;
  },
  
  register: async (name, email, password) => {
    console.log(`Mock Register: ${name}, ${email}`);
    await delay(700);
    
    const newUser = {
      id: mockData.users.length + 1,
      name,
      email,
      created_at: new Date().toISOString()
    };
    
    mockData.users.push(newUser);
    
    const response = {
      token: "mock-jwt-token",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    };
    
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("isAuthenticated", "true");
    
    return response;
  },
  
  logout: () => {
    console.log("Mock Logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  }
};

// Referral services
export const referralService = {
  getAllReferrals: async () => {
    console.log("Mock: Getting all referrals");
    await delay(600);
    return mockData.referrals;
  },
  
  createReferral: async (referralData) => {
    console.log("Mock: Creating new referral", referralData);
    await delay(800);
    
    const newReferral = {
      id: String(mockData.referrals.length + 1),
      referring_company: referralData.referringCompany,
      client_name: referralData.clientName,
      contact_person: referralData.contactPerson,
      contact_email: referralData.contactEmail,
      contact_phone: referralData.contactPhone,
      service: referralData.service,
      status: referralData.status,
      notes: referralData.notes,
      created_at: new Date().toISOString(),
      user_id: "1"
    };
    
    mockData.referrals.unshift(newReferral);
    return newReferral;
  }
};

// Deal services
export const dealService = {
  getAllDeals: async () => {
    console.log("Mock: Getting all deals");
    await delay(600);
    return mockData.deals;
  },
  
  createDeal: async (dealData) => {
    console.log("Mock: Creating new deal", dealData);
    await delay(800);
    
    const newDeal = {
      id: String(mockData.deals.length + 1),
      title: dealData.title,
      referral_id: dealData.referralId || null,
      value: dealData.value,
      client_name: dealData.clientName,
      stage: dealData.stage,
      expected_close_date: dealData.expectedCloseDate,
      description: dealData.description,
      created_at: new Date().toISOString(),
      user_id: "1"
    };
    
    mockData.deals.unshift(newDeal);
    
    // Update stats when a new deal is created
    mockData.stats.dealCount += 1;
    mockData.stats.totalDealValue += parseInt(dealData.value, 10);
    
    return newDeal;
  }
};

// Report services
export const reportService = {
  getReferralsReport: async (sortBy) => {
    console.log(`Mock: Getting referrals report sorted by ${sortBy}`);
    await delay(700);
    
    // Simple sorting implementation
    const sortedReferrals = [...mockData.referrals];
    if (sortBy === 'client_name') {
      sortedReferrals.sort((a, b) => a.client_name.localeCompare(b.client_name));
    } else if (sortBy === 'referring_company') {
      sortedReferrals.sort((a, b) => a.referring_company.localeCompare(b.referring_company));
    } else if (sortBy === 'status') {
      sortedReferrals.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortBy === 'created_at') {
      sortedReferrals.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    
    return sortedReferrals;
  },
  
  getDealsReport: async (sortBy) => {
    console.log(`Mock: Getting deals report sorted by ${sortBy}`);
    await delay(700);
    
    // Simple sorting implementation
    const sortedDeals = [...mockData.deals];
    if (sortBy === 'title') {
      sortedDeals.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'client_name') {
      sortedDeals.sort((a, b) => a.client_name.localeCompare(b.client_name));
    } else if (sortBy === 'value') {
      sortedDeals.sort((a, b) => parseInt(b.value) - parseInt(a.value));
    } else if (sortBy === 'stage') {
      sortedDeals.sort((a, b) => a.stage.localeCompare(b.stage));
    } else if (sortBy === 'expected_close_date') {
      sortedDeals.sort((a, b) => new Date(a.expected_close_date).getTime() - new Date(b.expected_close_date).getTime());
    } else if (sortBy === 'created_at') {
      sortedDeals.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    
    return sortedDeals;
  }
};

// Dashboard services
export const dashboardService = {
  getStats: async () => {
    console.log("Mock: Getting dashboard stats");
    await delay(500);
    return mockData.stats;
  }
};

export default api;
