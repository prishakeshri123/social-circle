import type { ClubFilters } from '@/types/club.types';
import type { EventFilters } from '@/features/events/services/eventService';

export const queryKeys = {
  clubs: {
    all: ['clubs'] as const,
    list: (filters: ClubFilters) => ['clubs', 'list', filters] as const,
    detail: (slug: string) => ['clubs', slug] as const,
    members: (slug: string, filters?: Record<string, unknown>) =>
      ['clubs', slug, 'members', filters ?? {}] as const,
    myMembership: (slug: string) => ['clubs', slug, 'my-membership'] as const,
    myClubs: ['clubs', 'my-clubs'] as const,
  },
  events: {
    list: (filters: EventFilters) => ['events', 'list', filters] as const,
    byClub: (clubId: string, filters?: Record<string, unknown>) =>
      ['events', clubId, filters ?? {}] as const,
    detail: (eventId: string) => ['events', 'detail', eventId] as const,
    attendees: (eventId: string) => ['events', 'detail', eventId, 'attendees'] as const,
  },
  albums: {
    byClub: (clubId: string) => ['albums', clubId] as const,
    detail: (albumId: string) => ['albums', 'detail', albumId] as const,
    media: (albumId: string) => ['albums', 'detail', albumId, 'media'] as const,
    comments: (mediaId: string) => ['albums', 'media', mediaId, 'comments'] as const,
  },
  chat: {
    channels: (clubId: string) => ['chat', 'channels', clubId] as const,
    messages: (channelId: string) => ['chat', 'messages', channelId] as const,
    dmChannel: (userId: string) => ['chat', 'dm-channel', userId] as const,
    myConversations: ['chat', 'my-conversations'] as const,
  },
  notifications: {
    list: (userId: string) => ['notifications', userId] as const,
    count: (userId: string) => ['notifications', userId, 'count'] as const,
  },
  users: {
    me: ['users', 'me'] as const,
    detail: (userId: string) => ['users', userId] as const,
  },
  payments: {
    subscriptions: (userId: string) => ['payments', 'subscriptions', userId] as const,
    transactions: (userId: string) => ['payments', 'transactions', userId] as const,
  },
} as const;
