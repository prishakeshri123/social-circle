import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useBillingAddress() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.payments.billingAddress(user?.id ?? ''),
    queryFn: () => settingsService.getBillingAddress(),
    enabled: isAuthenticated && Boolean(user),
  });
}
