import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import type { PaginatedResponse } from '@/types/api.types';
import type {
  Subscription,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@/types/payment.types';

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
}

export const paymentService = {
  listSubscriptions: () =>
    apiClient
      .get<{ data: Subscription[] }>(API_ENDPOINTS.payments.subscriptions)
      .then((r) => r.data.data),

  listTransactions: (filters: TransactionFilters = {}) =>
    apiClient
      .get<PaginatedResponse<Transaction>>(API_ENDPOINTS.payments.transactions, {
        params: filters,
      })
      .then((r) => r.data),

  cancelSubscription: (subscriptionId: string) =>
    apiClient
      .delete<{ cancelAtPeriodEnd: boolean; accessUntil: string }>(
        API_ENDPOINTS.payments.cancelSubscription(subscriptionId),
      )
      .then((r) => r.data),
};
