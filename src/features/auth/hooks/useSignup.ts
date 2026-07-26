import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { authService } from '@/features/auth/services/authService';
import type { ApiErrorResponse, SignupRequest, SignupResponse } from '@/types/auth.types';

export function useSignup() {
  return useMutation<SignupResponse, AxiosError<ApiErrorResponse>, SignupRequest>({
    mutationFn: authService.signup,
  });
}
