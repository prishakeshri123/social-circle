import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';
import { en } from '@/shared/constants/locales/en';
import { toast } from '@/shared/components/ui/Toast';

export function useEditMessage(channelId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { messageId: string; text: string }) =>
      chatService.editMessage(input.messageId, input.text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(channelId ?? '') });
      toast.success(en.chat.messageEdited);
    },
    onError: () => toast.error(en.hub.sendMessageFailed),
  });
}
