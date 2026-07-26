import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/features/events/services/eventService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(eventId),
    queryFn: () => eventService.getById(eventId),
    enabled: Boolean(eventId),
  });
}
