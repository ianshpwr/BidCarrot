'use client';
import axios from 'axios';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  console.error("CRITICAL: NEXT_PUBLIC_API_URL is not defined. API calls will fail.");
  // Fallback to localhost for dev, or empty string (which causes relative path = 405 on/auth/login)
  // We can't fix this for them, but we can warn.
}

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Response:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response) {
      // Server responded with non-2xx code
      const message = error.response.data?.message || error.response.data?.error || error.response.statusText || 'An error occurred';
      return Promise.reject(new ApiError(message, error.response.status, error.response.data));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new ApiError('No response from server. Please check your connection.', 0, null));
    } else {
      // Request setup error
      return Promise.reject(new ApiError(error.message, 0, null));
    }
  }
);

// Helper for consistent try-catch wrapping if needed, though interceptor handles most.
// We will return the response.data directly for convenience in some cases,
// but the existing app might expect the full response object (response.data).
// Based on existing code: `const res = await auctions.getOne(id); const data = res.data;`
// So we should keep returning the axios response object or struct mimicking it.

export const auth = {
  signup: async (userData) => {
    return api.post('/auth/signup', userData);
  },
  login: async (userData) => {
    return api.post('/auth/login', userData);
  },
};

export const auctions = {
  getAll: async () => {
    return api.get('/auctions/active');
  },
  getOne: async (id) => {
    return api.get(`/auctions/${id}`);
  },
  create: async (auctionData) => {
    return api.post('/auctions/create', auctionData);
  },
};

export const bids = {
  create: async (bidData) => {
    return api.post(`/bids/${bidData.auctionId}`, { amount: bidData.amount });
  },
};

export default api;
