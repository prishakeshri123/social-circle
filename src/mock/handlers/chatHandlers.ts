import type MockAdapter from 'axios-mock-adapter';
import { nanoid } from 'nanoid';
import type {
  ChatChannel,
  ChatMessage,
  ChatPoll,
  ConversationSummary,
  MessageType,
} from '@/types/chat.types';
import type { Club, ClubMembership } from '@/types/club.types';
import { en } from '@/shared/constants/locales/en';
import { PAGE_SIZE_CHAT, LS_MOCK_CHAT_DB_KEY } from '@/shared/constants/app.constants';
import { userIdFromToken, mockUsers } from '@/mock/handlers/authHandlers';
import { ONLINE_USER_IDS } from '@/mock/handlers/clubHandlers';
import { pushNotification } from '@/mock/handlers/notificationHandlers';
import { ROUTES } from '@/shared/constants/routes';
import { loadJSON, saveJSON } from '@/mock/utils/persistentStore';
import { broadcastChatChange } from '@/shared/utils/chatRealtimeChannel';
import seedChannels from '@/mock/data/chatChannels.json';
import seedMessages from '@/mock/data/chatMessages.json';
import seedClubs from '@/mock/data/clubs.json';
import seedMemberships from '@/mock/data/memberships.json';

const e = en.errors;

// The "database" below is persisted to localStorage on every mutation and
// hydrated from it here, so chat data survives reloads and is shared across
// browser tabs on the same origin (the mechanism that makes cross-tab
// "real-time" chat testable with two dev accounts). First run in a browser
// falls back to the seed fixtures.
interface ChatDb {
  channels: ChatChannel[];
  messages: ChatMessage[];
  dmChannelsByPair: [string, string][];
  pollVotesByUser: [string, string[]][];
  voteCountsByMessage: [string, [string, number][]][];
}

const DEFAULT_DM_PAIRS: [string, string][] = [
  [['usr_mod01', 'usr_member01'].sort().join(':'), 'ch_dm_mod_member01'],
];

const persisted = loadJSON<ChatDb | null>(LS_MOCK_CHAT_DB_KEY, null);

const channels: ChatChannel[] = persisted?.channels ?? [...(seedChannels as ChatChannel[])];
const messages: ChatMessage[] = persisted?.messages ?? [...(seedMessages as ChatMessage[])];
const clubs: Club[] = seedClubs as Club[];
const memberships: ClubMembership[] = seedMemberships as ClubMembership[];

// DM pair -> channel id.
const dmChannelsByPair = new Map<string, string>(persisted?.dmChannelsByPair ?? DEFAULT_DM_PAIRS);

// Per-user poll vote tracking, keyed `${messageId}:${userId}`, so switching
// between the dev owner/member accounts doesn't bleed vote state across
// "users".
const pollVotesByUser = new Map<string, string[]>(persisted?.pollVotesByUser ?? []);
const voteCountsByMessage = new Map<string, Map<string, number>>(
  (persisted?.voteCountsByMessage ?? []).map(([messageId, entries]) => [
    messageId,
    new Map(entries),
  ]),
);

function persistDb(): void {
  saveJSON<ChatDb>(LS_MOCK_CHAT_DB_KEY, {
    channels,
    messages,
    dmChannelsByPair: Array.from(dmChannelsByPair.entries()),
    pollVotesByUser: Array.from(pollVotesByUser.entries()),
    voteCountsByMessage: Array.from(voteCountsByMessage.entries()).map(([messageId, counts]) => [
      messageId,
      Array.from(counts.entries()),
    ]),
  });
}

// Persists the mutated collections and notifies other open tabs. Call this
// as the last step of every mutating handler.
function commit(channelId?: string): void {
  persistDb();
  broadcastChatChange({ channelId });
}

// Each browser tab holds its own in-memory copy of these collections, seeded
// once from localStorage at module load. Without re-reading before every
// request, a tab that only *reads* (polling, or a broadcast-triggered
// refetch) keeps re-serving that stale snapshot forever, even though another
// tab's writes already landed in localStorage -- this is what actually makes
// cross-tab sync visible rather than just theoretically wired up. Cheap
// enough to do unconditionally: a localStorage read + JSON.parse per request.
function hydrateFromStorage(): void {
  const stored = loadJSON<ChatDb | null>(LS_MOCK_CHAT_DB_KEY, null);
  if (!stored) return;

  channels.length = 0;
  channels.push(...stored.channels);

  messages.length = 0;
  messages.push(...stored.messages);

  dmChannelsByPair.clear();
  stored.dmChannelsByPair.forEach(([key, value]) => dmChannelsByPair.set(key, value));

  pollVotesByUser.clear();
  stored.pollVotesByUser.forEach(([key, value]) => pollVotesByUser.set(key, value));

  voteCountsByMessage.clear();
  stored.voteCountsByMessage.forEach(([messageId, entries]) => {
    voteCountsByMessage.set(messageId, new Map(entries));
  });
}

function parseBody<T>(data: unknown): T {
  return (typeof data === 'string' ? JSON.parse(data) : data) as T;
}

function extractUserId(headers: unknown): string | null {
  const authHeader =
    headers && typeof headers === 'object' && 'Authorization' in headers
      ? (headers as Record<string, string>).Authorization
      : undefined;
  const token = authHeader?.replace(/^Bearer\s+/, '');
  return userIdFromToken(token);
}

function getVoteCounts(message: ChatMessage): Map<string, number> {
  let counts = voteCountsByMessage.get(message.id);
  if (!counts) {
    counts = new Map((message.poll?.options ?? []).map((o) => [o.id, o.voteCount]));
    voteCountsByMessage.set(message.id, counts);
  }
  return counts;
}

function projectMessage(message: ChatMessage, userId: string | null): ChatMessage {
  if (!message.poll) return message;
  const counts = getVoteCounts(message);
  const voted = userId ? (pollVotesByUser.get(`${message.id}:${userId}`) ?? []) : [];
  const poll: ChatPoll = {
    ...message.poll,
    options: message.poll.options.map((o) => ({
      ...o,
      voteCount: counts.get(o.id) ?? o.voteCount,
    })),
    userVotedOptionIds: voted,
  };
  return { ...message, poll };
}

function messagePreview(message: ChatMessage): string {
  if (message.deleted) return en.hub.messageTypeDeleted;
  switch (message.type) {
    case 'text':
      return message.text ?? '';
    case 'image':
      return en.hub.messageTypeImage;
    case 'video':
      return en.hub.messageTypeVideo;
    case 'document':
      return en.hub.messageTypeDocument(message.text ?? en.hub.messageTypeVoice);
    case 'voice':
      return en.hub.messageTypeVoice;
    case 'poll':
      return en.hub.messageTypePoll(message.poll?.question ?? '');
    default:
      return message.text ?? '';
  }
}

function lastRealMessage(channelId: string): ChatMessage | null {
  const candidates = messages
    .filter((m) => m.channelId === channelId && m.type !== 'system')
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  return candidates[0] ?? null;
}

function unreadCountFor(channelId: string, userId: string): number {
  return messages.filter(
    (m) =>
      m.channelId === channelId &&
      m.type !== 'system' &&
      !m.deleted &&
      m.senderId !== userId &&
      !m.readBy.includes(userId),
  ).length;
}

function toPreview(
  message: ChatMessage | null,
  userId: string,
): ConversationSummary['lastMessage'] {
  if (!message) return null;
  return {
    preview: messagePreview(message),
    senderId: message.senderId,
    isMine: message.senderId === userId,
    sentAt: message.sentAt,
  };
}

function handleMyConversations(userId: string | null): [number, unknown] {
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }

  const myClubIds = new Set(
    memberships.filter((m) => m.userId === userId && m.status === 'active').map((m) => m.clubId),
  );

  const groupResults: ConversationSummary[] = channels
    .filter((c) => c.type !== 'direct' && myClubIds.has(c.clubId))
    .map((c) => {
      const club = clubs.find((cl) => cl.id === c.clubId);
      if (!club) return null;
      const last = lastRealMessage(c.id);
      const summary: ConversationSummary = {
        channelId: c.id,
        kind: 'group',
        clubId: club.id,
        clubSlug: club.slug,
        clubName: club.name,
        clubLogoUrl: club.logoUrl,
        channelName: c.name,
        lastMessage: toPreview(last, userId),
        unreadCount: unreadCountFor(c.id, userId),
      };
      return summary;
    })
    .filter((c): c is ConversationSummary => c !== null);

  const directResults: ConversationSummary[] = channels
    .filter((c) => c.type === 'direct' && c.participantIds?.includes(userId))
    .map((c) => {
      const otherId = c.participantIds?.find((id) => id !== userId);
      const other = mockUsers.find((u) => u.id === otherId);
      if (!other) return null;
      const last = lastRealMessage(c.id);
      const summary: ConversationSummary = {
        channelId: c.id,
        kind: 'direct',
        otherUser: {
          id: other.id,
          fullName: other.fullName,
          avatarUrl: other.avatarUrl,
          isOnline: ONLINE_USER_IDS.has(other.id),
        },
        lastMessage: toPreview(last, userId),
        unreadCount: unreadCountFor(c.id, userId),
      };
      return summary;
    })
    .filter((c): c is ConversationSummary => c !== null);

  const data = [...groupResults, ...directResults].sort((a, b) => {
    const at = a.lastMessage ? new Date(a.lastMessage.sentAt).getTime() : 0;
    const bt = b.lastMessage ? new Date(b.lastMessage.sentAt).getTime() : 0;
    return bt - at;
  });

  return [200, { data }];
}

function handleListChannels(clubId: string): [number, unknown] {
  return [200, { data: channels.filter((c) => c.clubId === clubId) }];
}

// Fetching a channel's messages implies the client received them -- mark
// delivered for anything not already marked, mirroring "delivered once it
// reaches the recipient's device" without a separate push mechanism.
function markDelivered(channelId: string, userId: string | null): boolean {
  if (!userId) return false;
  let changed = false;
  messages.forEach((m) => {
    if (m.channelId === channelId && m.senderId !== userId && !m.deliveredTo.includes(userId)) {
      m.deliveredTo.push(userId);
      changed = true;
    }
  });
  return changed;
}

function handleListMessages(
  channelId: string,
  params: Record<string, string> | undefined,
  userId: string | null,
): [number, unknown] {
  const filters = params ?? {};
  const limit = Number(filters.limit) || PAGE_SIZE_CHAT;

  const all = messages
    .filter((m) => m.channelId === channelId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

  const before = filters.before ? new Date(filters.before).getTime() : null;
  const scoped = before ? all.filter((m) => new Date(m.sentAt).getTime() < before) : all;
  const page = scoped.slice(Math.max(0, scoped.length - limit));
  const hasMore = scoped.length > page.length;
  const cursor = page.length > 0 ? page[0].sentAt : null;

  if (markDelivered(channelId, userId)) {
    commit(channelId);
  }

  return [
    200,
    {
      data: page.map((m) => projectMessage(m, userId)),
      cursor,
      hasMore,
    },
  ];
}

// Marks every message in a channel as read by the caller (except their own),
// called when a thread is actually open/visible on their side.
function handleMarkRead(channelId: string, userId: string | null): [number, unknown] {
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }
  let changed = false;
  messages.forEach((m) => {
    if (m.channelId === channelId && m.senderId !== userId && !m.deleted) {
      if (!m.deliveredTo.includes(userId)) {
        m.deliveredTo.push(userId);
        changed = true;
      }
      if (!m.readBy.includes(userId)) {
        m.readBy.push(userId);
        changed = true;
      }
    }
  });
  if (changed) {
    commit(channelId);
  }
  return [200, { data: { ok: true } }];
}

// Best-effort @mention detection: any active club member whose full name
// appears as "@FullName" in a group-channel text message gets a chat_mention
// notification. DMs have no other members to mention.
function notifyMentions(message: ChatMessage, channel: ChatChannel): void {
  if (message.type !== 'text' || !message.text || channel.type === 'direct') return;
  const club = clubs.find((c) => c.id === channel.clubId);
  if (!club) return;

  const sender = mockUsers.find((u) => u.id === message.senderId);
  const memberIds = memberships
    .filter((m) => m.clubId === club.id && m.status === 'active')
    .map((m) => m.userId);

  memberIds.forEach((memberId) => {
    if (memberId === message.senderId) return;
    const member = mockUsers.find((u) => u.id === memberId);
    if (!member || !message.text!.includes(`@${member.fullName}`)) return;
    pushNotification({
      userId: memberId,
      type: 'chat_mention',
      title: en.notifications.mentionTitle,
      body: en.notifications.mentionBody(sender?.fullName ?? '', club.name),
      deepLink: ROUTES.clubChat(club.slug),
    });
  });
}

function handleSendMessage(
  channelId: string,
  data: unknown,
  userId: string | null,
): [number, unknown] {
  const channel = channels.find((c) => c.id === channelId);
  if (!channel) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }

  const body = parseBody<Partial<ChatMessage> & { type: MessageType }>(data);
  const message: ChatMessage = {
    id: `msg_${nanoid(10)}`,
    channelId,
    senderId: userId,
    type: body.type,
    text: body.text,
    mediaUrl: body.mediaUrl,
    mediaType: body.mediaType,
    mediaSize: body.mediaSize,
    mediaThumbnailUrl: body.mediaThumbnailUrl,
    poll: body.poll ? { ...body.poll, closed: false } : undefined,
    replyTo: body.replyTo,
    reactions: {},
    edited: false,
    deleted: false,
    deliveredTo: [],
    readBy: [],
    sentAt: new Date().toISOString(),
  };
  messages.push(message);
  notifyMentions(message, channel);
  commit(channelId);
  return [201, { data: message }];
}

function handleEditMessage(
  messageId: string,
  data: unknown,
  userId: string | null,
): [number, unknown] {
  const message = messages.find((m) => m.id === messageId);
  if (!message) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  if (message.senderId !== userId) {
    return [403, { code: 'FORBIDDEN', message: e.unauthorized }];
  }
  const { text } = parseBody<{ text: string }>(data);
  message.text = text;
  message.edited = true;
  message.editedAt = new Date().toISOString();
  commit(message.channelId);
  return [200, { data: message }];
}

function handleDeleteMessage(messageId: string, userId: string | null): [number, unknown] {
  const message = messages.find((m) => m.id === messageId);
  if (!message) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  if (message.senderId !== userId) {
    return [403, { code: 'FORBIDDEN', message: e.unauthorized }];
  }
  message.deleted = true;
  message.text = undefined;
  commit(message.channelId);
  return [204, undefined];
}

function handleReact(messageId: string, data: unknown, userId: string | null): [number, unknown] {
  const message = messages.find((m) => m.id === messageId);
  if (!message || !userId) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  const { emoji } = parseBody<{ emoji: string }>(data);
  const existing = message.reactions[emoji] ?? [];
  message.reactions[emoji] = existing.includes(userId)
    ? existing.filter((id) => id !== userId)
    : [...existing, userId];
  if (message.reactions[emoji].length === 0) {
    delete message.reactions[emoji];
  }
  commit(message.channelId);
  return [200, { data: { reactions: message.reactions } }];
}

function handleVote(messageId: string, data: unknown, userId: string | null): [number, unknown] {
  const message = messages.find((m) => m.id === messageId);
  if (!message || !message.poll) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }
  const { optionIds } = parseBody<{ optionIds: string[] }>(data);
  const counts = getVoteCounts(message);
  const key = `${messageId}:${userId}`;
  const previous = pollVotesByUser.get(key) ?? [];
  previous.forEach((id) => counts.set(id, Math.max(0, (counts.get(id) ?? 0) - 1)));
  optionIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
  pollVotesByUser.set(key, optionIds);
  commit(message.channelId);
  return [200, { data: projectMessage(message, userId) }];
}

function handleDmChannel(targetUserId: string, userId: string | null): [number, unknown] {
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }
  const key = [userId, targetUserId].sort().join(':');
  let channelId = dmChannelsByPair.get(key);
  if (!channelId) {
    const channel: ChatChannel = {
      id: `ch_${nanoid(10)}`,
      clubId: '',
      name: mockUsers.find((u) => u.id === targetUserId)?.fullName ?? en.chat.membersPanelTitle,
      type: 'direct',
      participantIds: [userId, targetUserId],
      createdAt: new Date().toISOString(),
    };
    channels.push(channel);
    channelId = channel.id;
    dmChannelsByPair.set(key, channelId);
    commit(channelId);
  }
  const channel = channels.find((c) => c.id === channelId);
  return [200, { data: channel }];
}

export function registerChatHandlers(mock: MockAdapter): void {
  mock.onGet('/me/conversations').reply((config) => {
    hydrateFromStorage();
    return handleMyConversations(extractUserId(config.headers));
  });

  mock.onGet(/^\/clubs\/[^/]+\/channels$/).reply((config) => {
    hydrateFromStorage();
    const clubId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleListChannels(clubId);
  });

  mock.onGet(/^\/channels\/[^/]+\/messages$/).reply((config) => {
    hydrateFromStorage();
    const channelId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleListMessages(channelId, config.params, extractUserId(config.headers));
  });

  mock.onPost(/^\/channels\/[^/]+\/messages$/).reply((config) => {
    hydrateFromStorage();
    const channelId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleSendMessage(channelId, config.data, extractUserId(config.headers));
  });

  mock.onPost(/^\/channels\/[^/]+\/read$/).reply((config) => {
    hydrateFromStorage();
    const channelId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleMarkRead(channelId, extractUserId(config.headers));
  });

  mock.onPatch(/^\/messages\/[^/]+$/).reply((config) => {
    hydrateFromStorage();
    const messageId = config.url?.split('/').pop() ?? '';
    return handleEditMessage(messageId, config.data, extractUserId(config.headers));
  });

  mock.onDelete(/^\/messages\/[^/]+$/).reply((config) => {
    hydrateFromStorage();
    const messageId = config.url?.split('/').pop() ?? '';
    return handleDeleteMessage(messageId, extractUserId(config.headers));
  });

  mock.onPost(/^\/messages\/[^/]+\/reactions$/).reply((config) => {
    hydrateFromStorage();
    const messageId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleReact(messageId, config.data, extractUserId(config.headers));
  });

  mock.onPost(/^\/messages\/[^/]+\/vote$/).reply((config) => {
    hydrateFromStorage();
    const messageId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleVote(messageId, config.data, extractUserId(config.headers));
  });

  mock.onPost(/^\/users\/[^/]+\/dm-channel$/).reply((config) => {
    hydrateFromStorage();
    const targetUserId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleDmChannel(targetUserId, extractUserId(config.headers));
  });
}

export { messages as mockChatMessages, channels as mockChatChannels };
