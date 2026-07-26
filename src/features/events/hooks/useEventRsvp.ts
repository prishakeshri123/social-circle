import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/features/events/services/eventService';
import { queryKeys } from '@/shared/constants/queryKeys';
import type { EventWithClub, RsvpStatus } from '@/types/event.types';

export function useEventRsvp(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (response: RsvpStatus) => eventService.rsvp(eventId, response),
    onSuccess: (result) => {
      queryClient.setQueryData<EventWithClub | undefined>(
        queryKeys.events.detail(eventId),
        (event) =>
          event
            ? { ...event, rsvpCounts: result.rsvpCounts, currentUserRsvp: result.currentUserRsvp }
            : event,
      );
    },
  });
}
