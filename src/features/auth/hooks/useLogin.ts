import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/store/authSlice';
import type { ApiErrorResponse, AuthSuccessResponse, LoginRequest } from '@/types/auth.types';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthSuccessResponse, AxiosError<ApiErrorResponse>, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: (data, variables) =>
      setAuth(data.user, data.accessToken, data.refreshToken, variables.rememberMe ?? false),
  });
}
