import { useMutation } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';

export function useChangePhone() {
  return useMutation({
    mutationFn: (phone: string) => settingsService.changePhone(phone),
  });
}
