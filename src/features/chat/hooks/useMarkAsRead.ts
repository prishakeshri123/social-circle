import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useMarkAsRead(channelId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatService.markRead(channelId ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.myConversations });
    },
  });
}
