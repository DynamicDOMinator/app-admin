import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://app.prosental.online' || 'http://localhost:5001';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ar',
  },
});

// Request interceptor — attach access token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      console.log('Sending request to', config.url, 'with token:', token ? token.substring(0, 15) + '...' : 'NONE');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor — handle token refresh seamlessly
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const original = error.config;

    // If 401 and request wasn't already retried
    if (error.response?.status === 401 && !original._retry && !original.url?.includes('/auth/login')) {
      if (isRefreshing) {
        // Another request is already refreshing the token, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${baseURL}/api/v1/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        original.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(original);
      } catch (err) {
        processQueue(err, null);
        console.error('Admin token refresh failed:', err);
        if (typeof window !== 'undefined') {
          localStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

// ─── API Methods ──────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/api/v1/auth/login', data),
  logout: () => api.post('/api/v1/auth/logout'),
  me: () => api.get('/api/v1/auth/me'),
};

export const dashboardApi = {
  getStats: () => api.get('/api/v1/orders/stats'),
  getRevenue: (params) => api.get('/api/v1/reports/revenue', { params }),
  getOverview: () => api.get('/api/v1/reports/overview'),
};

export const ordersApi = {
  getAll: (params) => api.get('/api/v1/orders', { params }),
  getById: (id) => api.get(`/api/v1/orders/${id}`),
  updateStatus: (id, data) => api.patch(`/api/v1/orders/${id}/status`, data),
};

export const usersApi = {
  getAll: (params) => api.get('/api/v1/users', { params }),
  getById: (id) => api.get(`/api/v1/users/${id}`),
  block: (id) => api.patch(`/api/v1/users/${id}/block`),
  getStats: () => api.get('/api/v1/users/stats/overview'),
};

export const employeesApi = {
  getAll: (params) => api.get('/api/v1/employees', { params }),
  getById: (id) => api.get(`/api/v1/employees/${id}`),
  getPerformance: (id) => api.get(`/api/v1/employees/${id}/performance`),
  reviewLeave: (id, data) => api.patch(`/api/v1/employees/leave/${id}/review`, data),
};

export const servicesApi = {
  getCategories: () => api.get('/api/v1/services/categories'),
  getAll: (params) => api.get('/api/v1/services', { params }),
  getById: (id) => api.get(`/api/v1/services/${id}`),
  create: (data) => api.post('/api/v1/services', data),
  update: (id, data) => api.put(`/api/v1/services/${id}`, data),
  delete: (id) => api.delete(`/api/v1/services/${id}`),
};

export const couponsApi = {
  getAll: (params) => api.get('/api/v1/coupons', { params }),
  create: (data) => api.post('/api/v1/coupons', data),
  update: (id, data) => api.put(`/api/v1/coupons/${id}`, data),
  delete: (id) => api.delete(`/api/v1/coupons/${id}`),
};

export const settingsApi = {
  getAll: () => api.get('/api/v1/settings'),
  getGroup: (group) => api.get(`/api/v1/settings/group/${group}`),
  update: (key, value) => api.put(`/api/v1/settings/${key}`, { value }),
  bulkUpdate: (settings) => api.post('/api/v1/settings/bulk', { settings }),
};

export const bannersApi = {
  getAll: () => api.get('/api/v1/banners?all=true'),
  create: (data) => api.post('/api/v1/banners', data),
  update: (id, data) => api.put(`/api/v1/banners/${id}`, data),
  delete: (id) => api.delete(`/api/v1/banners/${id}`),
};

export const notificationsApi = {
  send: (data) => api.post('/api/v1/notifications/push', data),
};

export const packagesApi = {
  getAll: (params) => api.get('/api/v1/packages', { params }),
  getById: (id) => api.get(`/api/v1/packages/${id}`),
  create: (data) => api.post('/api/v1/packages', data),
  update: (id, data) => api.put(`/api/v1/packages/${id}`, data),
  delete: (id) => api.delete(`/api/v1/packages/${id}`),
};

export const reviewsApi = {
  getAll: (params) => api.get('/api/v1/reviews?all=true', { params }),
  update: (id, data) => api.put(`/api/v1/reviews/${id}`, data), // Assuming we'll add update/delete to backend later
  delete: (id) => api.delete(`/api/v1/reviews/${id}`),
};

export const chatsApi = {
  getChats: () => api.get('/api/v1/chat'),
  getMessages: (chatId, params) => api.get(`/api/v1/chat/${chatId}/messages`, { params }),
  sendMessage: (chatId, data) => api.post(`/api/v1/chat/${chatId}/messages`, data),
};

export default api;
