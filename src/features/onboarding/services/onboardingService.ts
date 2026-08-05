import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import type { User } from '@/types/user.types';

export const onboardingService = {
  updateProfile: (patch: Partial<User>) =>
    apiClient.patch<User>(API_ENDPOINTS.users.me, patch).then((r) => r.data),
};
