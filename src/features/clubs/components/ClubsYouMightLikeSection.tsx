import { Link } from 'react-router-dom';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { RECOMMENDED_CLUBS_STRIP_LIMIT } from '@/shared/constants/app.constants';
import { useRecommendedClubs } from '@/features/discovery/hooks/useRecommendedClubs';
import { ClubCard } from '@/features/discovery/components/ClubCard';
import { ClubCardSkeleton } from '@/features/discovery/components/ClubCardSkeleton';

export function ClubsYouMightLikeSection() {
  const { data: clubs, isPending } = useRecommendedClubs(RECOMMENDED_CLUBS_STRIP_LIMIT);

  if (!isPending && clubs.length === 0) return null;

  return (
    <section aria-labelledby="clubs-you-might-like-heading" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="clubs-you-might-like-heading" className="text-lg font-semibold text-text-primary">
            {en.myClubs.recommendedTitle}
          </h2>
          <p className="text-sm text-text-secondary">{en.myClubs.recommendedSubtitle}</p>
        </div>
        <Link
          to={ROUTES.search}
          className="shrink-0 text-sm font-medium text-primary-600 transition-colors duration-fast hover:text-primary-700"
        >
          {en.actions.viewAll}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isPending
          ? Array.from({ length: RECOMMENDED_CLUBS_STRIP_LIMIT }).map((_, i) => (
              <ClubCardSkeleton key={i} />
            ))
          : clubs.map((club) => <ClubCard key={club.id} club={club} />)}
      </div>
    </section>
  );
}
