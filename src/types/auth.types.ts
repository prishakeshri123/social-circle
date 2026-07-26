import type { User } from '@/types/user.types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  channel: 'email' | 'sms';
  maskedTarget: string;
}

export type OtpPurpose = 'signup' | 'login' | 'forgot_password' | 'change_email' | 'change_phone';

export interface VerifyOtpRequest {
  target: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface AuthSuccessResponse extends AuthTokens {
  user: User;
}

export interface ForgotPasswordRequest {
  target: string;
}

export interface ResetPasswordRequest {
  target: string;
  otp: string;
  newPassword: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
}

export type SocialProvider = 'google' | 'apple' | 'facebook';

export interface SocialLoginRequest {
  provider: SocialProvider;
  code: string;
}

export interface SocialLoginResponse extends AuthSuccessResponse {
  isNewUser: boolean;
}
