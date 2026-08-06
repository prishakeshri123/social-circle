import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { MESSAGE_POLL_MS } from '@/shared/constants/app.constants';

export function useMessages(channelId: string | null) {
  return useQuery({
    queryKey: queryKeys.chat.messages(channelId ?? ''),
    queryFn: () => chatService.listMessages(channelId ?? ''),
    enabled: Boolean(channelId),
    // Cross-tab BroadcastChannel sync (useChatRealtimeSync) covers the
    // common case near-instantly; this polling is the fallback for when a
    // tab misses a broadcast (e.g. was backgrounded) or doesn't support it.
    refetchInterval: Boolean(channelId) && MESSAGE_POLL_MS,
  });
}
