import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { CATEGORIES } from '@/shared/constants/categories';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { getClubBadge } from '@/features/discovery/utils/getClubBadge';
import type { Club } from '@/types/club.types';

interface PopularClubCardProps {
  club: Club;
}

export function PopularClubCard({ club }: PopularClubCardProps) {
  const categoryLabel = CATEGORIES.find((c) => c.slug === club.category)?.label ?? club.category;
  const badge = getClubBadge(club);
  const landingUrl = ROUTES.clubLanding(club.slug);

  return (
    <Card className="relative isolate overflow-hidden rounded-2xl p-0 transition-shadow duration-normal hover:shadow-card-hover">
      <Link to={landingUrl} className="absolute inset-0 z-10" aria-label={club.name} />

      <article>
        <div className="relative z-0 aspect-video w-full bg-surface">
          {club.bannerUrl && (
            <img
              src={club.bannerUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          )}
          <Badge variant={badge.variant} className="absolute left-2 top-2">
            {badge.label}
          </Badge>
          <Avatar className="absolute -bottom-4 left-3 size-9 ring-2 ring-surface-raised">
            <AvatarImage src={club.logoUrl} alt="" />
            <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="relative z-10 space-y-2 p-4 pt-6">
          <h3 className="truncate text-sm font-semibold text-text-primary">{club.name}</h3>
          <p className="text-xs text-text-secondary">{categoryLabel}</p>
          <p className="flex items-center gap-1 text-xs text-text-muted">
            <Users className="size-3.5" aria-hidden="true" />
            {en.discovery.membersCount(club.memberCount)}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="relative z-20 w-full border-primary-500 text-primary-600 hover:bg-primary-50"
            asChild
          >
            <Link to={landingUrl}>{en.discovery.viewClubCta}</Link>
          </Button>
        </div>
      </article>
    </Card>
  );
}
