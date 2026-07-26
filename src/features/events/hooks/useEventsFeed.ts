import { useQuery } from '@tanstack/react-query';
import { eventService, type EventFilters } from '@/features/events/services/eventService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useEventsFeed(filters: EventFilters = {}) {
  return useQuery({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => eventService.list(filters),
  });
}
