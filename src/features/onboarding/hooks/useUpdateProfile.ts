import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { onboardingService } from '@/features/onboarding/services/onboardingService';
import { useAuthStore } from '@/store/authSlice';
import type { ApiErrorResponse } from '@/types/auth.types';
import type { User } from '@/types/user.types';

export function useUpdateProfile() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation<User, AxiosError<ApiErrorResponse>, Partial<User>>({
    mutationFn: onboardingService.updateProfile,
    onSuccess: (data) => updateUser(data),
  });
}
