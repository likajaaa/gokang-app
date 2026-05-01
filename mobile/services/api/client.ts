import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.2:8000/api/v1';

console.log('[API] Base URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// ── Request logging + Bearer token attach ───────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('[API Request]', config.method?.toUpperCase(), config.url);
    console.log('[API Request URL]', (config.baseURL ?? '') + (config.url ?? ''));
    console.log('[API Request Body]', JSON.stringify(config.data));
    return config;
  },
  (error) => {
    console.log('[API Request Error]', error);
    return Promise.reject(error);
  },
);

// ── Response logging + 401 handler ──────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url);
    console.log(
      '[API Response Data]',
      JSON.stringify(response.data).substring(0, 200),
    );
    return response;
  },
  async (error) => {
    console.log('[API Error]', error.message);
    console.log(
      '[API Error URL]',
      (error.config?.baseURL ?? '') + (error.config?.url ?? ''),
    );
    console.log(
      '[API Error Response]',
      error.response?.status,
      error.response?.data,
    );

    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      // Dynamically access store to avoid circular imports
      const { useAuthStore } = await import('../../store/authStore');
      useAuthStore.setState({ user: null, token: null, isLoggedIn: false });
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
