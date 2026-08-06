import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared/constants/app.constants';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import { ROUTES } from '@/shared/constants/routes';
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  isTokenRemembered,
} from '@/shared/utils/authTokenStorage';
import type { AuthTokens } from '@/types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getStoredToken(REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error('No refresh token available');

  const remember = isTokenRemembered(REFRESH_TOKEN_KEY);
  const { data } = await axios.post<AuthTokens>(`${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`, {
    refreshToken,
  });
  setStoredToken(ACCESS_TOKEN_KEY, data.accessToken, remember);
  setStoredToken(REFRESH_TOKEN_KEY, data.refreshToken, remember);
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
        clearStoredToken(ACCESS_TOKEN_KEY);
        clearStoredToken(REFRESH_TOKEN_KEY);
        window.location.href = ROUTES.login;
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
