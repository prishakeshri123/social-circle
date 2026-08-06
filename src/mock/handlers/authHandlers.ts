import type MockAdapter from 'axios-mock-adapter';
import { nanoid } from 'nanoid';
import type {
  AuthSuccessResponse,
  AuthTokens,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SignupRequest,
  SignupResponse,
  SocialLoginRequest,
  SocialLoginResponse,
  SocialProvider,
  VerifyOtpRequest,
} from '@/types/auth.types';
import type { User } from '@/types/user.types';
import {
  LOGIN_LOCK_MINUTES,
  LOGIN_MAX_ATTEMPTS,
  MOCK_USERS,
  OTP_DEV_VALUE,
  OTP_MAX_ATTEMPTS,
} from '@/shared/constants/app.constants';
import { en } from '@/shared/constants/locales/en';
import seedUsers from '@/mock/data/users.json';

const e = en.errors;

const users: User[] = [...(seedUsers as User[])];
const passwordsByEmail = new Map<string, string>(
  Object.values(MOCK_USERS).map((account) => [account.email, account.password]),
);

interface LoginLockState {
  attempts: number;
  lockedUntil?: number;
}
const loginLocks = new Map<string, LoginLockState>();

interface OtpState {
  attempts: number;
  lockedUntil?: number;
}
const otpAttempts = new Map<string, OtpState>();

interface PendingSignup {
  fullName: string;
  email: string;
  password?: string;
}
const pendingSignups = new Map<string, PendingSignup>();

function isEmailTarget(target: string): boolean {
  return target.includes('@');
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  return `${local.slice(0, 1)}${'*'.repeat(Math.max(local.length - 1, 3))}@${domain}`;
}

function maskPhone(phone: string): string {
  return phone.length <= 2 ? phone : `${'*'.repeat(phone.length - 2)}${phone.slice(-2)}`;
}

function issueTokens(userId: string): AuthTokens {
  return {
    accessToken: `mock.access.token.${userId}`,
    refreshToken: `mock.refresh.token.${userId}`,
  };
}

function userIdFromToken(token: string | undefined): string | null {
  if (!token) return null;
  const match = /^mock\.(?:access|refresh)\.token\.(.+)$/.exec(token);
  return match ? match[1] : null;
}

function otpKey(target: string, purpose: string): string {
  return `${purpose}:${target}`;
}

function parseBody<T>(data: unknown): T {
  return (typeof data === 'string' ? JSON.parse(data) : data) as T;
}

function handleLogin(data: unknown): [number, unknown] {
  const { email, password } = parseBody<LoginRequest>(data);
  const lock = loginLocks.get(email);

  if (lock?.lockedUntil && Date.now() < lock.lockedUntil) {
    return [423, { code: 'ACCOUNT_LOCKED', message: e.accountLocked }];
  }

  const user = users.find((u) => u.email === email);
  const validPassword = passwordsByEmail.get(email) === password;

  if (!user || !validPassword) {
    const attempts = (lock?.attempts ?? 0) + 1;
    if (attempts >= LOGIN_MAX_ATTEMPTS) {
      loginLocks.set(email, {
        attempts,
        lockedUntil: Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000,
      });
      return [423, { code: 'ACCOUNT_LOCKED', message: e.accountLocked }];
    }
    loginLocks.set(email, { attempts });
    return [401, { code: 'INVALID_CREDENTIALS', message: e.invalidCredentials }];
  }

  loginLocks.delete(email);
  const response: AuthSuccessResponse = { user, ...issueTokens(user.id) };
  return [200, response];
}

function handleSignup(data: unknown): [number, unknown] {
  const { fullName, email, password } = parseBody<SignupRequest>(data);

  if (users.some((u) => u.email === email) || passwordsByEmail.has(email)) {
    return [409, { code: 'EMAIL_EXISTS', message: e.emailExists }];
  }

  pendingSignups.set(email, { fullName, email, password });
  otpAttempts.delete(otpKey(email, 'signup'));

  const emailTarget = isEmailTarget(email);
  const response: SignupResponse = {
    message: en.auth.otpSubtitle,
    channel: emailTarget ? 'email' : 'sms',
    maskedTarget: emailTarget ? maskEmail(email) : maskPhone(email),
  };
  return [200, response];
}

function handleVerifyOtp(data: unknown): [number, unknown] {
  const { target, otp, purpose } = parseBody<VerifyOtpRequest>(data);
  const key = otpKey(target, purpose);
  const state = otpAttempts.get(key);

  if (state?.lockedUntil && Date.now() < state.lockedUntil) {
    return [429, { code: 'OTP_MAX_ATTEMPTS', message: e.otpMaxAttempts }];
  }

  if (otp !== OTP_DEV_VALUE) {
    const attempts = (state?.attempts ?? 0) + 1;
    if (attempts >= OTP_MAX_ATTEMPTS) {
      otpAttempts.set(key, { attempts, lockedUntil: Date.now() + 5 * 60 * 1000 });
      return [429, { code: 'OTP_MAX_ATTEMPTS', message: e.otpMaxAttempts }];
    }
    otpAttempts.set(key, { attempts });
    return [400, { code: 'OTP_INVALID', message: e.otpInvalid }];
  }

  otpAttempts.delete(key);

  if (purpose === 'signup') {
    const pending = pendingSignups.get(target);
    if (!pending) {
      return [400, { code: 'SIGNUP_NOT_FOUND', message: e.otpExpired }];
    }
    pendingSignups.delete(target);

    const emailTarget = isEmailTarget(pending.email);
    const id = `usr_${nanoid(10)}`;
    const newUser: User = {
      id,
      email: emailTarget ? pending.email : '',
      phone: emailTarget ? undefined : pending.email,
      fullName: pending.fullName,
      username: `${pending.email.split('@')[0]}_${nanoid(4)}`.toLowerCase(),
      avatarUrl: '',
      bio: '',
      city: '',
      interests: [],
      status: 'active',
      emailVerified: emailTarget,
      phoneVerified: !emailTarget,
      profileComplete: false,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      clubsJoined: 0,
      linkedProviders: [],
    };
    users.push(newUser);
    if (pending.password) {
      passwordsByEmail.set(pending.email, pending.password);
    }

    const response: AuthSuccessResponse = { user: newUser, ...issueTokens(id) };
    return [200, response];
  }

  return [200, { verified: true }];
}

function handleResendOtp(data: unknown): [number, unknown] {
  const { target, purpose } = parseBody<{ target: string; purpose: string }>(data);
  otpAttempts.delete(otpKey(target, purpose));
  return [200, { message: en.auth.resendOtpSuccess }];
}

function handleForgotPassword(data: unknown): [number, unknown] {
  const { target } = parseBody<ForgotPasswordRequest>(data);
  if (!passwordsByEmail.has(target)) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  otpAttempts.delete(otpKey(target, 'forgot_password'));
  return [200, { message: en.auth.otpSubtitle, maskedTarget: maskEmail(target) }];
}

function handleResetPassword(data: unknown): [number, unknown] {
  const { target, otp, newPassword } = parseBody<ResetPasswordRequest>(data);
  const key = otpKey(target, 'forgot_password');
  const state = otpAttempts.get(key);

  if (state?.lockedUntil && Date.now() < state.lockedUntil) {
    return [429, { code: 'OTP_MAX_ATTEMPTS', message: e.otpMaxAttempts }];
  }
  if (otp !== OTP_DEV_VALUE) {
    const attempts = (state?.attempts ?? 0) + 1;
    otpAttempts.set(key, { attempts });
    return [400, { code: 'OTP_INVALID', message: e.otpInvalid }];
  }

  otpAttempts.delete(key);
  passwordsByEmail.set(target, newPassword);
  return [200, { message: en.success.passwordReset }];
}

const SOCIAL_PROFILES: Record<SocialProvider, { fullName: string }> = {
  google: { fullName: 'Google User' },
  apple: { fullName: 'Apple User' },
  facebook: { fullName: 'Facebook User' },
};

function handleSocialLogin(data: unknown): [number, unknown] {
  const { provider } = parseBody<SocialLoginRequest>(data);
  const email = `${provider}.demo@social.mock`;
  let user = users.find((u) => u.email === email);
  const isNewUser = !user;

  if (!user) {
    const id = `usr_${nanoid(10)}`;
    user = {
      id,
      email,
      fullName: SOCIAL_PROFILES[provider].fullName,
      username: `${provider}_${nanoid(4)}`.toLowerCase(),
      avatarUrl: '',
      bio: '',
      city: '',
      interests: [],
      status: 'active',
      emailVerified: true,
      phoneVerified: false,
      profileComplete: false,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      clubsJoined: 0,
      linkedProviders: [provider],
    };
    users.push(user);
  }

  const response: SocialLoginResponse = { user, ...issueTokens(user.id), isNewUser };
  return [200, response];
}

function handleRefresh(data: unknown): [number, unknown] {
  const { refreshToken } = parseBody<{ refreshToken: string }>(data);
  const userId = userIdFromToken(refreshToken);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return [401, { code: 'INVALID_REFRESH', message: e.sessionExpired }];
  }
  return [200, issueTokens(user.id)];
}

export function registerAuthHandlers(mock: MockAdapter): void {
  mock.onPost('/auth/login').reply((config) => handleLogin(config.data));
  mock.onPost('/auth/signup').reply((config) => handleSignup(config.data));
  mock.onPost('/auth/verify-otp').reply((config) => handleVerifyOtp(config.data));
  mock.onPost('/auth/resend-otp').reply((config) => handleResendOtp(config.data));
  mock.onPost('/auth/forgot-password').reply((config) => handleForgotPassword(config.data));
  mock.onPost('/auth/reset-password').reply((config) => handleResetPassword(config.data));
  mock.onPost('/auth/social-login').reply((config) => handleSocialLogin(config.data));
  mock.onPost('/auth/refresh').reply((config) => handleRefresh(config.data));
  mock.onPost('/auth/logout').reply(200, { message: en.auth.logoutSuccess });
}

function verifyPassword(email: string, password: string): boolean {
  return passwordsByEmail.get(email) === password;
}

function setPassword(email: string, password: string): void {
  passwordsByEmail.set(email, password);
}

export { users as mockUsers, userIdFromToken, verifyPassword, setPassword };
