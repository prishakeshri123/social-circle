import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/features/payments/services/paymentService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { en } from '@/shared/constants/locales/en';
import { toast } from '@/shared/components/ui/Toast';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { formatDate } from '@/shared/utils/formatDate';
import { useAuth } from '@/shared/hooks/useAuth';

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (subscriptionId: string) => paymentService.cancelSubscription(subscriptionId),
    onSuccess: ({ accessUntil }) => {
      toast.success(`${en.success.subscriptionCancelled} ${formatDate(accessUntil)}.`);
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.subscriptions(user?.id ?? ''),
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
