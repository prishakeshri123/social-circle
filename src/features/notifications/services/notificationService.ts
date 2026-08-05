import { apiClient } from '@/services/apiClient';
import type { Notification } from '@/types/user.types';

export interface NotificationFilters {
  limit?: number;
}

export const notificationService = {
  list: (filters: NotificationFilters = {}) =>
    apiClient
      .get<{ data: Notification[] }>('/me/notifications', { params: filters })
      .then((r) => r.data.data),
};
