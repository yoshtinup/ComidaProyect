import axios from 'axios';

// Cambia esta URL base por la de tu API
const API_BASE_URL = 'https://tu-api.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar el token Bearer automáticamente
api.interceptors.request.use(
  (config) => {
    // Puedes cambiar 'token' por el nombre de tu storage si es diferente
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
