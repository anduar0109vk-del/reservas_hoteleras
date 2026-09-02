import axios from 'axios';

const normalizeApiData = (data) => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.result)) return data.result;

  return data;
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  transformResponse: [(data) => {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {
        return data;
      }
    }
    return normalizeApiData(data);
  }]
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
