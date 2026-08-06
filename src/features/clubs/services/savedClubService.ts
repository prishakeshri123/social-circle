import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import type { SavedClub } from '@/types/club.types';

export const savedClubService = {
  list: () =>
    apiClient.get<{ data: SavedClub[] }>(API_ENDPOINTS.savedClubs.list).then((r) => r.data.data),

  save: (clubId: string) =>
    apiClient
      .post<{ data: SavedClub }>(API_ENDPOINTS.savedClubs.save(clubId))
      .then((r) => r.data.data),

  unsave: (clubId: string) =>
    apiClient.delete<void>(API_ENDPOINTS.savedClubs.unsave(clubId)).then(() => undefined),
};
