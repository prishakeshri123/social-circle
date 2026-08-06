import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  settingsService,
  type AddPaymentMethodRequest,
} from '@/features/settings/services/settingsService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: AddPaymentMethodRequest) => settingsService.addPaymentMethod(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.methods(user?.id ?? '') });
    },
  });
}
