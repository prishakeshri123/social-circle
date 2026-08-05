import { apiClient } from '@/services/apiClient';
import type { PaginatedResponse } from '@/types/api.types';
import type { Album } from '@/types/club.types';

export const albumService = {
  listByClub: (clubId: string, limit?: number) =>
    apiClient
      .get<PaginatedResponse<Album>>(`/clubs/${clubId}/albums`, { params: { limit } })
      .then((r) => r.data.data),
};
