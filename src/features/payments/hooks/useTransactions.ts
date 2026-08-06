import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@/features/payments/services/paymentService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { PAGE_SIZE_TABLE } from '@/shared/constants/app.constants';
import { useAuth } from '@/shared/hooks/useAuth';

export function useTransactions() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.payments.transactions(user?.id ?? ''),
    queryFn: () => paymentService.listTransactions({ limit: PAGE_SIZE_TABLE }),
    enabled: isAuthenticated && Boolean(user),
  });
}
