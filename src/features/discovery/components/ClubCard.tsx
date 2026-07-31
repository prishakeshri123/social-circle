import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { CATEGORIES } from '@/shared/constants/categories';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import { useJoinClub } from '@/features/clubs/hooks/useJoinClub';
import { cn } from '@/shared/utils/cn';
import type { Club } from '@/types/club.types';

interface ClubCardProps {
  club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
  const categoryLabel = CATEGORIES.find((c) => c.slug === club.category)?.label ?? club.category;
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const joinMutation = useJoinClub(club.slug);
  const landingUrl = ROUTES.clubLanding(club.slug);

  function handleJoin(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (club.type === 'free') {
      requireAuth('join', () => joinMutation.mutate(club.id));
    } else {
      // Paid clubs: the card only links through to the landing page — the
      // actual purchase (and its auth gate) lives on ClubDetailsCard's Buy button.
      navigate(landingUrl);
    }
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
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
            <Badge
              variant={club.type === 'free' ? 'success' : 'warning'}
              className="absolute right-2 top-2"
            >
              {club.type === 'free' ? en.payment.freeLabel : en.payment.paidLabel}
            </Badge>
          </div>

          <div className="relative z-10 space-y-2 p-4">
            <div className="flex items-center gap-2">
              <Avatar className="size-8 shrink-0">
                <AvatarImage src={club.logoUrl} alt="" />
                <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="truncate text-sm font-semibold text-text-primary">{club.name}</h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Badge variant="secondary">{categoryLabel}</Badge>
              {club.city && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="size-3" aria-hidden="true" />
                  {club.city}
                </span>
              )}
            </div>

            {club.tagline && (
              <p className="line-clamp-2 text-sm text-text-secondary">{club.tagline}</p>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Users className="size-3.5" aria-hidden="true" />
                {en.discovery.membersCount(club.memberCount)}
              </span>
              <Button
                size="sm"
                variant={club.type === 'free' ? 'default' : 'outline'}
                className={cn(
                  'relative z-20',
                  club.type !== 'free' && 'border-primary-500 text-primary-600 hover:bg-primary-50',
                )}
                onClick={handleJoin}
                disabled={joinMutation.isPending}
              >
                {club.type === 'free' ? en.discovery.joinCta : en.discovery.viewClubCta}
              </Button>
            </div>
          </div>
        </article>
      </Card>
    </motion.div>
  );
}
