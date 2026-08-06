import { useEventsFeed } from '@/features/events/hooks/useEventsFeed';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { MY_CLUBS_EVENTS_SCAN_LIMIT } from '@/shared/constants/app.constants';

export interface UseMyEventsParams {
  status: 'upcoming' | 'past' | 'cancelled';
  search?: string;
  sort?: 'date' | 'title';
}

export function useMyEvents({ status, search, sort = 'date' }: UseMyEventsParams) {
  const myClubsQuery = useMyClubs();
  const eventsQuery = useEventsFeed({ status, search, limit: MY_CLUBS_EVENTS_SCAN_LIMIT });

  const myClubIds = new Set((myClubsQuery.data ?? []).map((c) => c.id));
  const events = (eventsQuery.data?.data ?? []).filter((event) => myClubIds.has(event.clubId));

  if (sort === 'title') {
    events.sort((a, b) => a.title.localeCompare(b.title));
  }

  return { data: events, isPending: myClubsQuery.isPending || eventsQuery.isPending };
}
