import { en } from '@/shared/constants/locales/en';
import { useEventsFeed } from '@/features/events/hooks/useEventsFeed';
import { EventCard } from '@/features/events/components/EventCard';
import { EventCardSkeleton } from '@/features/events/components/EventCardSkeleton';

interface ClubEventsStripProps {
  clubId: string;
}

export function ClubEventsStrip({ clubId }: ClubEventsStripProps) {
  const { data, isPending } = useEventsFeed({ clubId, upcoming: true, limit: 3 });
  const events = data?.data ?? [];

  return (
    <section
      aria-labelledby="club-events-heading"
      className="space-y-3 rounded-2xl border border-border bg-surface p-6"
    >
      <h2 id="club-events-heading" className="text-lg font-semibold text-text-primary">
        {en.clubLanding.upcomingEventsTitle}
      </h2>

      {isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-hidden="true">
          {Array.from({ length: 2 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isPending && events.length === 0 && (
        <p className="rounded-xl border border-dashed border-border-strong bg-surface-raised px-4 py-6 text-center text-sm text-text-muted">
          {en.clubLanding.noUpcomingEvents}
        </p>
      )}

      {!isPending && events.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
