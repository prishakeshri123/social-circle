import type { AxiosError } from 'axios';
import { en } from '@/shared/constants/locales/en';
import type { ApiErrorResponse } from '@/types/auth.types';

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse> | undefined;
  return axiosError?.response?.data?.message ?? en.errors.networkError;
}
