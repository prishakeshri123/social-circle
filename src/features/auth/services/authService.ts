import { apiClient } from '@/services/apiClient';
import { SOCIAL_LOGIN_MOCK_DELAY_MS } from '@/shared/constants/app.constants';
import type {
  AuthSuccessResponse,
  ForgotPasswordRequest,
  LoginRequest,
  OtpPurpose,
  ResetPasswordRequest,
  SignupRequest,
  SignupResponse,
  SocialLoginResponse,
  SocialProvider,
  VerifyOtpRequest,
} from '@/types/auth.types';

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthSuccessResponse>('/auth/login', data).then((r) => r.data),

  signup: (data: SignupRequest) =>
    apiClient.post<SignupResponse>('/auth/signup', data).then((r) => r.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    apiClient
      .post<AuthSuccessResponse | { verified: true }>('/auth/verify-otp', data)
      .then((r) => r.data),

  resendOtp: (target: string, purpose: OtpPurpose) =>
    apiClient
      .post<{ message: string }>('/auth/resend-otp', { target, purpose })
      .then((r) => r.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient
      .post<{ message: string; maskedTarget: string }>('/auth/forgot-password', data)
      .then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<{ message: string }>('/auth/reset-password', data).then((r) => r.data),

  logout: () => apiClient.post<{ message: string }>('/auth/logout').then((r) => r.data),

  socialLogin: async (provider: SocialProvider) => {
    const [response] = await Promise.all([
      apiClient.post<SocialLoginResponse>('/auth/social-login', { provider, code: 'mock-code' }),
      wait(SOCIAL_LOGIN_MOCK_DELAY_MS),
    ]);
    return response.data;
  },
};
