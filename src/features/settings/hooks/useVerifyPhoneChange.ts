import { useMutation } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { useAuthStore } from '@/store/authSlice';

export function useVerifyPhoneChange() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (otp: string) => settingsService.verifyPhoneChange(otp),
    onSuccess: (data) => updateUser(data),
  });
}
