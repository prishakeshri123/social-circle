import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';
import { NOTIFICATION_POLL_MS } from '@/shared/constants/app.constants';

export function useConversations() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.chat.myConversations,
    queryFn: () => chatService.myConversations(),
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated && NOTIFICATION_POLL_MS,
  });
}
