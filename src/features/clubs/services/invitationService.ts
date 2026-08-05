import { apiClient } from '@/services/apiClient';
import type { ClubInvitationWithClub } from '@/types/club.types';

export const invitationService = {
  myInvitations: () =>
    apiClient.get<{ data: ClubInvitationWithClub[] }>('/me/invitations').then((r) => r.data.data),
};
