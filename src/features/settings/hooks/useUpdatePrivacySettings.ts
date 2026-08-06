import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';
import type { PrivacySettings } from '@/types/user.types';

export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (patch: Partial<PrivacySettings>) => settingsService.updatePrivacy(patch),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.users.privacy(user?.id ?? ''), data);
    },
  });
}
