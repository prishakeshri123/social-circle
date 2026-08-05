import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
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
    apiClient
      .get<{ data: ConversationSummary[] }>(API_ENDPOINTS.chat.myConversations)
      .then((r) => r.data.data),

  listChannels: (clubId: string) =>
    apiClient
      .get<{ data: ChatChannel[] }>(API_ENDPOINTS.clubs.channels(clubId))
      .then((r) => r.data.data),

  createChannel: (clubId: string, name: string) =>
    apiClient
      .post<{ data: ChatChannel }>(API_ENDPOINTS.clubs.channels(clubId), { name })
      .then((r) => r.data.data),

  listMessages: (channelId: string, before?: string) =>
    apiClient
      .get<MessagesPage>(API_ENDPOINTS.chat.messages(channelId), {
        params: { before, limit: PAGE_SIZE_CHAT },
      })
      .then((r) => r.data),

  sendMessage: (channelId: string, input: SendMessageInput) =>
    apiClient
      .post<{ data: ChatMessage }>(API_ENDPOINTS.chat.messages(channelId), input)
      .then((r) => r.data.data),

  editMessage: (messageId: string, text: string) =>
    apiClient
      .patch<{ data: ChatMessage }>(API_ENDPOINTS.chat.message(messageId), { text })
      .then((r) => r.data.data),

  deleteMessage: (messageId: string, scope: 'for_me' | 'for_everyone') =>
    apiClient.delete(API_ENDPOINTS.chat.message(messageId), { data: { scope } }),

  react: (messageId: string, emoji: string) =>
    apiClient
      .post<{ data: { reactions: Record<string, string[]> } }>(
        API_ENDPOINTS.chat.reactions(messageId),
        { emoji },
      )
      .then((r) => r.data.data),

  vote: (messageId: string, optionIds: string[]) =>
    apiClient
      .post<{ data: ChatMessage }>(API_ENDPOINTS.chat.vote(messageId), { optionIds })
      .then((r) => r.data.data),

  pin: (channelId: string, messageId: string | null) =>
    apiClient
      .post<{ data: ChatChannel }>(API_ENDPOINTS.chat.pin(channelId), { messageId })
      .then((r) => r.data.data),

  resolveDmChannel: (userId: string) =>
    apiClient
      .post<{ data: ChatChannel }>(API_ENDPOINTS.users.dmChannel(userId), {})
      .then((r) => r.data.data),
};
