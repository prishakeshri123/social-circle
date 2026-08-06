import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savedClubService } from '@/features/clubs/services/savedClubService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { en } from '@/shared/constants/locales/en';
import { toast } from '@/shared/components/ui/Toast';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAuth } from '@/shared/hooks/useAuth';

export function useUnsaveClub() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (clubId: string) => savedClubService.unsave(clubId),
    onSuccess: () => {
      toast.success(en.savedClubs.unsaveSuccess);
      queryClient.invalidateQueries({ queryKey: queryKeys.savedClubs.list(user?.id ?? '') });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
