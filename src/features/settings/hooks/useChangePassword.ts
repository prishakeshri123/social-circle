import { useMutation } from '@tanstack/react-query';
import {
  settingsService,
  type ChangePasswordRequest,
} from '@/features/settings/services/settingsService';

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => settingsService.changePassword(payload),
  });
}
