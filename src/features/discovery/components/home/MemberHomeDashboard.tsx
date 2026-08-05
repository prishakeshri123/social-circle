import { Sidebar } from '@/shared/components/layout/Sidebar';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { MemberWelcomeHero } from '@/features/discovery/components/home/MemberWelcomeHero';
import { StatTilesRow } from '@/features/discovery/components/home/StatTilesRow';
import { ContinueYourCommunities } from '@/features/discovery/components/home/ContinueYourCommunities';
import { MemberUpcomingEvents } from '@/features/discovery/components/home/MemberUpcomingEvents';
import type { User } from '@/types/user.types';

interface MemberHomeDashboardProps {
  user: User;
}

export function MemberHomeDashboard({ user }: MemberHomeDashboardProps) {
  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();

  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  return (
    <div className="flex items-start">
      <Sidebar
        unreadChatsCount={unreadChatsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 md:flex"
      />

      <div className="min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <MemberWelcomeHero fullName={user.fullName} />
        <StatTilesRow />
        <ContinueYourCommunities />
        <MemberUpcomingEvents />
      </div>
    </div>
  );
}
