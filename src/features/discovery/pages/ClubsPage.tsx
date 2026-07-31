import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Calendar, Heart, Search, Sparkles, Star, Users } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Input } from '@/shared/components/ui/Input';
import { ClubCard } from '@/features/discovery/components/ClubCard';
import { ClubCardSkeleton } from '@/features/discovery/components/ClubCardSkeleton';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { en } from '@/shared/constants/locales/en';
import { queryKeys } from '@/shared/constants/queryKeys';
import { clubService } from '@/features/clubs/services/clubService';
import { useAuth } from '@/shared/hooks/useAuth';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import clubsHeroIllustration from '@/assets/images/club-group.svg';
import type { ClubFilters } from '@/types/club.types';

export function ClubsPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 250);

  const clubFilters: ClubFilters = {
    search: debouncedQuery || undefined,
    sort: 'recommended',
    limit: 100,
  };

  const clubsQuery = useQuery({
    queryKey: queryKeys.clubs.list(clubFilters),
    queryFn: () => clubService.list(clubFilters),
  });

  const clubs = clubsQuery.data?.data ?? [];
  const hasFilters = Boolean(debouncedQuery);

  function clearFilters() {
    setQuery('');
  }

  return (
    <PageContainer className="space-y-8">
      <Helmet>
        <title>{en.discovery.title} | Social Circle</title>
      </Helmet>

      {/* Hero */}
      <section className="relative left-1/2 -mx-[50vw] w-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-500/5">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                {en.discovery.title}
                <Sparkles className="size-6 text-accent-500" aria-hidden="true" />
              </h1>
              <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
                {en.discovery.heroTagline}
              </p>
              <p className="max-w-lg text-sm text-text-secondary sm:text-base">
                {en.discovery.heroBody}
              </p>
            </div>

            <div className="relative mx-auto hidden w-full max-w-sm lg:block">
              <img
                src={clubsHeroIllustration}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="w-full object-contain"
              />
              <span className="absolute -left-2 top-6 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-primary-600 shadow-modal">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-primary-600 shadow-modal">
                <Calendar className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute -right-2 top-1/2 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-error-500 shadow-modal">
                <Heart className="size-5 fill-current" aria-hidden="true" />
              </span>
              <span className="absolute bottom-2 right-8 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-warning-500 shadow-modal">
                <Star className="size-5 fill-current" aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* Search */}
          <form role="search" onSubmit={(e) => e.preventDefault()} className="relative mt-6 w-full">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={en.placeholders.search}
              aria-label={en.actions.search}
              className="h-12 w-full rounded-full border-border bg-surface-raised pl-11 shadow-card"
            />
          </form>
        </div>
      </section>

      {clubsQuery.isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ClubCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!clubsQuery.isPending && clubs.length === 0 && (
        <EmptyState
          icon={Users}
          title={en.discovery.noClubsFiltered}
          ctaLabel={hasFilters ? en.actions.clearFilters : undefined}
          onCtaClick={hasFilters ? clearFilters : undefined}
        />
      )}

      {!clubsQuery.isPending && clubs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
