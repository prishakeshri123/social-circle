import { Link } from 'react-router-dom';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { formatDate, formatTime } from '@/shared/utils/formatDate';
import { useMyUpcomingEvents } from '@/features/events/hooks/useMyUpcomingEvents';

export function MemberUpcomingEvents() {
  const { data: events, isPending } = useMyUpcomingEvents(4);

  return (
    <section aria-labelledby="my-upcoming-events-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="my-upcoming-events-heading" className="text-lg font-semibold text-text-primary">
          {en.home.upcomingEventsTitle}
        </h2>
        <Link
          to={ROUTES.myEvents}
          className="text-sm font-medium text-primary-600 transition-colors duration-fast hover:text-primary-700"
        >
          {en.home.seeAllCta}
        </Link>
      </div>

      <Card className="divide-y divide-border p-0">
        {isPending &&
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="size-14 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}

        {!isPending && events.length === 0 && <EmptyState title={en.empty.noEvents} />}

        {!isPending &&
          events.map((event) => (
            <div key={event.id} className="flex items-center gap-4 p-4">
              <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  {formatDate(event.startAt, 'MMM')}
                </span>
                <span className="text-lg font-bold leading-none">
                  {formatDate(event.startAt, 'd')}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-primary">{event.title}</p>
                <p className="truncate text-xs text-text-secondary">
                  {event.club.name} &middot; {formatTime(event.startAt)}
                </p>
                <p className="text-xs text-text-muted">
                  {en.events.goingCount(event.rsvpCounts.going)}
                </p>
              </div>

              <Button
                asChild
                size="sm"
                variant={event.currentUserRsvp === 'going' ? 'outline' : 'default'}
                className="shrink-0"
              >
                <Link to={ROUTES.clubEventDetail(event.club.slug, event.id)}>
                  {event.currentUserRsvp === 'going' ? en.home.viewDetailsCta : en.home.imGoingCta}
                </Link>
              </Button>
            </div>
          ))}
      </Card>
    </section>
  );
}
