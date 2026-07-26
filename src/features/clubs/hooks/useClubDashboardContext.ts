import { useOutletContext } from 'react-router-dom';
import type { Club, ClubMembership } from '@/types/club.types';

export interface ClubDashboardContext {
  club: Club;
  membership: ClubMembership;
  role: 'owner' | 'member';
}

export function useClubDashboardContext() {
  return useOutletContext<ClubDashboardContext>();
}
