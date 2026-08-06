import type MockAdapter from 'axios-mock-adapter';
import { nanoid } from 'nanoid';
import type { Notification } from '@/types/user.types';
import { PAGE_SIZE_NOTIFICATIONS } from '@/shared/constants/app.constants';
import { userIdFromToken } from '@/mock/handlers/authHandlers';
import seedNotifications from '@/mock/data/notifications.json';

const notifications: Notification[] = [...(seedNotifications as Notification[])];

// Lets other mock handlers (e.g. chatHandlers's @mention detection) create a
// notification without duplicating this module's in-memory store.
export function pushNotification(input: Omit<Notification, 'id' | 'read' | 'createdAt'>): void {
  notifications.unshift({
    ...input,
    id: `ntf_${nanoid(10)}`,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

function extractUserId(headers: unknown): string | null {
  const authHeader =
    headers && typeof headers === 'object' && 'Authorization' in headers
      ? (headers as Record<string, string>).Authorization
      : undefined;
  const token = authHeader?.replace(/^Bearer\s+/, '');
  return userIdFromToken(token);
}

function handleList(
  userId: string | null,
  params: Record<string, string> | undefined,
): [number, unknown] {
  if (!userId) return [200, { data: [] }];
  const limit = Number(params?.limit) || PAGE_SIZE_NOTIFICATIONS;
  const data = notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
  return [200, { data }];
}

export function registerNotificationHandlers(mock: MockAdapter): void {
  mock
    .onGet('/me/notifications')
    .reply((config) => handleList(extractUserId(config.headers), config.params));
}
