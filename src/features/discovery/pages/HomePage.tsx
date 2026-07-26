import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Compass } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import { CLUB_SORT_OPTIONS, PAGE_SIZE_DEFAULT } from '@/shared/constants/app.constants';
import { useAuth } from '@/shared/hooks/useAuth';
import { useClubsFeed } from '@/features/discovery/hooks/useClubsFeed';
import { ClubCard } from '@/features/discovery/components/ClubCard';
import { ClubCardSkeleton } from '@/features/discovery/components/ClubCardSkeleton';
import { CategoryFilterStrip } from '@/features/discovery/components/CategoryFilterStrip';
import { FilterSortRow } from '@/features/discovery/components/FilterSortRow';
import { WelcomeBanner } from '@/features/discovery/components/WelcomeBanner';
import { HeroSection } from '@/features/discovery/components/HeroSection';
import { StatsStrip } from '@/features/discovery/components/StatsStrip';
import { UpcomingEventsStrip } from '@/features/discovery/components/UpcomingEventsStrip';
import { HowItWorksSection } from '@/features/discovery/components/HowItWorksSection';
import { TestimonialsSection } from '@/features/discovery/components/TestimonialsSection';
import { MarketingFaqSection } from '@/features/discovery/components/MarketingFaqSection';
import { NewsletterSignup } from '@/features/discovery/components/NewsletterSignup';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import type { ClubFilters } from '@/types/club.types';

export function HomePage() {
  const { user } = useAuth();
  const [category, setCategory] = useState<string>();
  const [type, setType] = useState<ClubFilters['type']>();
  const [sort, setSort] = useState<(typeof CLUB_SORT_OPTIONS)[number]>('recommended');

  const { data, isPending, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useClubsFeed({
      category,
      type,
      sort,
    });

  const clubs = data?.pages.flatMap((page) => page.data) ?? [];
  const hasFilters = Boolean(category || type);

  function clearFilters() {
    setCategory(undefined);
    setType(undefined);
  }

  return (
    <PageContainer className="space-y-10">
      <Helmet>
        <title>{en.discovery.title} | Social Circle</title>
        <meta name="description" content={en.discovery.subtitle} />
      </Helmet>

      {!user && <HeroSection />}
      {!user && <StatsStrip />}

      {user && <WelcomeBanner fullName={user.fullName} />}

      {user && (
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{en.discovery.title}</h1>
          <p className="text-sm text-text-secondary">{en.discovery.subtitle}</p>
        </div>
      )}

      <div className="space-y-5">
        <CategoryFilterStrip selected={category} onSelect={setCategory} />
        <FilterSortRow type={type} onTypeChange={setType} sort={sort} onSortChange={setSort} />

        {isError && (
          <EmptyState
            title={en.discovery.failedToLoad}
            ctaLabel={en.actions.retry}
            onCtaClick={() => refetch()}
          />
        )}

        {!isError && isPending && (
          <div
            id="club-grid"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-hidden="true"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <ClubCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isError && !isPending && clubs.length === 0 && (
          <EmptyState
            icon={Compass}
            title={en.discovery.noClubsFiltered}
            ctaLabel={hasFilters ? en.actions.clearFilters : undefined}
            onCtaClick={hasFilters ? clearFilters : undefined}
          />
        )}

        {!isError && clubs.length > 0 && (
          <>
            <div id="club-grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {en.discovery.loadMoreCount(PAGE_SIZE_DEFAULT)}
                </Button>
              </div>
            )}
          </>
        )}

        <UpcomingEventsStrip />
      </div>

      {!user && (
        <div className="space-y-4">
          <HowItWorksSection />
          <TestimonialsSection />
          <MarketingFaqSection />
          <NewsletterSignup />
          <MarketingFooter />
        </div>
      )}
    </PageContainer>
  );
}
