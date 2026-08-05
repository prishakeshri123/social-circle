import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useToggleReaction(channelId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { messageId: string; emoji: string }) =>
      chatService.react(input.messageId, input.emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(channelId ?? '') });
    },
  });
}
