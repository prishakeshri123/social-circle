import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { authService } from '@/features/auth/services/authService';
import type { ApiErrorResponse, OtpPurpose } from '@/types/auth.types';

interface ResendOtpInput {
  target: string;
  purpose: OtpPurpose;
}

export function useResendOtp() {
  return useMutation<{ message: string }, AxiosError<ApiErrorResponse>, ResendOtpInput>({
    mutationFn: ({ target, purpose }) => authService.resendOtp(target, purpose),
  });
}
