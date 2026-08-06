import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { useClubDashboardContext } from '@/features/clubs/hooks/useClubDashboardContext';
import { useChannels } from '@/features/chat/hooks/useChannels';
import { GroupChatView } from '@/features/chat/components/GroupChatView';
import { humanizeChannelName } from '@/features/chat/utils/hubItems';
import type { MyClub } from '@/types/club.types';

// Renders the same GroupChatView used by the /messages hub's "groups" filter,
// scoped to this club's default (general) channel -- so the dashboard's Chat
// tab (S-11) and the hub's deep link into a club channel share one real
// implementation instead of diverging.
export function ClubDashboardChatPage() {
  const { club, membership } = useClubDashboardContext();
  const { data: channels, isLoading } = useChannels(club.id);

  if (isLoading) return <LoadingSpinner className="min-h-[50vh]" />;

  const defaultChannel =
    channels?.find((c) => c.type === 'group' && c.name === 'general') ??
    channels?.find((c) => c.type === 'group') ??
    channels?.[0];

  if (!defaultChannel) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState title={en.hub.emptyListGroups} />
      </div>
    );
  }

  const myClub: MyClub = { ...club, myRole: membership.role };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] overflow-hidden">
      <GroupChatView
        club={myClub}
        channelId={defaultChannel.id}
        channelSubtitle={humanizeChannelName(defaultChannel.name)}
        category={club.category}
        onBack={() => {}}
      />
    </div>
  );
}
