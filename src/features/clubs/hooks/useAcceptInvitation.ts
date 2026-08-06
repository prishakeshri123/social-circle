import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationService } from '@/features/clubs/services/invitationService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { en } from '@/shared/constants/locales/en';
import { toast } from '@/shared/components/ui/Toast';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAuth } from '@/shared/hooks/useAuth';

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (invitationId: string) => invitationService.accept(invitationId),
    onSuccess: () => {
      toast.success(en.invitations.acceptSuccess);
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.list(user?.id ?? '') });
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.myClubs });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
