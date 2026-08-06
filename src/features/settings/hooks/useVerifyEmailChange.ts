import { useMutation } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { useAuthStore } from '@/store/authSlice';

export function useVerifyEmailChange() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (otp: string) => settingsService.verifyEmailChange(otp),
    onSuccess: (data) => updateUser(data),
  });
}
