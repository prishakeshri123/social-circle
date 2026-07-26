import { useQuery } from '@tanstack/react-query';
import { clubService } from '@/features/clubs/services/clubService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useMyMembership(clubId: string) {
  return useQuery({
    queryKey: queryKeys.clubs.myMembership(clubId),
    queryFn: () => clubService.getMyMembership(clubId),
    enabled: Boolean(clubId),
    retry: false,
  });
}
