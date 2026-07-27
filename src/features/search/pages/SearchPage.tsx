import { useRef, useState, type KeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search as SearchIcon, Users as PeopleIcon } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Input } from '@/shared/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { queryKeys } from '@/shared/constants/queryKeys';
import {
  LS_RECENT_SEARCHES_KEY,
  MAX_RECENT_SEARCHES,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_CHARS,
} from '@/shared/constants/app.constants';
import { useAuth } from '@/shared/hooks/useAuth';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { clubService } from '@/features/clubs/services/clubService';
import { eventService } from '@/features/events/services/eventService';
import { ClubCard } from '@/features/discovery/components/ClubCard';
import { ClubCardSkeleton } from '@/features/discovery/components/ClubCardSkeleton';
import { EventCard } from '@/features/events/components/EventCard';
import { EventCardSkeleton } from '@/features/events/components/EventCardSkeleton';
import { RecentSearches } from '@/features/search/components/RecentSearches';

export function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState('clubs');
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(LS_RECENT_SEARCHES_KEY, []);
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);
  const hasQuery = debouncedQuery.length >= SEARCH_MIN_CHARS;

  const clubResults = useQuery({
    queryKey: queryKeys.clubs.list({ search: debouncedQuery }),
    queryFn: () => clubService.list({ search: debouncedQuery }),
    enabled: hasQuery,
  });

  const popularClubs = useQuery({
    queryKey: queryKeys.clubs.list({ sort: 'most_members', limit: 4 }),
    queryFn: () => clubService.list({ sort: 'most_members', limit: 4 }),
    enabled: !hasQuery,
  });

  const eventResults = useQuery({
    queryKey: queryKeys.events.list({ search: debouncedQuery }),
    queryFn: () => eventService.list({ search: debouncedQuery }),
    enabled: hasQuery && tab === 'events',
  });

  const upcomingEvents = useQuery({
    queryKey: queryKeys.events.list({ upcoming: true, limit: 4 }),
    queryFn: () => eventService.list({ upcoming: true, limit: 4 }),
    enabled: !hasQuery && tab === 'events',
  });

  function commitRecentSearch(value: string) {
    if (value.length < SEARCH_MIN_CHARS) return;
    setRecentSearches((prev) =>
      [value, ...prev.filter((q) => q !== value)].slice(0, MAX_RECENT_SEARCHES),
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    } else if (event.key === 'Enter') {
      commitRecentSearch(query.trim());
    }
  }

  function handleTabChange(value: string) {
    if (value === 'people' && !isAuthenticated) {
      navigate(`${ROUTES.login}?next=${encodeURIComponent(ROUTES.search)}&intent=search-people`);
      return;
    }
    setTab(value);
  }

  const clubs = clubResults.data?.data ?? [];
  const events = eventResults.data?.data ?? [];

  return (
    <PageContainer className="space-y-6 pt-3">
      <Helmet>
        <title>{en.search.title} | Social Circle</title>
      </Helmet>

      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => commitRecentSearch(debouncedQuery)}
            placeholder={en.placeholders.search}
            className="pl-9"
            aria-label={en.actions.search}
          />
        </div>
      </form>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="clubs">{en.search.tabClubs}</TabsTrigger>
          <TabsTrigger value="events">{en.search.tabEvents}</TabsTrigger>
          <TabsTrigger value="people">{en.search.tabPeople}</TabsTrigger>
        </TabsList>

        <TabsContent value="clubs" className="space-y-4">
          {!hasQuery && (
            <>
              <RecentSearches
                searches={recentSearches}
                onSelect={setQuery}
                onClear={() => setRecentSearches([])}
              />
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-text-primary">
                  {en.search.popularClubs}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {popularClubs.isPending
                    ? Array.from({ length: 4 }).map((_, i) => <ClubCardSkeleton key={i} />)
                    : popularClubs.data?.data.map((club) => <ClubCard key={club.id} club={club} />)}
                </div>
              </div>
            </>
          )}

          {hasQuery && (
            <div className="space-y-3">
              <p aria-live="polite" className="text-sm text-text-secondary">
                {!clubResults.isPending && en.search.resultsCount(clubs.length, debouncedQuery)}
              </p>

              {clubResults.isPending && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ClubCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {!clubResults.isPending && clubs.length === 0 && (
                <EmptyState icon={SearchIcon} title={en.empty.noResults(debouncedQuery)} />
              )}

              {!clubResults.isPending && clubs.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs.map((club) => (
                    <ClubCard key={club.id} club={club} />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {!hasQuery && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-text-primary">
                {en.discovery.upcomingEventsTitle}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {upcomingEvents.isPending
                  ? Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
                  : upcomingEvents.data?.data.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
              </div>
            </div>
          )}

          {hasQuery && (
            <div className="space-y-3">
              <p aria-live="polite" className="text-sm text-text-secondary">
                {!eventResults.isPending && en.search.resultsCount(events.length, debouncedQuery)}
              </p>

              {eventResults.isPending && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <EventCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {!eventResults.isPending && events.length === 0 && (
                <EmptyState icon={SearchIcon} title={en.empty.noResults(debouncedQuery)} />
              )}

              {!eventResults.isPending && events.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="people">
          <EmptyState icon={PeopleIcon} title={en.search.peopleComingSoon} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
