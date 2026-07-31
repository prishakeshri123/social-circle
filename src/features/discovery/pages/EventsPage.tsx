import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Clock, MapPin, PartyPopper, Search, Sparkles, Ticket } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Input } from '@/shared/components/ui/Input';
import { EventCard } from '@/features/events/components/EventCard';
import { EventCardSkeleton } from '@/features/events/components/EventCardSkeleton';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { en } from '@/shared/constants/locales/en';
import { queryKeys } from '@/shared/constants/queryKeys';
import { eventService } from '@/features/events/services/eventService';
import { useAuth } from '@/shared/hooks/useAuth';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import eventsHeroIllustration from '@/assets/images/event-bannder.svg';

export function EventsPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 250);
  const eventFilters = debouncedQuery ? { search: debouncedQuery, limit: 100 } : { limit: 100 };

  const eventsQuery = useQuery({
    queryKey: queryKeys.events.list(eventFilters),
    queryFn: () => eventService.list(eventFilters),
  });

  const events = eventsQuery.data?.data ?? [];
  const hasFilters = Boolean(debouncedQuery);

  function clearFilters() {
    setQuery('');
  }

  return (
    <PageContainer className="space-y-8">
      <Helmet>
        <title>{en.events.allEventsTitle} | Social Circle</title>
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
                {en.events.allEventsTitle}
                <Sparkles className="size-6 text-accent-500" aria-hidden="true" />
              </h1>
              <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
                {en.events.allEventsHeroTagline}
              </p>
              <p className="max-w-lg text-sm text-text-secondary sm:text-base">
                {en.events.allEventsHeroBody}
              </p>
            </div>

            <div className="relative mx-auto hidden w-full max-w-sm lg:block">
              <img
                src={eventsHeroIllustration}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="w-full object-contain"
              />
              <span className="absolute -left-2 top-6 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-primary-600 shadow-modal">
                <Ticket className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-error-500 shadow-modal">
                <PartyPopper className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute -right-2 top-1/2 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-warning-500 shadow-modal">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute bottom-2 right-8 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-primary-600 shadow-modal">
                <MapPin className="size-5" aria-hidden="true" />
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

      {eventsQuery.isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!eventsQuery.isPending && events.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title={en.events.noEventsAvailable}
          ctaLabel={hasFilters ? en.actions.clearFilters : undefined}
          onCtaClick={hasFilters ? clearFilters : undefined}
        />
      )}

      {!eventsQuery.isPending && events.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
