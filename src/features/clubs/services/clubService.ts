import { apiClient } from '@/services/apiClient';
import type { PaginatedResponse } from '@/types/api.types';
import type { Club, ClubFilters, ClubMembership, MyClub } from '@/types/club.types';

// Club creation and settings editing happen entirely in the separate Admin
// Dashboard -- this app only reads clubs and joins them.
export const clubService = {
  myClubs: () => apiClient.get<{ data: MyClub[] }>('/me/clubs').then((r) => r.data.data),

  list: (filters: ClubFilters) =>
    apiClient.get<PaginatedResponse<Club>>('/clubs', { params: filters }).then((r) => r.data),

  getBySlug: (slug: string) => apiClient.get<Club>(`/clubs/${slug}`).then((r) => r.data),

  join: (clubId: string) =>
    apiClient.post<ClubMembership>(`/clubs/${clubId}/join`, {}).then((r) => r.data),

  getMyMembership: (clubId: string) =>
    apiClient.get<ClubMembership>(`/clubs/${clubId}/members/me`).then((r) => r.data),
};
