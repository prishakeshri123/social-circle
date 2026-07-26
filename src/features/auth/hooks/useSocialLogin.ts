import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/store/authSlice';
import type { ApiErrorResponse, SocialLoginResponse, SocialProvider } from '@/types/auth.types';

export function useSocialLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<SocialLoginResponse, AxiosError<ApiErrorResponse>, SocialProvider>({
    mutationFn: authService.socialLogin,
    onSuccess: (data) => setAuth(data.user, data.accessToken, data.refreshToken),
  });
}
