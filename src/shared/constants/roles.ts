import type { ClubMembership } from '@/types/club.types';

// Not an RBAC system -- this app has one audience (members). The only
// thing this decides is whether to show the Edit/Cancel Event actions
// to the member who owns that event's club.
export function isClubOwner(membership: Pick<ClubMembership, 'role'> | null | undefined): boolean {
  return membership?.role === 'owner';
}
