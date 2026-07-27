import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Search } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Input } from '@/shared/components/ui/Input';
import { EventCard } from '@/features/events/components/EventCard';
import { EventCardSkeleton } from '@/features/events/components/EventCardSkeleton';
import { en } from '@/shared/constants/locales/en';
import { queryKeys } from '@/shared/constants/queryKeys';
import { eventService } from '@/features/events/services/eventService';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

export function EventsPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 250);
  const eventFilters = debouncedQuery ? { search: debouncedQuery, limit: 100 } : { limit: 100 };

  const eventsQuery = useQuery({
    queryKey: queryKeys.events.list(eventFilters),
    queryFn: () => eventService.list(eventFilters),
  });

  const events = eventsQuery.data?.data ?? [];

  return (
    <PageContainer className="space-y-5 pt-4 sm:pt-6">
      <Helmet>
        <title>All Events | Social Circle</title>
      </Helmet>

      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text-primary">All Events</h1>
          <p className="max-w-2xl text-text-secondary">
            Browse every upcoming event currently available across Social Circle.
          </p>
        </div>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={en.placeholders.search}
            className="pl-9"
            aria-label={en.actions.search}
          />
        </form>
      </header>

      {eventsQuery.isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!eventsQuery.isPending && events.length === 0 && (
        <EmptyState icon={CalendarDays} title="No events available yet." />
      )}

      {!eventsQuery.isPending && events.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
