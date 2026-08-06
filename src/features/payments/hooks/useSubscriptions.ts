import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@/features/payments/services/paymentService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useSubscriptions() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.payments.subscriptions(user?.id ?? ''),
    queryFn: () => paymentService.listSubscriptions(),
    enabled: isAuthenticated && Boolean(user),
  });
}
