import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/features/notifications/services/notificationService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useNotifications(limit?: number) {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.notifications.list(user?.id ?? ''),
    queryFn: () => notificationService.list({ limit }),
    enabled: isAuthenticated && Boolean(user),
  });
}
