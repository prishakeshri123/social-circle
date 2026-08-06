import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/features/settings/services/settingsService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function usePrivacySettings() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.users.privacy(user?.id ?? ''),
    queryFn: () => settingsService.getPrivacy(),
    enabled: isAuthenticated && Boolean(user),
  });
}
