import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import type { Notification } from '@/types/user.types';

export interface NotificationFilters {
  limit?: number;
}

export const notificationService = {
  list: (filters: NotificationFilters = {}) =>
    apiClient
      .get<{ data: Notification[] }>(API_ENDPOINTS.notifications.list, { params: filters })
      .then((r) => r.data.data),

  markRead: (ids: string[]) => apiClient.post(API_ENDPOINTS.notifications.markRead, { ids }),

  markAllRead: () => apiClient.post(API_ENDPOINTS.notifications.markRead, { all: true }),
};
