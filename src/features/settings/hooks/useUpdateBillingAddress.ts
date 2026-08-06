import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';
import type { BillingAddress } from '@/types/payment.types';

export function useUpdateBillingAddress() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (address: BillingAddress) => settingsService.updateBillingAddress(address),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.payments.billingAddress(user?.id ?? ''), data);
    },
  });
}
