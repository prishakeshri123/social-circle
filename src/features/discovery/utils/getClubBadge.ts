import { en } from '@/shared/constants/locales/en';
import { NEW_CLUB_THRESHOLD_DAYS } from '@/shared/constants/app.constants';
import type { Club } from '@/types/club.types';
import type { BadgeProps } from '@/shared/components/ui/Badge';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Derives the "Popular / Trending / New" pill shown on marketing club cards from real club data. */
export function getClubBadge(club: Club): { label: string; variant: BadgeProps['variant'] } {
  const ageDays = (Date.now() - new Date(club.createdAt).getTime()) / MS_PER_DAY;

  if (ageDays <= NEW_CLUB_THRESHOLD_DAYS) {
    return { label: en.marketing.clubBadgeNew, variant: 'error' };
  }
  if (club.featured) {
    return { label: en.marketing.clubBadgePopular, variant: 'success' };
  }
  return { label: en.marketing.clubBadgeTrending, variant: 'info' };
}
