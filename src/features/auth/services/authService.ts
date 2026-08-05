import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
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
    apiClient.post<AuthSuccessResponse>(API_ENDPOINTS.auth.login, data).then((r) => r.data),

  signup: (data: SignupRequest) =>
    apiClient.post<SignupResponse>(API_ENDPOINTS.auth.signup, data).then((r) => r.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    apiClient
      .post<AuthSuccessResponse | { verified: true }>(API_ENDPOINTS.auth.verifyOtp, data)
      .then((r) => r.data),

  resendOtp: (target: string, purpose: OtpPurpose) =>
    apiClient
      .post<{ message: string }>(API_ENDPOINTS.auth.resendOtp, { target, purpose })
      .then((r) => r.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient
      .post<{ message: string; maskedTarget: string }>(API_ENDPOINTS.auth.forgotPassword, data)
      .then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<{ message: string }>(API_ENDPOINTS.auth.resetPassword, data).then((r) => r.data),

  logout: () => apiClient.post<{ message: string }>(API_ENDPOINTS.auth.logout).then((r) => r.data),

  socialLogin: async (provider: SocialProvider) => {
    const [response] = await Promise.all([
      apiClient.post<SocialLoginResponse>(API_ENDPOINTS.auth.socialLogin, {
        provider,
        code: 'mock-code',
      }),
      wait(SOCIAL_LOGIN_MOCK_DELAY_MS),
    ]);
    return response.data;
  },
};
