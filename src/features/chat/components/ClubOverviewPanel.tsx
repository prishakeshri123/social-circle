import { ArrowLeft, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { CATEGORIES } from '@/shared/constants/categories';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import type { MyClub } from '@/types/club.types';

const ROLE_LABELS: Record<MyClub['myRole'], string> = {
  owner: en.members.roleOwner,
  member: en.members.roleMember,
};

interface ClubOverviewPanelProps {
  club: MyClub;
  onBack: () => void;
}

export function ClubOverviewPanel({ club, onBack }: ClubOverviewPanelProps) {
  const navigate = useNavigate();
  const categoryLabel = CATEGORIES.find((c) => c.slug === club.category)?.label ?? club.category;

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 md:hidden">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label={en.actions.back}>
          <ArrowLeft className="size-5" />
        </Button>
        <p className="text-sm font-semibold text-text-primary">{club.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="relative aspect-[3/1] w-full bg-surface">
          {club.bannerUrl && <img src={club.bannerUrl} alt="" className="size-full object-cover" />}
        </div>

        <div className="space-y-4 p-6">
          <div className="-mt-14 flex items-end gap-4">
            <Avatar className="size-20 rounded-2xl border-4 border-surface-raised shadow-modal">
              <AvatarImage src={club.logoUrl} alt="" className="rounded-2xl" />
              <AvatarFallback className="rounded-2xl text-lg">{club.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Badge variant={club.type === 'free' ? 'success' : 'warning'}>
              {club.type === 'free' ? en.payment.freeLabel : en.payment.paidLabel}
            </Badge>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary">{club.name}</h2>
            {club.tagline && <p className="mt-1 text-sm text-text-secondary">{club.tagline}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
            <Badge variant="secondary">{categoryLabel}</Badge>
            <Badge variant="outline">{ROLE_LABELS[club.myRole]}</Badge>
            {club.city && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden="true" />
                {club.city}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="size-3.5" aria-hidden="true" />
              {en.hub.clubMemberCountLabel(club.memberCount)}
            </span>
          </div>

          {club.about && <p className="text-sm text-text-secondary">{club.about}</p>}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={() => navigate(ROUTES.clubDashboard(club.slug))}>
              {en.hub.openDashboardCta}
            </Button>
            <Button variant="outline" onClick={() => navigate(ROUTES.clubLanding(club.slug))}>
              {en.hub.viewLandingPageCta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
