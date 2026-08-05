import { useQuery } from '@tanstack/react-query';
import { clubService } from '@/features/clubs/services/clubService';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { queryKeys } from '@/shared/constants/queryKeys';
import type { Club } from '@/types/club.types';

export function useRecommendedClubs(limit: number) {
  const myClubsQuery = useMyClubs();
  const filters = { sort: 'recommended', limit: limit + (myClubsQuery.data?.length ?? 0) };

  const clubsQuery = useQuery({
    queryKey: queryKeys.clubs.list(filters),
    queryFn: () => clubService.list(filters),
    enabled: myClubsQuery.isSuccess,
  });

  const myClubIds = new Set((myClubsQuery.data ?? []).map((c) => c.id));
  const recommended: Club[] = (clubsQuery.data?.data ?? [])
    .filter((club) => !myClubIds.has(club.id))
    .slice(0, limit);

  return { data: recommended, isPending: myClubsQuery.isPending || clubsQuery.isPending };
}
