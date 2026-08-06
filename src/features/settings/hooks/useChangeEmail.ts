import { useMutation } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';

export function useChangeEmail() {
  return useMutation({
    mutationFn: (email: string) => settingsService.changeEmail(email),
  });
}
