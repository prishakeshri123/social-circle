import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function usePaymentMethods() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.payments.methods(user?.id ?? ''),
    queryFn: () => settingsService.listPaymentMethods(),
    enabled: isAuthenticated && Boolean(user),
  });
}
