import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/features/chat/services/chatService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useChannels(clubId: string) {
  return useQuery({
    queryKey: queryKeys.chat.channels(clubId),
    queryFn: () => chatService.listChannels(clubId),
    enabled: Boolean(clubId),
  });
}
