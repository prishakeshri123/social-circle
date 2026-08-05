import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { useJoinClub } from '@/features/clubs/hooks/useJoinClub';
import { CategoryIconBadge } from '@/features/clubs/components/CategoryIconBadge';
import type { Club } from '@/types/club.types';

interface RecommendedClubMiniCardProps {
  club: Club;
}

export function RecommendedClubMiniCard({ club }: RecommendedClubMiniCardProps) {
  const navigate = useNavigate();
  const joinMutation = useJoinClub(club.slug);
  const landingUrl = ROUTES.clubLanding(club.slug);

  function handleJoin(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (club.type === 'free') {
      joinMutation.mutate(club.id);
    } else {
      // Paid clubs complete their purchase on the landing page's Buy button.
      navigate(landingUrl);
    }
  }

  return (
    <Card className="relative isolate flex items-center gap-3 p-3">
      <Link to={landingUrl} className="absolute inset-0 z-10" aria-label={club.name} />

      <CategoryIconBadge category={club.category} className="relative z-0 size-11" />

      <div className="relative z-0 min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">{club.name}</p>
        <p className="text-xs text-text-muted">{en.discovery.membersCount(club.memberCount)}</p>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="relative z-20 shrink-0 border-primary-500 text-primary-600 hover:bg-primary-50"
        onClick={handleJoin}
        disabled={joinMutation.isPending}
      >
        {club.type === 'free' ? en.discovery.joinCta : en.discovery.viewClubCta}
      </Button>
    </Card>
  );
}
