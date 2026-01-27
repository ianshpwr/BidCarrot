import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (userData) => api.post('/auth/login', userData),
};


export const auctions = {
  getAll: () => api.get('/auctions/active'),
  getOne: (id) => api.get(`/auctions/${id}`),
  create: (auctionData) => api.post('/auctions/create', auctionData),
};

export const bids = {
  // Bids are fetched via auctions.getOne(id).bids
  create: (bidData) => api.post(`/bids/${bidData.auctionId}`, { amount: bidData.amount }),
};

export default api;
