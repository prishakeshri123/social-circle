import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';
import type { NotificationPreferences } from '@/types/user.types';

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (patch: Partial<NotificationPreferences>) =>
      settingsService.updateNotificationPreferences(patch),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.users.notificationPreferences(user?.id ?? ''), data);
    },
  });
}
