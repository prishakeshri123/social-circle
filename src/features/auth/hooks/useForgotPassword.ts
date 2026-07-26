import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { authService } from '@/features/auth/services/authService';
import type {
  ApiErrorResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth.types';

export function useRequestPasswordReset() {
  return useMutation<
    { message: string; maskedTarget: string },
    AxiosError<ApiErrorResponse>,
    ForgotPasswordRequest
  >({
    mutationFn: authService.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation<{ message: string }, AxiosError<ApiErrorResponse>, ResetPasswordRequest>({
    mutationFn: authService.resetPassword,
  });
}
