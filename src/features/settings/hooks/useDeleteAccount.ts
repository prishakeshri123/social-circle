import { useMutation } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => settingsService.deleteAccount(),
  });
}
