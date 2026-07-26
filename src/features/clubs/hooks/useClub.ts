import { useQuery } from '@tanstack/react-query';
import { clubService } from '@/features/clubs/services/clubService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useClub(slug: string, options?: { refetchIntervalMs?: number }) {
  return useQuery({
    queryKey: queryKeys.clubs.detail(slug),
    queryFn: () => clubService.getBySlug(slug),
    enabled: Boolean(slug),
    refetchInterval: options?.refetchIntervalMs,
  });
}
