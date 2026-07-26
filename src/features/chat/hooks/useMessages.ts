import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useMessages(channelId: string | null) {
  return useQuery({
    queryKey: queryKeys.chat.messages(channelId ?? ''),
    queryFn: () => chatService.listMessages(channelId ?? ''),
    enabled: Boolean(channelId),
  });
}
