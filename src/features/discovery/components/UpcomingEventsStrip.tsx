import { Link } from 'react-router-dom';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { useEventsFeed } from '@/features/events/hooks/useEventsFeed';
import { EventCard } from '@/features/events/components/EventCard';
import { EventCardSkeleton } from '@/features/events/components/EventCardSkeleton';

export function UpcomingEventsStrip() {
  const { data, isPending, isError } = useEventsFeed({ upcoming: true, limit: 8 });
  const events = data?.data ?? [];

  if (isError || (!isPending && events.length === 0)) return null;

  return (
    <section aria-labelledby="upcoming-events-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="upcoming-events-heading" className="text-lg font-semibold text-text-primary">
          {en.discovery.upcomingEventsTitle}
        </h2>
        <Link
          to={ROUTES.search}
          className="text-sm font-medium text-primary-600 transition-colors duration-fast hover:text-primary-700"
        >
          {en.discovery.viewAllEventsCta} &rarr;
        </Link>
      </div>

      <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2 pr-4 [mask-image:linear-gradient(to_right,black_calc(100%_-_32px),transparent)]">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-64 shrink-0 snap-start">
                <EventCardSkeleton />
              </div>
            ))
          : events.map((event) => (
              <div key={event.id} className="w-64 shrink-0 snap-start">
                <EventCard event={event} />
              </div>
            ))}
      </div>
    </section>
  );
}
