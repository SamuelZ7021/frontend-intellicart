import axios from 'axios';
import { context, propagation } from '@opentelemetry/api';

const api = axios.create({
    baseURL: import.meta.env.VITE_USER_SERVICE_URL,
});

api.interceptors.request.use((config) => {
    // Inyectar headers de tracing actuales de forma segura
    const headers: Record<string, string> = {};
    try {
        propagation.inject(context.active(), headers);
    } catch (e) {
        console.warn("Tracing injection failed", e);
    }
    
    const token = localStorage.getItem('token');
    
    config.headers = config.headers || {};
    Object.assign(config.headers, headers);
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Manejar sesión expirada si es necesario
            // localStorage.removeItem('token');
        }
        console.error('API Error:', error.message);
        return Promise.reject(error);
    }
);

export default api;