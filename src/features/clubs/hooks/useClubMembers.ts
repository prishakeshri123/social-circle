import { useQuery } from '@tanstack/react-query';
import { clubService } from '@/features/clubs/services/clubService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useClubMembers(clubId: string | undefined, limit?: number) {
  return useQuery({
    queryKey: queryKeys.clubs.members(clubId ?? '', limit ? { limit } : undefined),
    queryFn: () => clubService.listMembers(clubId ?? '', limit),
    enabled: Boolean(clubId),
  });
}
