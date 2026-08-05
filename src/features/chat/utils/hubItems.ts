import { CONVERSATION_PREVIEW_MAX_CHARS } from '@/shared/constants/app.constants';
import { en } from '@/shared/constants/locales/en';
import { formatConversationTimestamp } from '@/shared/utils/formatDate';
import { truncate } from '@/shared/utils/truncate';
import type { ConversationSummary } from '@/types/chat.types';
import type { MyClub } from '@/types/club.types';

export type HubFilter = 'all' | 'chats' | 'groups' | 'clubs';

export interface HubItem {
  key: string;
  kind: 'direct' | 'group' | 'club';
  title: string;
  subtitle: string;
  avatarUrl?: string;
  avatarFallback: string;
  timestamp?: string;
  unreadCount: number;
  isOnline?: boolean;
  sortAt: number;
  channelId?: string;
  clubId?: string;
  clubSlug?: string;
  category?: string;
  channelName?: string;
  otherUserId?: string;
  club?: MyClub;
}

export interface HubItemsByFilter {
  all: HubItem[];
  chats: HubItem[];
  groups: HubItem[];
  clubs: HubItem[];
}

function previewSubtitle(lastMessage: ConversationSummary['lastMessage']): string {
  if (!lastMessage) return en.hub.noPreviewYet;
  const prefix = lastMessage.isMine ? en.hub.youPrefix : '';
  return truncate(`${prefix}${lastMessage.preview}`, CONVERSATION_PREVIEW_MAX_CHARS);
}

export function buildHubItems(
  conversations: ConversationSummary[],
  myClubs: MyClub[],
): HubItemsByFilter {
  const groupConversations = conversations.filter((c) => c.kind === 'group');
  const directConversations = conversations.filter((c) => c.kind === 'direct');
  const clubById = new Map(myClubs.map((club) => [club.id, club]));

  const groupItems: HubItem[] = groupConversations.map((c) => ({
    key: `group:${c.channelId}`,
    kind: 'group',
    title: en.hub.clubChannelLabel(c.clubName ?? '', c.channelName ?? ''),
    subtitle: previewSubtitle(c.lastMessage),
    avatarUrl: c.clubLogoUrl,
    avatarFallback: (c.clubName ?? '?').charAt(0),
    timestamp: c.lastMessage ? formatConversationTimestamp(c.lastMessage.sentAt) : undefined,
    unreadCount: c.unreadCount,
    sortAt: c.lastMessage ? new Date(c.lastMessage.sentAt).getTime() : 0,
    channelId: c.channelId,
    clubId: c.clubId,
    clubSlug: c.clubSlug,
    category: c.clubId ? clubById.get(c.clubId)?.category : undefined,
    channelName: c.channelName,
  }));

  const directItems: HubItem[] = directConversations.map((c) => ({
    key: `direct:${c.channelId}`,
    kind: 'direct',
    title: c.otherUser?.fullName ?? '',
    subtitle: previewSubtitle(c.lastMessage),
    avatarUrl: c.otherUser?.avatarUrl,
    avatarFallback: (c.otherUser?.fullName ?? '?').charAt(0),
    timestamp: c.lastMessage ? formatConversationTimestamp(c.lastMessage.sentAt) : undefined,
    unreadCount: c.unreadCount,
    isOnline: c.otherUser?.isOnline,
    sortAt: c.lastMessage ? new Date(c.lastMessage.sentAt).getTime() : 0,
    channelId: c.channelId,
    otherUserId: c.otherUser?.id,
  }));

  const clubItems: HubItem[] = myClubs.map((club) => {
    const related = groupConversations.filter((c) => c.clubId === club.id);
    const latestRelated = related.reduce((max, c) => {
      const t = c.lastMessage ? new Date(c.lastMessage.sentAt).getTime() : 0;
      return Math.max(max, t);
    }, new Date(club.updatedAt).getTime());

    return {
      key: `club:${club.id}`,
      kind: 'club',
      title: club.name,
      subtitle: en.discovery.membersCount(club.memberCount),
      avatarUrl: club.logoUrl,
      avatarFallback: club.name.charAt(0),
      unreadCount: 0,
      sortAt: latestRelated,
      clubId: club.id,
      clubSlug: club.slug,
      category: club.category,
      club,
    };
  });

  const byRecency = (a: HubItem, b: HubItem) => b.sortAt - a.sortAt;

  return {
    all: [...clubItems, ...groupItems, ...directItems].sort(byRecency),
    chats: [...directItems].sort(byRecency),
    groups: [...groupItems].sort(byRecency),
    clubs: [...clubItems].sort(byRecency),
  };
}

export function humanizeChannelName(name: string): string {
  return name
    .split('-')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

export type HubSortMode = 'recent' | 'unread';

export function sortHubItems(items: HubItem[], mode: HubSortMode): HubItem[] {
  if (mode === 'recent') return items;
  return [...items].sort((a, b) => Number(b.unreadCount > 0) - Number(a.unreadCount > 0));
}

export function filterBySearch(items: HubItem[], search: string): HubItem[] {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => item.title.toLowerCase().includes(query));
}

export function countUnreadConversations(items: HubItem[]): number {
  return items.filter((item) => item.kind !== 'club' && item.unreadCount > 0).length;
}
