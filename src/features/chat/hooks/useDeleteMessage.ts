import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { en } from '@/shared/constants/locales/en';
import { toast } from '@/shared/components/ui/Toast';

export function useDeleteMessage(channelId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => chatService.deleteMessage(messageId, 'for_everyone'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(channelId ?? '') });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.myConversations });
      toast.success(en.chat.messageDeleted);
    },
    onError: () => toast.error(en.hub.sendMessageFailed),
  });
}
