import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
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
      .get<PaginatedResponse<EventWithClub>>(API_ENDPOINTS.events.list, { params: filters })
      .then((r) => r.data),

  listByClub: (clubId: string, filters: Omit<EventFilters, 'clubId'> = {}) =>
    apiClient
      .get<PaginatedResponse<EventWithClub>>(API_ENDPOINTS.clubs.events(clubId), {
        params: filters,
      })
      .then((r) => r.data),

  getById: (eventId: string) =>
    apiClient.get<EventWithClub>(API_ENDPOINTS.events.byId(eventId)).then((r) => r.data),

  rsvp: (eventId: string, response: RsvpStatus) =>
    apiClient
      .post<{ rsvpCounts: Event['rsvpCounts']; currentUserRsvp: RsvpStatus }>(
        API_ENDPOINTS.events.rsvp(eventId),
        {
          response,
        },
      )
      .then((r) => r.data),
};
