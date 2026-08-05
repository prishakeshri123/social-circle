import { apiClient } from '@/services/apiClient';
import { PAGE_SIZE_CHAT } from '@/shared/constants/app.constants';
import type {
  ChatChannel,
  ChatMessage,
  ConversationSummary,
  MessageType,
} from '@/types/chat.types';

export interface MessagesPage {
  data: ChatMessage[];
  cursor: string | null;
  hasMore: boolean;
}

export interface SendMessageInput {
  type: MessageType;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaSize?: number;
  mediaThumbnailUrl?: string;
  poll?: ChatMessage['poll'];
  replyTo?: ChatMessage['replyTo'];
}

export const chatService = {
  myConversations: () =>
    apiClient.get<{ data: ConversationSummary[] }>('/me/conversations').then((r) => r.data.data),

  listChannels: (clubId: string) =>
    apiClient.get<{ data: ChatChannel[] }>(`/clubs/${clubId}/channels`).then((r) => r.data.data),

  createChannel: (clubId: string, name: string) =>
    apiClient
      .post<{ data: ChatChannel }>(`/clubs/${clubId}/channels`, { name })
      .then((r) => r.data.data),

  listMessages: (channelId: string, before?: string) =>
    apiClient
      .get<MessagesPage>(`/channels/${channelId}/messages`, {
        params: { before, limit: PAGE_SIZE_CHAT },
      })
      .then((r) => r.data),

  sendMessage: (channelId: string, input: SendMessageInput) =>
    apiClient
      .post<{ data: ChatMessage }>(`/channels/${channelId}/messages`, input)
      .then((r) => r.data.data),

  editMessage: (messageId: string, text: string) =>
    apiClient
      .patch<{ data: ChatMessage }>(`/messages/${messageId}`, { text })
      .then((r) => r.data.data),

  deleteMessage: (messageId: string, scope: 'for_me' | 'for_everyone') =>
    apiClient.delete(`/messages/${messageId}`, { data: { scope } }),

  react: (messageId: string, emoji: string) =>
    apiClient
      .post<{ data: { reactions: Record<string, string[]> } }>(`/messages/${messageId}/reactions`, {
        emoji,
      })
      .then((r) => r.data.data),

  vote: (messageId: string, optionIds: string[]) =>
    apiClient
      .post<{ data: ChatMessage }>(`/messages/${messageId}/vote`, { optionIds })
      .then((r) => r.data.data),

  pin: (channelId: string, messageId: string | null) =>
    apiClient
      .post<{ data: ChatChannel }>(`/channels/${channelId}/pin`, { messageId })
      .then((r) => r.data.data),

  resolveDmChannel: (userId: string) =>
    apiClient
      .post<{ data: ChatChannel }>(`/users/${userId}/dm-channel`, {})
      .then((r) => r.data.data),
};
