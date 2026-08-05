import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import type { User } from '@/types/user.types';

export const userService = {
  getById: (userId: string) =>
    apiClient.get<User>(API_ENDPOINTS.users.byId(userId)).then((r) => r.data),
};
