import { apiClient } from '@/services/apiClient';
import type { PaginatedResponse } from '@/types/api.types';
import type { Event, EventWithClub, RsvpStatus } from '@/types/event.types';

export interface EventFilters {
  clubId?: string;
  upcoming?: boolean;
  status?: 'upcoming' | 'past' | 'cancelled';
  search?: string;
  page?: number;
  limit?: number;
}

export const eventService = {
  list: (filters: EventFilters = {}) =>
    apiClient
      .get<PaginatedResponse<EventWithClub>>('/events', { params: filters })
      .then((r) => r.data),

  listByClub: (clubId: string, filters: Omit<EventFilters, 'clubId'> = {}) =>
    apiClient
      .get<PaginatedResponse<EventWithClub>>(`/clubs/${clubId}/events`, { params: filters })
      .then((r) => r.data),

  getById: (eventId: string) =>
    apiClient.get<EventWithClub>(`/events/${eventId}`).then((r) => r.data),

  rsvp: (eventId: string, response: RsvpStatus) =>
    apiClient
      .post<{ rsvpCounts: Event['rsvpCounts']; currentUserRsvp: RsvpStatus }>(
        `/events/${eventId}/rsvp`,
        {
          response,
        },
      )
      .then((r) => r.data),
};
