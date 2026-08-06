import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { onChatChange } from '@/shared/utils/chatRealtimeChannel';

// Mounted once near the app root. Invalidates all chat queries whenever
// another tab (e.g. a second logged-in account) writes a chat change, so
// conversation previews, unread badges, and open threads update live.
export function useChatRealtimeSync(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    return onChatChange(() => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    });
  }, [queryClient]);
}
