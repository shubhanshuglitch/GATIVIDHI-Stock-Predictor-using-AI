import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  updateWatchlist: (data) => api.put('/api/auth/watchlist', data),
};

// ── Stock API ─────────────────────────────────────────────────────────────────
export const stockAPI = {
  getData: (ticker, period = '1y') => api.get(`/api/stocks/${ticker}?period=${period}`),
  getInfo: (ticker) => api.get(`/api/stocks/${ticker}/info`),
  search: (query) => api.get(`/api/stocks/search/${encodeURIComponent(query)}`),
};

// ── Prediction API ────────────────────────────────────────────────────────────
export const predictionAPI = {
  arima: (data) => api.post('/api/predictions/arima', data),
  lstm: (data) => api.post('/api/predictions/lstm', data),
  movingAvg: (data) => api.post('/api/predictions/moving-avg', data),
  regression: (data) => api.post('/api/predictions/regression', data),
  bestTrade: (data) => api.post('/api/predictions/best-trade', data),
  evaluate: (data) => api.post('/api/predictions/evaluate', data),
};

export default api;
