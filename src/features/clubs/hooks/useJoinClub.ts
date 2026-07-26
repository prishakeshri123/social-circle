import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubService } from '@/features/clubs/services/clubService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { en } from '@/shared/constants/locales/en';
import { toast } from '@/shared/components/ui/Toast';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export function useJoinClub(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubId: string) => clubService.join(clubId),
    onSuccess: (membership) => {
      toast.success(
        membership.status === 'active'
          ? en.discovery.joinSuccess
          : en.discovery.joinPendingApproval,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.detail(slug) });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
