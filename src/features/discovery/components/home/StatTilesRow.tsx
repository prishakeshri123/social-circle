import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  MessageCircle,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/utils/cn';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useMyUpcomingEvents } from '@/features/events/hooks/useMyUpcomingEvents';

interface StatTileProps {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: number;
  ctaLabel: string;
  to: string;
}

function StatTile({ icon: Icon, iconClassName, label, value, ctaLabel, to }: StatTileProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl',
            iconClassName,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
      <Link
        to={to}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors duration-fast hover:text-primary-700"
      >
        {ctaLabel}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </Card>
  );
}

export function StatTilesRow() {
  const myClubsQuery = useMyClubs();
  const upcomingEventsQuery = useMyUpcomingEvents(50);
  const conversationsQuery = useConversations();
  const invitationsQuery = useInvitations();

  const myClubsCount = myClubsQuery.data?.length ?? 0;
  const upcomingEventsCount = upcomingEventsQuery.data.length;
  const unreadMessagesCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile
        icon={Users}
        iconClassName="bg-primary-100 text-primary-600"
        label={en.home.statMyClubs}
        value={myClubsCount}
        ctaLabel={en.home.viewAllCta}
        to={ROUTES.myClubs}
      />
      <StatTile
        icon={Calendar}
        iconClassName="bg-success-100 text-success-500"
        label={en.home.statUpcomingEvents}
        value={upcomingEventsCount}
        ctaLabel={en.home.viewAllCta}
        to={ROUTES.myEvents}
      />
      <StatTile
        icon={MessageCircle}
        iconClassName="bg-info-100 text-info-500"
        label={en.home.statUnreadMessages}
        value={unreadMessagesCount}
        ctaLabel={en.home.viewChatsCta}
        to={ROUTES.messages}
      />
      <StatTile
        icon={UserPlus}
        iconClassName="bg-warning-100 text-warning-500"
        label={en.home.statPendingInvitations}
        value={pendingInvitationsCount}
        ctaLabel={en.home.viewInvitesCta}
        to={ROUTES.invitations}
      />
    </div>
  );
}
