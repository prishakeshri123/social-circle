import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, Users } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { CategoryIconBadge } from '@/features/clubs/components/CategoryIconBadge';
import type { MyClub } from '@/types/club.types';

interface MyClubCardProps {
  club: MyClub;
  eventsCount: number;
  unreadCount: number;
}

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <Icon className="size-4 text-text-muted" aria-hidden="true" />
      <span className="text-sm font-semibold text-text-primary">{value}</span>
      <span className="text-xs text-text-muted">{label}</span>
    </div>
  );
}

export function MyClubCard({ club, eventsCount, unreadCount }: MyClubCardProps) {
  const dashboardUrl = ROUTES.clubDashboard(club.slug);
  const roleLabel = club.myRole === 'owner' ? en.members.roleOwner : en.members.roleMember;

  return (
    <Card className="overflow-hidden p-0 transition-shadow duration-fast hover:shadow-card-hover">
      <div className="relative aspect-video w-full bg-surface">
        {club.bannerUrl && (
          <img
            src={club.bannerUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        )}
        <Badge className="absolute right-2 top-2 border-transparent bg-neutral-900/80 text-white backdrop-blur-sm">
          {roleLabel}
        </Badge>
        <CategoryIconBadge category={club.category} className="absolute -bottom-5 left-4 size-12" />
      </div>

      <div className="space-y-3 p-4 pt-7">
        <div>
          <h3 className="truncate text-base font-semibold text-text-primary">{club.name}</h3>
          {club.tagline && (
            <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{club.tagline}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 border-y border-border py-3">
          <StatItem icon={Users} value={club.memberCount} label={en.myClubs.membersLabel} />
          <StatItem icon={Calendar} value={eventsCount} label={en.myClubs.eventsLabel} />
          <StatItem icon={MessageCircle} value={unreadCount} label={en.myClubs.unreadLabel} />
        </div>

        <Button asChild className="w-full">
          <Link to={dashboardUrl}>{en.myClubs.openClubCta}</Link>
        </Button>
      </div>
    </Card>
  );
}
