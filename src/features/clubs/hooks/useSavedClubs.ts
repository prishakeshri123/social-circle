import { useQuery } from '@tanstack/react-query';
import { savedClubService } from '@/features/clubs/services/savedClubService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useSavedClubs() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: queryKeys.savedClubs.list(user?.id ?? ''),
    queryFn: () => savedClubService.list(),
    enabled: isAuthenticated,
  });
}
