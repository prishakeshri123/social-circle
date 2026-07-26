import type MockAdapter from 'axios-mock-adapter';
import { nanoid } from 'nanoid';
import type { Club, ClubFilters, ClubMembership, MyClub } from '@/types/club.types';
import type { PaginatedResponse } from '@/types/api.types';
import type { User } from '@/types/user.types';
import { en } from '@/shared/constants/locales/en';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_TABLE } from '@/shared/constants/app.constants';
import { userIdFromToken, mockUsers } from '@/mock/handlers/authHandlers';
import seedClubs from '@/mock/data/clubs.json';
import seedMemberships from '@/mock/data/memberships.json';

const e = en.errors;

const clubs: Club[] = [...(seedClubs as Club[])];
const memberships: ClubMembership[] = [...(seedMemberships as ClubMembership[])];

// A small, fixed set of "online" members for the mock Members tab presence
// indicator — stable across requests instead of re-randomising each call.
const ONLINE_USER_IDS = new Set(['usr_mod01', 'usr_member01', 'usr_member03']);

interface MembershipWithUser extends ClubMembership {
  user: User;
  isOnline: boolean;
}

function withUser(membership: ClubMembership): MembershipWithUser | null {
  const user = mockUsers.find((u) => u.id === membership.userId);
  if (!user) return null;
  return { ...membership, user, isOnline: ONLINE_USER_IDS.has(user.id) };
}

function extractUserId(headers: unknown): string | null {
  const authHeader =
    headers && typeof headers === 'object' && 'Authorization' in headers
      ? (headers as Record<string, string>).Authorization
      : undefined;
  const token = authHeader?.replace(/^Bearer\s+/, '');
  return userIdFromToken(token);
}

function sortClubs(list: Club[], sort: string | undefined): Club[] {
  const sorted = [...list];
  if (sort === 'newest') {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'most_members') {
    sorted.sort((a, b) => b.memberCount - a.memberCount);
  } else {
    // "recommended": featured clubs first, then by member count
    sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.memberCount - a.memberCount);
  }
  return sorted;
}

function handleList(params: Record<string, string> | undefined): [number, unknown] {
  const filters = (params ?? {}) as ClubFilters & Record<string, string>;
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || PAGE_SIZE_DEFAULT;

  let results = clubs.filter((c) => c.status === 'live');

  if (filters.category) {
    results = results.filter((c) => c.category === filters.category);
  }
  if (filters.type) {
    results = results.filter((c) => c.type === filters.type);
  }
  if (filters.city) {
    results = results.filter((c) => c.city?.toLowerCase() === String(filters.city).toLowerCase());
  }
  if (filters.search) {
    const query = String(filters.search).toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.tagline?.toLowerCase().includes(query) ||
        c.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  results = sortClubs(results, filters.sort);

  const total = results.length;
  const start = (page - 1) * limit;
  const pageItems = results.slice(start, start + limit);

  const response: PaginatedResponse<Club> = {
    data: pageItems,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNextPage: start + limit < total,
      hasPreviousPage: page > 1,
    },
  };

  return [200, response];
}

function handleDetail(slug: string): [number, unknown] {
  const club = clubs.find((c) => c.slug === slug);
  if (!club) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  return [200, club];
}

function handleJoin(id: string, headers: unknown): [number, unknown] {
  const club = clubs.find((c) => c.id === id);
  if (!club) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }

  const userId = extractUserId(headers);
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }

  const existing = memberships.find((m) => m.clubId === id && m.userId === userId);
  if (existing) {
    return [200, existing];
  }

  if (club.type === 'paid') {
    return [402, { checkoutUrl: `/checkout/${club.pricingPlans?.[0]?.id ?? ''}` }];
  }

  const status = club.membershipApproval === 'manual' ? 'pending_approval' : 'active';
  const membership: ClubMembership = {
    id: `mem_${nanoid(10)}`,
    clubId: id,
    userId,
    role: 'member',
    status,
    joinedAt: new Date().toISOString(),
  };
  memberships.push(membership);

  if (status === 'active') {
    club.memberCount += 1;
  }

  return [200, membership];
}

function paginate<T>(list: T[], page: number, limit: number): PaginatedResponse<T> {
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

function handleListMembers(
  clubId: string,
  params: Record<string, string> | undefined,
): [number, unknown] {
  const filters = params ?? {};
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || PAGE_SIZE_TABLE;

  let results = memberships
    .filter((m) => m.clubId === clubId)
    .map(withUser)
    .filter((m): m is MembershipWithUser => m !== null);

  if (filters.role) {
    results = results.filter((m) => m.role === filters.role);
  }
  if (filters.status) {
    results = results.filter((m) => m.status === filters.status);
  }
  if (filters.search) {
    const query = filters.search.toLowerCase();
    results = results.filter(
      (m) =>
        m.user.fullName.toLowerCase().includes(query) ||
        m.user.username.toLowerCase().includes(query),
    );
  }

  return [200, paginate(results, page, limit)];
}

function handleMyClubs(userId: string | null): [number, unknown] {
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }
  const data: MyClub[] = memberships
    .filter((m) => m.userId === userId && m.status === 'active')
    .map((m) => {
      const club = clubs.find((c) => c.id === m.clubId);
      return club ? { ...club, myRole: m.role } : null;
    })
    .filter((c): c is MyClub => c !== null);

  return [200, { data }];
}

function handleMyMembership(clubId: string, userId: string | null): [number, unknown] {
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }
  const membership = memberships.find((m) => m.clubId === clubId && m.userId === userId);
  if (!membership) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  return [200, { data: membership }];
}

// Member management (role changes, removal, approval, blocking) all happen
// in the separate Admin Dashboard -- this app only reads memberships.
export function registerClubHandlers(mock: MockAdapter): void {
  mock.onGet('/me/clubs').reply((config) => handleMyClubs(extractUserId(config.headers)));
  mock.onGet('/clubs').reply((config) => handleList(config.params));
  mock.onGet(/^\/clubs\/[^/]+$/).reply((config) => {
    const slug = config.url?.split('/').pop() ?? '';
    return handleDetail(slug);
  });
  mock.onPost(/^\/clubs\/[^/]+\/join$/).reply((config) => {
    const id = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleJoin(id, config.headers);
  });

  mock.onGet(/^\/clubs\/[^/]+\/members\/me$/).reply((config) => {
    const segments = (config.url ?? '').split('/').filter(Boolean);
    return handleMyMembership(segments[1] ?? '', extractUserId(config.headers));
  });

  mock.onGet(/^\/clubs\/[^/]+\/members$/).reply((config) => {
    const clubId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleListMembers(clubId, config.params);
  });
}

export { ONLINE_USER_IDS };
