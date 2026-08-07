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
  iconGradientClassName: string;
  iconShadowClassName: string;
  label: string;
  value: number;
  ctaLabel: string;
  to: string;
}

function StatTile({
  icon: Icon,
  iconGradientClassName,
  iconShadowClassName,
  label,
  value,
  ctaLabel,
  to,
}: StatTileProps) {
  return (
    <Card className="p-5 transition-all duration-normal hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl text-text-inverse shadow-sm',
            iconGradientClassName,
            iconShadowClassName,
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
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold gradient-text transition-opacity duration-fast hover:opacity-80"
      >
        {ctaLabel}
        <ArrowRight className="size-3.5 text-[var(--color-brand-cyan)]" aria-hidden="true" />
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
        iconGradientClassName="gradient-bg"
        iconShadowClassName="shadow-primary-500/25"
        label={en.home.statMyClubs}
        value={myClubsCount}
        ctaLabel={en.home.viewAllCta}
        to={ROUTES.myClubs}
      />
      <StatTile
        icon={Calendar}
        iconGradientClassName="bg-gradient-to-br from-emerald-400 to-success-500"
        iconShadowClassName="shadow-success-500/25"
        label={en.home.statUpcomingEvents}
        value={upcomingEventsCount}
        ctaLabel={en.home.viewAllCta}
        to={ROUTES.myEvents}
      />
      <StatTile
        icon={MessageCircle}
        iconGradientClassName="bg-gradient-to-br from-sky-400 to-info-500"
        iconShadowClassName="shadow-info-500/25"
        label={en.home.statUnreadMessages}
        value={unreadMessagesCount}
        ctaLabel={en.home.viewChatsCta}
        to={ROUTES.messages}
      />
      <StatTile
        icon={UserPlus}
        iconGradientClassName="bg-gradient-to-br from-amber-400 to-warning-500"
        iconShadowClassName="shadow-warning-500/25"
        label={en.home.statPendingInvitations}
        value={pendingInvitationsCount}
        ctaLabel={en.home.viewInvitesCta}
        to={ROUTES.invitations}
      />
    </div>
  );
}
