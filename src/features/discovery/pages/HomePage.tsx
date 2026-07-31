import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Compass } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { HorizontalCarousel } from '@/shared/components/ui/HorizontalCarousel';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { CLUB_SORT_OPTIONS, POPULAR_CLUBS_STRIP_LIMIT } from '@/shared/constants/app.constants';
import { useAuth } from '@/shared/hooks/useAuth';
import { useClubsFeed } from '@/features/discovery/hooks/useClubsFeed';
import { ClubCardSkeleton } from '@/features/discovery/components/ClubCardSkeleton';
import { PopularClubCard } from '@/features/discovery/components/PopularClubCard';
import { WelcomeBanner } from '@/features/discovery/components/WelcomeBanner';
import { HeroSection } from '@/features/discovery/components/HeroSection';
import { FeaturesSection } from '@/features/discovery/components/FeaturesSection';
import { StatsStrip } from '@/features/discovery/components/StatsStrip';
import { UpcomingEventsStrip } from '@/features/discovery/components/UpcomingEventsStrip';
import { TestimonialsSection } from '@/features/discovery/components/TestimonialsSection';
import { MarketingFaqSection } from '@/features/discovery/components/MarketingFaqSection';
import { CommunityCtaSection } from '@/features/discovery/components/CommunityCtaSection';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import type { ClubFilters } from '@/types/club.types';

export function HomePage() {
  const { user } = useAuth();
  const [type, setType] = useState<ClubFilters['type']>();
  const [sort] = useState<(typeof CLUB_SORT_OPTIONS)[number]>('recommended');

  const { data, isPending, isError, refetch } = useClubsFeed({ type, sort });

  const clubs = data?.pages.flatMap((page) => page.data) ?? [];
  const hasFilters = Boolean(type);

  function clearFilters() {
    setType(undefined);
  }

  // Guest view: a curated "Explore Top Communities" carousel matching the
  // marketing reference — no category tiles / pagination chrome.
  const popularClubs = clubs.slice(0, POPULAR_CLUBS_STRIP_LIMIT);

  const guestDiscoveryContent = (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            {en.marketing.popularClubsEyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-primary-900 sm:text-3xl">
            {en.marketing.popularClubsTitle}
          </h2>
        </div>
        <Link
          to={ROUTES.search}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary-600 transition-colors duration-fast hover:text-primary-700 sm:flex"
        >
          {en.marketing.viewAllClubsCta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {isError && (
        <EmptyState
          title={en.discovery.failedToLoad}
          ctaLabel={en.actions.retry}
          onCtaClick={() => refetch()}
        />
      )}

      {!isError && isPending && (
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-60 shrink-0">
              <ClubCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {!isError && !isPending && popularClubs.length === 0 && (
        <EmptyState
          icon={Compass}
          title={en.discovery.noClubsFiltered}
          ctaLabel={hasFilters ? en.actions.clearFilters : undefined}
          onCtaClick={hasFilters ? clearFilters : undefined}
        />
      )}

      {!isError && popularClubs.length > 0 && (
        <HorizontalCarousel
          ariaLabel={en.marketing.popularClubsTitle}
          className="[mask-image:linear-gradient(to_right,black_calc(100%_-_32px),transparent)]"
        >
          {popularClubs.map((club) => (
            <div key={club.id} className="w-60 shrink-0 snap-start">
              <PopularClubCard club={club} />
            </div>
          ))}
        </HorizontalCarousel>
      )}
    </>
  );

  return (
    <>
      <Helmet>
        <title>{en.discovery.title} | Social Circle</title>
        <meta name="description" content={en.discovery.subtitle} />
      </Helmet>

      {/* Rendered outside PageContainer so it sits flush at y=0, flush behind the
          fixed transparent header, with no padding gap above it. */}
      {!user && <HeroSection />}

      <PageContainer className="space-y-6">
        {!user && <FeaturesSection />}

        {user && <WelcomeBanner fullName={user.fullName} />}

        {user && (
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{en.discovery.title}</h1>
            <p className="text-sm text-text-secondary">{en.discovery.subtitle}</p>
          </div>
        )}

        {!user && (
          <section
            id="browse-clubs"
            className="scroll-mt-20 space-y-6 rounded-3xl bg-primary-50 px-4 py-6 sm:px-6"
          >
            {guestDiscoveryContent}
          </section>
        )}

        {!user && <UpcomingEventsStrip />}
        {!user && <StatsStrip variant="banner" />}
        {!user && <TestimonialsSection />}
        {!user && <MarketingFaqSection />}
        {!user && <CommunityCtaSection />}
        {!user && <MarketingFooter />}
      </PageContainer>
    </>
  );
}
