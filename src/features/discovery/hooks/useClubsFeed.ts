import { useInfiniteQuery } from '@tanstack/react-query';
import { clubService } from '@/features/clubs/services/clubService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { PAGE_SIZE_DEFAULT } from '@/shared/constants/app.constants';
import type { ClubFilters } from '@/types/club.types';

export function useClubsFeed(filters: ClubFilters, enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.clubs.list(filters),
    queryFn: ({ pageParam }) =>
      clubService.list({ ...filters, page: pageParam, limit: PAGE_SIZE_DEFAULT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled,
  });
}
