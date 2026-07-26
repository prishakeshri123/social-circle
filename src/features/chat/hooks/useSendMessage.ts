import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, type SendMessageInput } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { en } from '@/shared/constants/locales/en';
import { toast } from '@/shared/components/ui/Toast';

export function useSendMessage(channelId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SendMessageInput) => chatService.sendMessage(channelId ?? '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(channelId ?? '') });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.myConversations });
    },
    onError: () => toast.error(en.hub.sendMessageFailed),
  });
}
