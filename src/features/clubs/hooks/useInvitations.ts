import { useQuery } from '@tanstack/react-query';
import { invitationService } from '@/features/clubs/services/invitationService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useInvitations() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.invitations.list(user?.id ?? ''),
    queryFn: () => invitationService.myInvitations(),
    enabled: isAuthenticated && Boolean(user),
  });
}
