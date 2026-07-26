import type MockAdapter from 'axios-mock-adapter';
import type { Subscription, Transaction } from '@/types/payment.types';
import type { PaginatedResponse } from '@/types/api.types';
import { en } from '@/shared/constants/locales/en';
import { PAGE_SIZE_TABLE } from '@/shared/constants/app.constants';
import { userIdFromToken } from '@/mock/handlers/authHandlers';
import seedSubscriptions from '@/mock/data/subscriptions.json';
import seedTransactions from '@/mock/data/transactions.json';

const e = en.errors;

const subscriptions: Subscription[] = [...(seedSubscriptions as Subscription[])];
const transactions: Transaction[] = [...(seedTransactions as Transaction[])];

function extractUserId(headers: unknown): string | null {
  const authHeader =
    headers && typeof headers === 'object' && 'Authorization' in headers
      ? (headers as Record<string, string>).Authorization
      : undefined;
  const token = authHeader?.replace(/^Bearer\s+/, '');
  return userIdFromToken(token);
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

function handleListSubscriptions(userId: string | null): [number, unknown] {
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }
  return [200, { data: subscriptions.filter((s) => s.userId === userId) }];
}

function handleListTransactions(
  userId: string | null,
  params: Record<string, string> | undefined,
): [number, unknown] {
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }
  const filters = params ?? {};
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || PAGE_SIZE_TABLE;

  let results = transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (filters.type) {
    results = results.filter((t) => t.type === filters.type);
  }
  if (filters.status) {
    results = results.filter((t) => t.status === filters.status);
  }

  return [200, paginate(results, page, limit)];
}

function handleCancelSubscription(
  subscriptionId: string,
  userId: string | null,
): [number, unknown] {
  const subscription = subscriptions.find((s) => s.id === subscriptionId);
  if (!subscription) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  if (subscription.userId !== userId) {
    return [403, { code: 'FORBIDDEN', message: e.unauthorized }];
  }
  subscription.cancelAtPeriodEnd = true;
  return [200, { data: { cancelAtPeriodEnd: true, accessUntil: subscription.currentPeriodEnd } }];
}

export function registerPaymentHandlers(mock: MockAdapter): void {
  mock
    .onGet('/users/me/subscriptions')
    .reply((config) => handleListSubscriptions(extractUserId(config.headers)));

  mock
    .onGet('/users/me/transactions')
    .reply((config) => handleListTransactions(extractUserId(config.headers), config.params));

  mock.onDelete(/^\/subscriptions\/[^/]+$/).reply((config) => {
    const subscriptionId = config.url?.split('/').pop() ?? '';
    return handleCancelSubscription(subscriptionId, extractUserId(config.headers));
  });
}
