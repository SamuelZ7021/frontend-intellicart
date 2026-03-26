import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

// Base URLs - can be environment variables
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;

// User Service Client
export const userApi = axios.create({
  baseURL: `${USER_SERVICE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Order Service Client
export const orderApi = axios.create({
  baseURL: `${import.meta.env.VITE_ORDER_SERVICE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ML Service Client
// Recommendations are routed through the Java order-service
export const mlApi = axios.create({
  baseURL: `${import.meta.env.VITE_ORDER_SERVICE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add JWT token
const authInterceptor = (config: any) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

userApi.interceptors.request.use(authInterceptor);
orderApi.interceptors.request.use(authInterceptor);
mlApi.interceptors.request.use(authInterceptor);

// Response Interceptor to handle 401s (optional logout)
const errorInterceptor = (error: any) => {
  if (error.response?.status === 401) {
    // Optionally logout user here if token expired
    // useAuthStore.getState().logout();
  }
  return Promise.reject(error);
};

userApi.interceptors.response.use((response) => response, errorInterceptor);
orderApi.interceptors.response.use((response) => response, errorInterceptor);
mlApi.interceptors.response.use((response) => response, errorInterceptor);
