import { apiClient } from '@/services/apiClient';
import type { User } from '@/types/user.types';

export const userService = {
  getById: (userId: string) => apiClient.get<User>(`/users/${userId}`).then((r) => r.data),
};
