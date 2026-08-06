import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SEARCH_DEBOUNCE_MS } from '@/shared/constants/app.constants';
import { en } from '@/shared/constants/locales/en';
import { queryKeys } from '@/shared/constants/queryKeys';
import { ROUTES } from '@/shared/constants/routes';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useUsersByIds } from '@/shared/hooks/useUsersByIds';
import { cn } from '@/shared/utils/cn';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { chatService } from '@/features/chat/services/chatService';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import {
  buildHubItems,
  countUnreadConversations,
  filterBySearch,
  humanizeChannelName,
  sortHubItems,
  type HubFilter,
  type HubItem,
  type HubSortMode,
} from '@/features/chat/utils/hubItems';
import { ClubOverviewPanel } from '@/features/chat/components/ClubOverviewPanel';
import { ConversationEmptyState } from '@/features/chat/components/ConversationEmptyState';
import { ConversationListPanel } from '@/features/chat/components/ConversationListPanel';
import { ConversationThreadPanel } from '@/features/chat/components/ConversationThreadPanel';
import { GroupChatView } from '@/features/chat/components/GroupChatView';
import { MemberProfileDrawer } from '@/features/chat/components/MemberProfileDrawer';

const EMPTY_MESSAGES: Record<HubFilter, string> = {
  all: en.hub.emptyListAll,
  chats: en.hub.emptyListChats,
  groups: en.hub.emptyListGroups,
  clubs: en.hub.emptyListClubs,
};

interface ConversationsHubPageProps {
  defaultFilter: HubFilter;
}

export function ConversationsHubPage({ defaultFilter }: ConversationsHubPageProps) {
  const navigate = useNavigate();
  const { userId: dmUserId } = useParams<{ userId: string }>();
  const [filter, setFilter] = useState<HubFilter>(dmUserId ? 'chats' : defaultFilter);
  const [sortMode, setSortMode] = useState<HubSortMode>('recent');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const conversationsQuery = useConversations();
  const myClubsQuery = useMyClubs();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();

  const itemsByFilter = useMemo(
    () => buildHubItems(conversationsQuery.data ?? [], myClubsQuery.data ?? []),
    [conversationsQuery.data, myClubsQuery.data],
  );

  const visibleItems = useMemo(
    () => sortHubItems(filterBySearch(itemsByFilter[filter], debouncedSearch), sortMode),
    [itemsByFilter, filter, debouncedSearch, sortMode],
  );

  const unreadConversationCount = useMemo(
    () => countUnreadConversations(itemsByFilter.all),
    [itemsByFilter.all],
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  const selectedItem = itemsByFilter.all.find((item) => item.key === selectedKey) ?? null;

  // Deep link support: /messages/:userId resolves (or creates) a DM channel and selects it,
  // even before that conversation has a preview in the aggregated list.
  const dmResolution = useQuery({
    queryKey: queryKeys.chat.dmChannel(dmUserId ?? ''),
    queryFn: () => chatService.resolveDmChannel(dmUserId ?? ''),
    enabled: Boolean(dmUserId),
  });
  const dmUsers = useUsersByIds(dmUserId ? [dmUserId] : []);
  const resolvedDmUser = dmUserId ? dmUsers[dmUserId] : undefined;

  function handleSelect(item: HubItem) {
    setSelectedKey(item.key);
  }

  function handleFilterChange(next: HubFilter) {
    setFilter(next);
    setSelectedKey(null);
  }

  function handleFindMember() {
    navigate(`${ROUTES.search}?tab=people`);
  }

  function handleBack() {
    setSelectedKey(null);
    if (dmUserId) navigate(ROUTES.messages);
  }

  const isLoading = conversationsQuery.isLoading || myClubsQuery.isLoading;
  const hasDeepLinkFallback = Boolean(
    dmUserId && dmResolution.data && resolvedDmUser && !selectedItem,
  );
  const isDetailOpen = Boolean(selectedItem) || hasDeepLinkFallback;

  const groupClub = selectedItem?.clubId
    ? (myClubsQuery.data ?? []).find((c) => c.id === selectedItem.clubId)
    : undefined;

  let detailPanel: ReactNode;
  if (selectedItem && selectedItem.kind === 'club' && selectedItem.club) {
    detailPanel = <ClubOverviewPanel club={selectedItem.club} onBack={handleBack} />;
  } else if (selectedItem && selectedItem.kind === 'group' && selectedItem.channelId && groupClub) {
    const channelSubtitle = selectedItem.channelName
      ? humanizeChannelName(selectedItem.channelName)
      : en.tabs.chat;
    detailPanel = (
      <GroupChatView
        club={groupClub}
        channelId={selectedItem.channelId}
        channelSubtitle={channelSubtitle}
        category={selectedItem.category}
        onBack={handleBack}
      />
    );
  } else if (selectedItem && selectedItem.kind === 'direct' && selectedItem.channelId) {
    detailPanel = (
      <ConversationThreadPanel
        channelId={selectedItem.channelId}
        title={selectedItem.title}
        subtitle={selectedItem.isOnline ? en.hub.onlineStatus : en.hub.offlineStatus}
        avatarUrl={selectedItem.avatarUrl}
        avatarFallback={selectedItem.avatarFallback}
        isSquareAvatar={false}
        onBack={handleBack}
        onOpenProfile={setProfileUserId}
        headerUserId={selectedItem.otherUserId}
      />
    );
  } else if (hasDeepLinkFallback && dmResolution.data && resolvedDmUser) {
    detailPanel = (
      <ConversationThreadPanel
        channelId={dmResolution.data.id}
        title={resolvedDmUser.fullName}
        avatarUrl={resolvedDmUser.avatarUrl}
        avatarFallback={resolvedDmUser.fullName.charAt(0)}
        isSquareAvatar={false}
        onBack={handleBack}
        onOpenProfile={setProfileUserId}
        headerUserId={dmUserId}
      />
    );
  } else {
    detailPanel = <ConversationEmptyState onFindMember={handleFindMember} />;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] items-stretch overflow-hidden">
      <Sidebar
        unreadChatsCount={unreadConversationCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="hidden h-full w-64 shrink-0 md:flex"
      />

      <ConversationListPanel
        className={cn('w-full shrink-0 md:flex md:w-[22rem]', isDetailOpen ? 'hidden' : 'flex')}
        items={visibleItems}
        isLoading={isLoading}
        filter={filter}
        onFilterChange={handleFilterChange}
        unreadConversationCount={unreadConversationCount}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        search={search}
        onSearchChange={setSearch}
        selectedKey={selectedKey}
        onSelectItem={handleSelect}
        onFindMember={handleFindMember}
        emptyMessage={EMPTY_MESSAGES[filter]}
      />

      <div className={cn('min-w-0 flex-1 md:flex', isDetailOpen ? 'flex' : 'hidden')}>
        {detailPanel}
      </div>

      <MemberProfileDrawer
        userId={profileUserId}
        onOpenChange={(open) => !open && setProfileUserId(null)}
      />
    </div>
  );
}
