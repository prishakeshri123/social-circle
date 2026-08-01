import type MockAdapter from 'axios-mock-adapter';
import type { Event, EventClubSummary, EventWithClub, RsvpStatus } from '@/types/event.types';
import type { Club } from '@/types/club.types';
import type { PaginatedResponse } from '@/types/api.types';
import { en } from '@/shared/constants/locales/en';
import { PAGE_SIZE_DEFAULT } from '@/shared/constants/app.constants';
import { userIdFromToken } from '@/mock/handlers/authHandlers';
import seedEvents from '@/mock/data/events.json';
import seedClubs from '@/mock/data/clubs.json';

const e = en.errors;

const events: Event[] = [...(seedEvents as Event[])];
const clubs: Club[] = seedClubs as Club[];
const rsvpsByUser = new Map<string, RsvpStatus>();

function clubSummary(clubId: string): EventClubSummary {
  const club = clubs.find((c) => c.id === clubId);
  return {
    id: clubId,
    slug: club?.slug ?? '',
    name: club?.name ?? '',
    category: club?.category ?? '',
    logoUrl: club?.logoUrl,
  };
}

function withClub(event: Event): EventWithClub {
  return { ...event, club: clubSummary(event.clubId) };
}

function parseBody<T>(data: unknown): T {
  return (typeof data === 'string' ? JSON.parse(data) : data) as T;
}

function extractUserId(headers: unknown): string | null {
  const authHeader =
    headers && typeof headers === 'object' && 'Authorization' in headers
      ? (headers as Record<string, string>).Authorization
      : undefined;
  const token = authHeader?.replace(/^Bearer\s+/, '');
  return userIdFromToken(token);
}

function withCurrentUserRsvp(event: EventWithClub, userId: string | null): EventWithClub {
  const key = `${event.id}:${userId ?? ''}`;
  return { ...event, currentUserRsvp: userId ? (rsvpsByUser.get(key) ?? null) : null };
}

function isUpcoming(event: Event): boolean {
  return event.status === 'published' && new Date(event.startAt).getTime() >= Date.now();
}

function sortByStartAt(list: Event[]): Event[] {
  return [...list].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

function paginate(
  list: EventWithClub[],
  page: number,
  limit: number,
): PaginatedResponse<EventWithClub> {
  const total = list.length;
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNextPage: start + limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

function handleList(
  params: Record<string, string> | undefined,
  userId: string | null,
): [number, unknown] {
  const filters = params ?? {};
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || PAGE_SIZE_DEFAULT;

  let results = events.filter(
    (ev) => ev.visibility === 'public' || ev.visibility === 'all_members',
  );

  if (filters.clubId) {
    results = results.filter((ev) => ev.clubId === filters.clubId);
  }
  if (String(filters.upcoming) === 'true') {
    results = results.filter(isUpcoming);
  }
  if (filters.search) {
    const query = filters.search.toLowerCase();
    results = results.filter(
      (ev) =>
        ev.title.toLowerCase().includes(query) || ev.description.toLowerCase().includes(query),
    );
  }

  const withClubs = sortByStartAt(results).map((ev) => withCurrentUserRsvp(withClub(ev), userId));

  return [200, paginate(withClubs, page, limit)];
}

function handleByClub(
  clubId: string,
  params: Record<string, string> | undefined,
  userId: string | null,
): [number, unknown] {
  const filters = params ?? {};
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || PAGE_SIZE_DEFAULT;

  let results = events.filter((ev) => ev.clubId === clubId);
  if (filters.status === 'upcoming') {
    results = results.filter(isUpcoming);
  } else if (filters.status === 'past') {
    results = results.filter((ev) => ev.status === 'concluded');
  } else if (filters.status === 'cancelled') {
    results = results.filter((ev) => ev.status === 'cancelled');
  }

  const withClubs = sortByStartAt(results).map((ev) => withCurrentUserRsvp(withClub(ev), userId));

  return [200, paginate(withClubs, page, limit)];
}

function handleDetail(eventId: string, userId: string | null): [number, unknown] {
  const event = events.find((ev) => ev.id === eventId);
  if (!event) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  return [200, withCurrentUserRsvp(withClub(event), userId)];
}

function handleRsvp(eventId: string, data: unknown, userId: string | null): [number, unknown] {
  const event = events.find((ev) => ev.id === eventId);
  if (!event) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }

  const { response } = parseBody<{ response: RsvpStatus }>(data);
  const key = `${eventId}:${userId}`;
  const previous = rsvpsByUser.get(key);

  if (previous && previous !== response) {
    event.rsvpCounts[previous] = Math.max(0, event.rsvpCounts[previous] - 1);
  }
  if (previous !== response) {
    event.rsvpCounts[response] += 1;
  }
  rsvpsByUser.set(key, response);

  return [200, { rsvpCounts: event.rsvpCounts, currentUserRsvp: response }];
}

export function registerEventHandlers(mock: MockAdapter): void {
  mock.onGet('/events').reply((config) => handleList(config.params, extractUserId(config.headers)));

  mock.onGet(/^\/clubs\/[^/]+\/events$/).reply((config) => {
    const clubId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleByClub(clubId, config.params, extractUserId(config.headers));
  });

  mock.onGet(/^\/events\/[^/]+$/).reply((config) => {
    const eventId = config.url?.split('/').pop() ?? '';
    return handleDetail(eventId, extractUserId(config.headers));
  });

  mock.onPost(/^\/events\/[^/]+\/rsvp$/).reply((config) => {
    const eventId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleRsvp(eventId, config.data, extractUserId(config.headers));
  });
}
