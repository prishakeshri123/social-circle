import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { OTP_LENGTH, OTP_RESEND_COOLDOWN_S } from '@/shared/constants/app.constants';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { Button } from '@/shared/components/ui/Button';
import { OtpInput } from '@/features/auth/components/OtpInput';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';
import { useResendOtp } from '@/features/auth/hooks/useResendOtp';
import type { OtpPurpose } from '@/types/auth.types';

interface OtpLocationState {
  target: string;
  channel: 'email' | 'sms';
  masked: string;
  purpose: OtpPurpose;
}

export function OtpVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OtpLocationState | null;

  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(OTP_RESEND_COOLDOWN_S);

  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  if (!state) {
    return <Navigate to={ROUTES.signup} replace />;
  }

  const handleComplete = (value: string) => {
    verifyOtp.mutate(
      { target: state.target, otp: value, purpose: state.purpose },
      {
        onSuccess: () => navigate(ROUTES.onboardingProfile, { replace: true }),
      },
    );
  };

  const handleResend = () => {
    resendOtp.mutate(
      { target: state.target, purpose: state.purpose },
      { onSuccess: () => setCooldown(OTP_RESEND_COOLDOWN_S) },
    );
    setOtp('');
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary-100">
          <Mail className="size-6 text-primary-600" />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          {en.auth.otpTitle}{' '}
          {state.channel === 'email' ? en.auth.channelEmail : en.auth.channelPhone}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {en.auth.otpSubtitle} {state.masked}
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-surface-subtle p-4 text-left shadow-sm">
        <p className="text-sm font-medium text-text-primary">{en.labels.emailOrPhone}</p>
        <p className="text-sm text-text-secondary">{state.masked}</p>

        <div className="pt-2">
          <p className="mb-3 text-sm font-medium text-text-primary">{en.auth.otpEntryLabel}</p>
          <OtpInput
            value={otp}
            onChange={setOtp}
            onComplete={handleComplete}
            disabled={verifyOtp.isPending}
            error={verifyOtp.isError}
            autoFocus
          />
        </div>
      </div>

      {verifyOtp.isError && (
        <p role="alert" className="text-sm text-error-500" aria-live="polite">
          {getApiErrorMessage(verifyOtp.error)}
        </p>
      )}

      <Button
        type="button"
        className="w-full"
        disabled={otp.length !== OTP_LENGTH || verifyOtp.isPending}
        onClick={() => handleComplete(otp)}
      >
        {en.auth.otpVerifyCta}
      </Button>

      <div className="text-sm text-text-secondary">
        {cooldown > 0 ? (
          <span>
            {en.auth.otpResendIn} {cooldown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendOtp.isPending}
            className="font-medium text-primary-600 hover:underline disabled:opacity-50"
          >
            {en.auth.otpResend}
          </button>
        )}
      </div>

      {import.meta.env.DEV && <p className="text-xs text-text-muted">{en.auth.otpDevHint}</p>}
    </div>
  );
}
