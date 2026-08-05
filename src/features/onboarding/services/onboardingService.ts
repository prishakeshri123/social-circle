import { apiClient } from '@/services/apiClient';
import type { User } from '@/types/user.types';

export const onboardingService = {
  updateProfile: (patch: Partial<User>) =>
    apiClient.patch<User>('/users/me', patch).then((r) => r.data),
};
