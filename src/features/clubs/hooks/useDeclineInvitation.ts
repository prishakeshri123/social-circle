import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationService } from '@/features/clubs/services/invitationService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { en } from '@/shared/constants/locales/en';
import { toast } from '@/shared/components/ui/Toast';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAuth } from '@/shared/hooks/useAuth';

export function useDeclineInvitation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (invitationId: string) => invitationService.decline(invitationId),
    onSuccess: () => {
      toast.success(en.invitations.declineSuccess);
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.list(user?.id ?? '') });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
