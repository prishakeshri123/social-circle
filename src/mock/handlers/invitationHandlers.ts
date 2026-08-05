import type MockAdapter from 'axios-mock-adapter';
import type { Club, ClubInvitation, ClubInvitationWithClub } from '@/types/club.types';
import { userIdFromToken, mockUsers } from '@/mock/handlers/authHandlers';
import seedInvitations from '@/mock/data/invitations.json';
import seedClubs from '@/mock/data/clubs.json';

const invitations: ClubInvitation[] = [...(seedInvitations as ClubInvitation[])];
const clubs: Club[] = seedClubs as Club[];

function extractUserId(headers: unknown): string | null {
  const authHeader =
    headers && typeof headers === 'object' && 'Authorization' in headers
      ? (headers as Record<string, string>).Authorization
      : undefined;
  const token = authHeader?.replace(/^Bearer\s+/, '');
  return userIdFromToken(token);
}

function withClubAndInviter(invitation: ClubInvitation): ClubInvitationWithClub | null {
  const club = clubs.find((c) => c.id === invitation.clubId);
  const inviter = mockUsers.find((u) => u.id === invitation.invitedByUserId);
  if (!club || !inviter) return null;
  return {
    ...invitation,
    club: { id: club.id, slug: club.slug, name: club.name, logoUrl: club.logoUrl },
    invitedBy: { id: inviter.id, fullName: inviter.fullName, avatarUrl: inviter.avatarUrl },
  };
}

function handleList(userId: string | null): [number, unknown] {
  if (!userId) return [200, { data: [] }];
  const data = invitations
    .filter((i) => i.invitedUserId === userId && i.status === 'pending')
    .map(withClubAndInviter)
    .filter((i): i is ClubInvitationWithClub => i !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return [200, { data }];
}

export function registerInvitationHandlers(mock: MockAdapter): void {
  mock.onGet('/me/invitations').reply((config) => handleList(extractUserId(config.headers)));
}
