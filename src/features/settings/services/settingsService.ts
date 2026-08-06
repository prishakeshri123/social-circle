import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import type { NotificationPreferences, PrivacySettings, User } from '@/types/user.types';
import type { BillingAddress, SavedPaymentMethod } from '@/types/payment.types';

export interface AddPaymentMethodRequest {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const settingsService = {
  getNotificationPreferences: () =>
    apiClient
      .get<NotificationPreferences>(API_ENDPOINTS.users.notificationPreferences)
      .then((r) => r.data),

  updateNotificationPreferences: (patch: Partial<NotificationPreferences>) =>
    apiClient
      .patch<NotificationPreferences>(API_ENDPOINTS.users.notificationPreferences, patch)
      .then((r) => r.data),

  getPrivacy: () => apiClient.get<PrivacySettings>(API_ENDPOINTS.users.privacy).then((r) => r.data),

  updatePrivacy: (patch: Partial<PrivacySettings>) =>
    apiClient.patch<PrivacySettings>(API_ENDPOINTS.users.privacy, patch).then((r) => r.data),

  listPaymentMethods: () =>
    apiClient.get<SavedPaymentMethod[]>(API_ENDPOINTS.payments.paymentMethods).then((r) => r.data),

  addPaymentMethod: (payload: AddPaymentMethodRequest) =>
    apiClient
      .post<SavedPaymentMethod>(API_ENDPOINTS.payments.paymentMethods, payload)
      .then((r) => r.data),

  deletePaymentMethod: (id: string) =>
    apiClient
      .delete<SavedPaymentMethod[]>(API_ENDPOINTS.payments.paymentMethod(id))
      .then((r) => r.data),

  setDefaultPaymentMethod: (id: string) =>
    apiClient
      .patch<SavedPaymentMethod[]>(API_ENDPOINTS.payments.paymentMethod(id))
      .then((r) => r.data),

  getBillingAddress: () =>
    apiClient.get<BillingAddress | null>(API_ENDPOINTS.payments.billingAddress).then((r) => r.data),

  updateBillingAddress: (address: BillingAddress) =>
    apiClient
      .put<BillingAddress>(API_ENDPOINTS.payments.billingAddress, address)
      .then((r) => r.data),

  changeEmail: (email: string) =>
    apiClient
      .post<{ message: string; maskedTarget: string }>(API_ENDPOINTS.account.changeEmail, {
        email,
      })
      .then((r) => r.data),

  verifyEmailChange: (otp: string) =>
    apiClient.post<User>(API_ENDPOINTS.account.verifyEmailChange, { otp }).then((r) => r.data),

  changePhone: (phone: string) =>
    apiClient
      .post<{ message: string; maskedTarget: string }>(API_ENDPOINTS.account.changePhone, {
        phone,
      })
      .then((r) => r.data),

  verifyPhoneChange: (otp: string) =>
    apiClient.post<User>(API_ENDPOINTS.account.verifyPhoneChange, { otp }).then((r) => r.data),

  changePassword: (payload: ChangePasswordRequest) =>
    apiClient.post(API_ENDPOINTS.account.changePassword, payload).then((r) => r.data),

  deleteAccount: () => apiClient.post(API_ENDPOINTS.account.deleteAccount).then((r) => r.data),
};
