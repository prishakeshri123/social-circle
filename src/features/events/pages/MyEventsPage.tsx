import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { SEARCH_DEBOUNCE_MS } from '@/shared/constants/app.constants';
import { formatDate, formatTime } from '@/shared/utils/formatDate';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useMyEvents } from '@/features/events/hooks/useMyEvents';
import { EventCard } from '@/features/events/components/EventCard';
import { EventCardSkeleton } from '@/features/events/components/EventCardSkeleton';

type StatusFilter = 'upcoming' | 'past' | 'cancelled';
type SortMode = 'date' | 'title';

const EMPTY_MESSAGES: Record<StatusFilter, string> = {
  upcoming: en.empty.noEvents,
  past: en.myEvents.emptyPast,
  cancelled: en.myEvents.emptyCancelled,
};

export function MyEventsPage() {
  const [status, setStatus] = useState<StatusFilter>('upcoming');
  const [sort, setSort] = useState<SortMode>('date');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();
  const eventsQuery = useMyEvents({ status, search: debouncedSearch, sort });

  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  const events = eventsQuery.data;
  const nextEvent =
    status === 'upcoming' && events.length > 0
      ? [...events].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0]
      : undefined;

  return (
    <div className="flex items-start">
      <Helmet>
        <title>{en.myEvents.title} | Social Circle</title>
      </Helmet>

      <Sidebar
        unreadChatsCount={unreadChatsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 md:flex"
      />

      <div className="auth-neon min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{en.myEvents.title}</h1>
          <p className="mt-1 text-sm text-text-secondary">{en.myEvents.subtitle}</p>
        </div>

        {nextEvent && (
          <section className="relative isolate overflow-hidden rounded-2xl border border-primary-100 bg-primary-50 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {nextEvent.coverImageUrl && (
                  <img
                    src={nextEvent.coverImageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="hidden size-16 shrink-0 rounded-xl object-cover sm:block"
                  />
                )}
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide gradient-text">
                    <Sparkles className="size-3.5 text-info-500" aria-hidden="true" />
                    {en.myEvents.nextUpLabel}
                  </p>
                  <h2 className="mt-1 truncate text-lg font-bold text-text-primary">
                    {nextEvent.title}
                  </h2>
                  <p className="mt-1 truncate text-sm text-text-secondary">
                    {nextEvent.club.name} · {formatDate(nextEvent.startAt, 'EEE, MMM d')} ·{' '}
                    {formatTime(nextEvent.startAt)}
                  </p>
                </div>
              </div>
              <Button asChild className="shrink-0">
                <Link to={ROUTES.eventDetail(nextEvent.club.slug, nextEvent.id)}>
                  {en.myEvents.viewDetailsCta}
                </Link>
              </Button>
            </div>
          </section>
        )}

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <TabsList>
              <TabsTrigger value="upcoming">{en.events.filterUpcoming}</TabsTrigger>
              <TabsTrigger value="past">{en.events.filterPast}</TabsTrigger>
              <TabsTrigger value="cancelled">{en.events.filterCancelled}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={en.myEvents.searchPlaceholder}
                className="pl-9"
              />
            </div>

            <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
              <SelectTrigger className="w-36 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{en.events.sortDate}</SelectItem>
                <SelectItem value="title">{en.events.sortTitle}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!eventsQuery.isPending && events.length > 0 && (
          <p className="text-sm text-text-secondary">{en.myEvents.resultsCount(events.length)}</p>
        )}

        {eventsQuery.isPending && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!eventsQuery.isPending && events.length === 0 && (
          <EmptyState icon={Search} title={EMPTY_MESSAGES[status]} />
        )}

        {!eventsQuery.isPending && events.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
