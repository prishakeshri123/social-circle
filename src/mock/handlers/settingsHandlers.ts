import type MockAdapter from 'axios-mock-adapter';
import { nanoid } from 'nanoid';
import { en } from '@/shared/constants/locales/en';
import { OTP_DEV_VALUE } from '@/shared/constants/app.constants';
import {
  mockUsers,
  userIdFromToken,
  verifyPassword,
  setPassword,
} from '@/mock/handlers/authHandlers';
import type { NotificationPreferences, PrivacySettings } from '@/types/user.types';
import type { BillingAddress, CardBrand, SavedPaymentMethod } from '@/types/payment.types';

const e = en.errors;

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

function unauthorized(): [number, unknown] {
  return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
}

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  emailEnabled: true,
  pushEnabled: true,
  eventReminders: true,
  chatMentions: true,
  clubUpdates: true,
  paymentAlerts: true,
};

const DEFAULT_PRIVACY: PrivacySettings = {
  profileVisibility: 'members_only',
  showInDiscovery: true,
  allowDmsFrom: 'club_members',
};

const notificationPrefsByUser = new Map<string, NotificationPreferences>();
const privacyByUser = new Map<string, PrivacySettings>();
const paymentMethodsByUser = new Map<string, SavedPaymentMethod[]>();
const billingAddressByUser = new Map<string, BillingAddress>();
const pendingEmailByUser = new Map<string, string>();
const pendingPhoneByUser = new Map<string, string>();

// ── Notification preferences ───────────────────────────────────
function handleGetNotificationPrefs(userId: string | null): [number, unknown] {
  if (!userId) return unauthorized();
  return [200, notificationPrefsByUser.get(userId) ?? DEFAULT_NOTIFICATION_PREFS];
}

function handleUpdateNotificationPrefs(userId: string | null, data: unknown): [number, unknown] {
  if (!userId) return unauthorized();
  const patch = parseBody<Partial<NotificationPreferences>>(data);
  const updated = {
    ...(notificationPrefsByUser.get(userId) ?? DEFAULT_NOTIFICATION_PREFS),
    ...patch,
  };
  notificationPrefsByUser.set(userId, updated);
  return [200, updated];
}

// ── Privacy ──────────────────────────────────────────────────
function handleGetPrivacy(userId: string | null): [number, unknown] {
  if (!userId) return unauthorized();
  return [200, privacyByUser.get(userId) ?? DEFAULT_PRIVACY];
}

function handleUpdatePrivacy(userId: string | null, data: unknown): [number, unknown] {
  if (!userId) return unauthorized();
  const patch = parseBody<Partial<PrivacySettings>>(data);
  const updated = { ...(privacyByUser.get(userId) ?? DEFAULT_PRIVACY), ...patch };
  privacyByUser.set(userId, updated);
  return [200, updated];
}

// ── Payment methods ──────────────────────────────────────────
function detectBrand(digits: string): CardBrand {
  if (digits.startsWith('4')) return 'visa';
  if (digits.startsWith('5')) return 'mastercard';
  if (digits.startsWith('3')) return 'amex';
  return 'rupay';
}

interface AddPaymentMethodRequest {
  cardNumber: string;
  cardExpiry: string;
}

function handleListPaymentMethods(userId: string | null): [number, unknown] {
  if (!userId) return unauthorized();
  return [200, paymentMethodsByUser.get(userId) ?? []];
}

function handleAddPaymentMethod(userId: string | null, data: unknown): [number, unknown] {
  if (!userId) return unauthorized();
  const { cardNumber, cardExpiry } = parseBody<AddPaymentMethodRequest>(data);
  const digits = cardNumber.replace(/\s+/g, '');
  const [monthStr, yearStr] = cardExpiry.split('/');
  const existing = paymentMethodsByUser.get(userId) ?? [];
  const method: SavedPaymentMethod = {
    id: `pm_${nanoid(10)}`,
    userId,
    brand: detectBrand(digits),
    last4: digits.slice(-4),
    expiryMonth: Number(monthStr),
    expiryYear: 2000 + Number(yearStr),
    isDefault: existing.length === 0,
    createdAt: new Date().toISOString(),
  };
  paymentMethodsByUser.set(userId, [...existing, method]);
  return [201, method];
}

function handleDeletePaymentMethod(userId: string | null, methodId: string): [number, unknown] {
  if (!userId) return unauthorized();
  const existing = paymentMethodsByUser.get(userId) ?? [];
  const removed = existing.find((m) => m.id === methodId);
  const remaining = existing.filter((m) => m.id !== methodId);
  if (removed?.isDefault && remaining.length > 0) {
    remaining[0] = { ...remaining[0], isDefault: true };
  }
  paymentMethodsByUser.set(userId, remaining);
  return [200, remaining];
}

function handleSetDefaultPaymentMethod(userId: string | null, methodId: string): [number, unknown] {
  if (!userId) return unauthorized();
  const existing = paymentMethodsByUser.get(userId) ?? [];
  const updated = existing.map((m) => ({ ...m, isDefault: m.id === methodId }));
  paymentMethodsByUser.set(userId, updated);
  return [200, updated];
}

// ── Billing address ────────────────────────────────────────────
function handleGetBillingAddress(userId: string | null): [number, unknown] {
  if (!userId) return unauthorized();
  return [200, billingAddressByUser.get(userId) ?? null];
}

function handleUpdateBillingAddress(userId: string | null, data: unknown): [number, unknown] {
  if (!userId) return unauthorized();
  const address = parseBody<BillingAddress>(data);
  billingAddressByUser.set(userId, address);
  return [200, address];
}

// ── Account: email / phone / password / linked providers / delete ──
function handleChangeEmail(userId: string | null, data: unknown): [number, unknown] {
  if (!userId) return unauthorized();
  const { email } = parseBody<{ email: string }>(data);
  pendingEmailByUser.set(userId, email);
  return [200, { message: en.auth.otpSubtitle, maskedTarget: email }];
}

function handleVerifyEmailChange(userId: string | null, data: unknown): [number, unknown] {
  if (!userId) return unauthorized();
  const { otp } = parseBody<{ otp: string }>(data);
  if (otp !== OTP_DEV_VALUE) return [400, { code: 'OTP_INVALID', message: e.otpInvalid }];
  const pending = pendingEmailByUser.get(userId);
  if (!pending) return [400, { code: 'NO_PENDING_CHANGE', message: e.otpExpired }];
  const index = mockUsers.findIndex((u) => u.id === userId);
  if (index === -1) return unauthorized();
  mockUsers[index] = { ...mockUsers[index], email: pending, emailVerified: true };
  pendingEmailByUser.delete(userId);
  return [200, mockUsers[index]];
}

function handleChangePhone(userId: string | null, data: unknown): [number, unknown] {
  if (!userId) return unauthorized();
  const { phone } = parseBody<{ phone: string }>(data);
  pendingPhoneByUser.set(userId, phone);
  return [200, { message: en.auth.otpSubtitle, maskedTarget: phone }];
}

function handleVerifyPhoneChange(userId: string | null, data: unknown): [number, unknown] {
  if (!userId) return unauthorized();
  const { otp } = parseBody<{ otp: string }>(data);
  if (otp !== OTP_DEV_VALUE) return [400, { code: 'OTP_INVALID', message: e.otpInvalid }];
  const pending = pendingPhoneByUser.get(userId);
  if (!pending) return [400, { code: 'NO_PENDING_CHANGE', message: e.otpExpired }];
  const index = mockUsers.findIndex((u) => u.id === userId);
  if (index === -1) return unauthorized();
  mockUsers[index] = { ...mockUsers[index], phone: pending, phoneVerified: true };
  pendingPhoneByUser.delete(userId);
  return [200, mockUsers[index]];
}

function handleChangePassword(userId: string | null, data: unknown): [number, unknown] {
  if (!userId) return unauthorized();
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return unauthorized();
  const { currentPassword, newPassword } = parseBody<{
    currentPassword: string;
    newPassword: string;
  }>(data);
  if (!verifyPassword(user.email, currentPassword)) {
    return [400, { code: 'INVALID_PASSWORD', message: e.currentPasswordIncorrect }];
  }
  setPassword(user.email, newPassword);
  return [200, { success: true }];
}

function handleDeleteAccount(userId: string | null): [number, unknown] {
  if (!userId) return unauthorized();
  const index = mockUsers.findIndex((u) => u.id === userId);
  if (index === -1) return unauthorized();
  mockUsers[index] = { ...mockUsers[index], status: 'suspended' };
  return [200, { success: true }];
}

export function registerSettingsHandlers(mock: MockAdapter): void {
  mock
    .onGet('/users/me/notification-preferences')
    .reply((config) => handleGetNotificationPrefs(extractUserId(config.headers)));
  mock
    .onPatch('/users/me/notification-preferences')
    .reply((config) => handleUpdateNotificationPrefs(extractUserId(config.headers), config.data));

  mock
    .onGet('/users/me/privacy')
    .reply((config) => handleGetPrivacy(extractUserId(config.headers)));
  mock
    .onPatch('/users/me/privacy')
    .reply((config) => handleUpdatePrivacy(extractUserId(config.headers), config.data));

  mock
    .onGet('/users/me/payment-methods')
    .reply((config) => handleListPaymentMethods(extractUserId(config.headers)));
  mock
    .onPost('/users/me/payment-methods')
    .reply((config) => handleAddPaymentMethod(extractUserId(config.headers), config.data));
  mock.onDelete(/^\/users\/me\/payment-methods\/.+$/).reply((config) => {
    const id = config.url?.split('/').pop() ?? '';
    return handleDeletePaymentMethod(extractUserId(config.headers), id);
  });
  mock.onPatch(/^\/users\/me\/payment-methods\/.+$/).reply((config) => {
    const id = config.url?.split('/').pop() ?? '';
    return handleSetDefaultPaymentMethod(extractUserId(config.headers), id);
  });

  mock
    .onGet('/users/me/billing-address')
    .reply((config) => handleGetBillingAddress(extractUserId(config.headers)));
  mock
    .onPut('/users/me/billing-address')
    .reply((config) => handleUpdateBillingAddress(extractUserId(config.headers), config.data));

  mock
    .onPost('/account/email')
    .reply((config) => handleChangeEmail(extractUserId(config.headers), config.data));
  mock
    .onPost('/account/email/verify')
    .reply((config) => handleVerifyEmailChange(extractUserId(config.headers), config.data));
  mock
    .onPost('/account/phone')
    .reply((config) => handleChangePhone(extractUserId(config.headers), config.data));
  mock
    .onPost('/account/phone/verify')
    .reply((config) => handleVerifyPhoneChange(extractUserId(config.headers), config.data));
  mock
    .onPost('/account/password')
    .reply((config) => handleChangePassword(extractUserId(config.headers), config.data));
  mock
    .onPost('/account/delete')
    .reply((config) => handleDeleteAccount(extractUserId(config.headers)));
}
