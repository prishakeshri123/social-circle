import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/features/notifications/services/notificationService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markRead([notificationId]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list(user?.id ?? '') });
    },
  });
}
