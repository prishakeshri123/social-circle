export interface ChatChannel {
  id: string;
  clubId: string;
  name: string;
  type: 'group' | 'announcement' | 'direct';
  pinnedMessageId?: string;
  participantIds?: string[];
  createdAt: string;
}

export type MessageType = 'text' | 'image' | 'video' | 'document' | 'voice' | 'poll' | 'system';

export interface ChatPoll {
  question: string;
  options: { id: string; text: string; voteCount: number }[];
  allowMultiple: boolean;
  closed: boolean;
  userVotedOptionIds?: string[];
}

export interface ChatReplyTo {
  id: string;
  senderId: string;
  senderName: string;
  previewText: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  type: MessageType;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaSize?: number;
  mediaThumbnailUrl?: string;
  poll?: ChatPoll;
  replyTo?: ChatReplyTo;
  reactions: Record<string, string[]>;
  edited: boolean;
  editedAt?: string;
  deleted: boolean;
  deliveredTo: string[];
  readBy: string[];
  sentAt: string;
}

export interface ConversationPreviewMessage {
  preview: string;
  senderId: string;
  isMine: boolean;
  sentAt: string;
}

export interface ConversationOtherUser {
  id: string;
  fullName: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export interface ConversationSummary {
  channelId: string;
  kind: 'group' | 'direct';
  clubId?: string;
  clubSlug?: string;
  clubName?: string;
  clubLogoUrl?: string;
  channelName?: string;
  otherUser?: ConversationOtherUser;
  lastMessage: ConversationPreviewMessage | null;
  unreadCount: number;
}
