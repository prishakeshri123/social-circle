import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/store/authSlice';
import type { ApiErrorResponse, AuthSuccessResponse, VerifyOtpRequest } from '@/types/auth.types';

export function useVerifyOtp() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<
    AuthSuccessResponse | { verified: true },
    AxiosError<ApiErrorResponse>,
    VerifyOtpRequest
  >({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      if ('accessToken' in data) {
        setAuth(data.user, data.accessToken, data.refreshToken);
      }
    },
  });
}
