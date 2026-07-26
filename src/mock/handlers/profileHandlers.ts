import type MockAdapter from 'axios-mock-adapter';
import type { User } from '@/types/user.types';
import { en } from '@/shared/constants/locales/en';
import { mockUsers, userIdFromToken } from '@/mock/handlers/authHandlers';

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

function handleUpdateMe(data: unknown, headers: unknown): [number, unknown] {
  const userId = extractUserId(headers);
  const index = mockUsers.findIndex((u) => u.id === userId);
  if (index === -1) {
    return [401, { code: 'UNAUTHORIZED', message: en.errors.unauthorized }];
  }

  const patch = parseBody<Partial<User>>(data);
  const explicitComplete =
    typeof patch.profileComplete === 'boolean' ? patch.profileComplete : undefined;
  const updated: User = {
    ...mockUsers[index],
    ...patch,
    lastActiveAt: new Date().toISOString(),
  };
  updated.profileComplete =
    explicitComplete ?? (Boolean(updated.fullName) && updated.interests.length > 0);
  mockUsers[index] = updated;

  return [200, updated];
}

function handleGetById(userId: string): [number, unknown] {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    return [404, { code: 'NOT_FOUND', message: en.errors.notFound }];
  }
  return [200, user];
}

export function registerProfileHandlers(mock: MockAdapter): void {
  mock.onPatch('/users/me').reply((config) => handleUpdateMe(config.data, config.headers));
  mock.onGet(/^\/users\/[^/]+$/).reply((config) => {
    const userId = config.url?.split('/').pop() ?? '';
    return handleGetById(userId);
  });
}
