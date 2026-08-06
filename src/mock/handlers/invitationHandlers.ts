import type MockAdapter from 'axios-mock-adapter';
import type { Club, ClubInvitation, ClubInvitationWithClub } from '@/types/club.types';
import { en } from '@/shared/constants/locales/en';
import { userIdFromToken, mockUsers } from '@/mock/handlers/authHandlers';
import { grantMembership } from '@/mock/handlers/clubHandlers';
import seedInvitations from '@/mock/data/invitations.json';
import seedClubs from '@/mock/data/clubs.json';

const e = en.errors;

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

function handleAccept(id: string, userId: string | null): [number, unknown] {
  if (!userId) return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  const invitation = invitations.find((i) => i.id === id && i.invitedUserId === userId);
  if (!invitation) return [404, { code: 'NOT_FOUND', message: e.notFound }];

  if (invitation.status === 'pending') {
    invitation.status = 'accepted';
  }
  const membership = grantMembership(invitation.clubId, userId);
  return [200, { data: membership }];
}

function handleDecline(id: string, userId: string | null): [number, unknown] {
  if (!userId) return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  const invitation = invitations.find((i) => i.id === id && i.invitedUserId === userId);
  if (!invitation) return [404, { code: 'NOT_FOUND', message: e.notFound }];

  invitation.status = 'declined';
  return [204, undefined];
}

export function registerInvitationHandlers(mock: MockAdapter): void {
  mock.onGet('/me/invitations').reply((config) => handleList(extractUserId(config.headers)));

  mock.onPost(/^\/me\/invitations\/[^/]+\/accept$/).reply((config) => {
    const id = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleAccept(id, extractUserId(config.headers));
  });

  mock.onPost(/^\/me\/invitations\/[^/]+\/decline$/).reply((config) => {
    const id = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleDecline(id, extractUserId(config.headers));
  });
}
