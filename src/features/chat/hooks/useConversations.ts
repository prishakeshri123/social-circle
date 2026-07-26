import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuth } from '@/shared/hooks/useAuth';

export function useConversations() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.chat.myConversations,
    queryFn: () => chatService.myConversations(),
    enabled: isAuthenticated,
  });
}
