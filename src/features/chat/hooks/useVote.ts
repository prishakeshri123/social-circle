import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useVote(channelId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { messageId: string; optionIds: string[] }) =>
      chatService.vote(input.messageId, input.optionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(channelId ?? '') });
    },
  });
}
