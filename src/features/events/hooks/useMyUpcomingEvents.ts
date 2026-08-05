import { useEventsFeed } from '@/features/events/hooks/useEventsFeed';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { PAGE_SIZE_DEFAULT } from '@/shared/constants/app.constants';

export function useMyUpcomingEvents(limit = PAGE_SIZE_DEFAULT) {
  const myClubsQuery = useMyClubs();
  const eventsQuery = useEventsFeed({ upcoming: true, limit: 50 });

  const myClubIds = new Set((myClubsQuery.data ?? []).map((c) => c.id));
  const events = (eventsQuery.data?.data ?? [])
    .filter((event) => myClubIds.has(event.clubId))
    .slice(0, limit);

  return { data: events, isPending: myClubsQuery.isPending || eventsQuery.isPending };
}
