import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import type { ClubInvitationWithClub, ClubMembership } from '@/types/club.types';

export const invitationService = {
  myInvitations: () =>
    apiClient
      .get<{ data: ClubInvitationWithClub[] }>(API_ENDPOINTS.invitations.list)
      .then((r) => r.data.data),

  accept: (invitationId: string) =>
    apiClient
      .post<{ data: ClubMembership }>(API_ENDPOINTS.invitations.accept(invitationId))
      .then((r) => r.data.data),

  decline: (invitationId: string) =>
    apiClient.post<void>(API_ENDPOINTS.invitations.decline(invitationId)).then(() => undefined),
};
