import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useNotificationPreferences() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.users.notificationPreferences(user?.id ?? ''),
    queryFn: () => settingsService.getNotificationPreferences(),
    enabled: isAuthenticated && Boolean(user),
  });
}
