import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (id: string) => settingsService.deletePaymentMethod(id),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.payments.methods(user?.id ?? ''), data);
    },
  });
}
