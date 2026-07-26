import { useQuery } from '@tanstack/react-query';
import { clubService } from '@/features/clubs/services/clubService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useMyClubs() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.clubs.myClubs,
    queryFn: () => clubService.myClubs(),
    enabled: isAuthenticated,
  });
}
