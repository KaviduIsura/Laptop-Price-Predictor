import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePreferences: (data) => api.put('/auth/preferences', data),
};

// Laptop endpoints
export const laptopAPI = {
  // You'll need to create these endpoints in backend
  getAll: (params) => api.get('/laptops', { params }),
  getById: (id) => api.get(`/laptops/${id}`),
  search: (query) => api.get(`/laptops/search?q=${query}`),
  filter: (filters) => api.post('/laptops/filter', filters),
  
  // Using prediction endpoint as temporary
  getPredictions: () => api.get('/predict/history'),
};

// Recommendation endpoints
export const recommendationAPI = {
  getPersonalized: () => api.get('/recommend/personalized'),
  getSimilar: (laptopId) => api.get(`/recommend/similar/${laptopId}`),
  getContentBased: (laptopId) => api.get(`/recommend/content-based/${laptopId}`),
  trackInteraction: (data) => api.post('/recommend/track', data),
    trackInteraction: (data) => 
    axios.post('/api/recommend/track-view', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }),

     trackInteraction: (data) => 
    axios.post('/api/recommend/track', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }),
};

// Prediction endpoints
export const predictionAPI = {
  predictPrice: (data) => api.post('/predict', data),
  getHistory: () => api.get('/predict/history'),
  submitFeedback: (data) => api.post('/predict/feedback', data),
};

// User endpoints
export const userAPI = {
  getDashboard: () => api.get('/users/dashboard'),
  getActivity: () => api.get('/users/activity'),
  updateSettings: (data) => api.put('/users/settings', data),
};

export default api;