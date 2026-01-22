import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ORS APIs
export const orsAPI = {
  getAllPlans: () => api.get('/ors'),
  getPlan: (id) => api.get(`/ors/${id}`),
  createPlan: (data) => api.post('/ors', data),
  updatePlan: (id, data) => api.put(`/ors/${id}`, data),
  deletePlan: (id) => api.delete(`/ors/${id}`),
};

export default api;
