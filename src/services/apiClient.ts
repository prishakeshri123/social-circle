import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared/constants/app.constants';
import { ROUTES } from '@/shared/constants/routes';
import type { AuthTokens } from '@/types/auth.types';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error('No refresh token available');

  const { data } = await axios.post<AuthTokens>('/api/auth/refresh', { refreshToken });
  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  return data.accessToken;
}

function isAuthEndpoint(url: string | undefined): boolean {
  return Boolean(url && url.startsWith('/auth/'));
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (isAuthEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshPromise ??= refreshAccessToken();
        const newToken = await refreshPromise;
        refreshPromise = null;
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        return apiClient(originalRequest);
      } catch {
        refreshPromise = null;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        window.location.href = ROUTES.login;
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
