import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Users } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { formatRelativeTime } from '@/shared/utils/formatDate';
import { getCategoryIconStyle } from '@/features/clubs/utils/getCategoryIconStyle';
import { fadeInUp } from '@/shared/utils/animations';
import type { SavedClub } from '@/types/club.types';

interface SavedClubCardProps {
  club: SavedClub;
  onUnsave: (clubId: string) => void;
  isUnsaving?: boolean;
}

// Ribbon-tab silhouette (rectangle with a notch cut from the bottom) — a
// paper bookmark peeking out of the club banner, reused across every card
// so the grid reads as one saved collection rather than a club listing.
const RIBBON_CLIP_PATH = 'polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)';

export function SavedClubCard({ club, onUnsave, isUnsaving = false }: SavedClubCardProps) {
  const { icon: CategoryIcon } = getCategoryIconStyle(club.category);

  return (
    <motion.div
      layout
      variants={fadeInUp}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
    >
      <Card className="group overflow-hidden p-0 transition-all duration-fast hover:-translate-y-1 hover:shadow-card-hover">
        <div className="relative aspect-video w-full overflow-hidden bg-surface">
          {club.bannerUrl && (
            <img
              src={club.bannerUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-slow group-hover:scale-105"
            />
          )}

          <div
            className="gradient-bg absolute left-5 top-0 z-10 flex h-11 w-8 items-start justify-center pt-2 shadow-md"
            style={{ clipPath: RIBBON_CLIP_PATH }}
          >
            <CategoryIcon className="size-3.5 text-white" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={() => onUnsave(club.id)}
            disabled={isUnsaving}
            aria-label={`${en.savedClubs.unsaveCta} ${club.name}`}
            className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-neutral-900/70 text-white backdrop-blur-md transition-colors duration-fast hover:bg-error-500 disabled:opacity-60"
          >
            <Bookmark className="size-4 fill-current" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="truncate text-base font-semibold text-text-primary">{club.name}</h3>
            {club.tagline && (
              <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{club.tagline}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs text-text-secondary">
              <Users className="size-3 text-text-muted" aria-hidden="true" />
              {en.discovery.membersCount(club.memberCount)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs text-text-secondary">
              {en.savedClubs.savedLabel(formatRelativeTime(club.savedAt))}
            </span>
          </div>

          <Button asChild className="w-full">
            <Link to={ROUTES.clubLanding(club.slug)}>{en.savedClubs.viewClubCta}</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
