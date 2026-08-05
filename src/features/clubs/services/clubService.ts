import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import type { PaginatedResponse } from '@/types/api.types';
import type { Club, ClubFilters, ClubMembership, MyClub } from '@/types/club.types';

// Club creation and settings editing happen entirely in the separate Admin
// Dashboard -- this app only reads clubs and joins them.
export const clubService = {
  myClubs: () =>
    apiClient.get<{ data: MyClub[] }>(API_ENDPOINTS.clubs.myClubs).then((r) => r.data.data),

  list: (filters: ClubFilters) =>
    apiClient
      .get<PaginatedResponse<Club>>(API_ENDPOINTS.clubs.list, { params: filters })
      .then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get<Club>(API_ENDPOINTS.clubs.bySlug(slug)).then((r) => r.data),

  join: (clubId: string) =>
    apiClient.post<ClubMembership>(API_ENDPOINTS.clubs.join(clubId), {}).then((r) => r.data),

  getMyMembership: (clubId: string) =>
    apiClient.get<ClubMembership>(API_ENDPOINTS.clubs.myMembership(clubId)).then((r) => r.data),
};
