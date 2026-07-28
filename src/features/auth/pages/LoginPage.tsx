import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { OTP_LENGTH, OTP_RESEND_COOLDOWN_S } from '@/shared/constants/app.constants';
import { emailOrPhoneSchema, loginSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAuthStore } from '@/store/authSlice';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { OtpInput } from '@/features/auth/components/OtpInput';
import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButtons';
import { AuthDivider } from '@/features/auth/components/AuthDivider';
import { AUTH_FEATURES, AuthSplitLayout } from '@/features/auth/components/AuthSplitLayout';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useResendOtp } from '@/features/auth/hooks/useResendOtp';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';
import { cn } from '@/shared/utils/cn';
import type { SocialProvider } from '@/types/auth.types';
import type { z } from 'zod';

type LoginFormValues = z.infer<typeof loginSchema>;
type LoginMode = 'password' | 'otp';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isProfileComplete = useAuthStore((state) => state.isProfileComplete);
  const login = useLogin();
  const [mode, setMode] = useState<LoginMode>('password');
  const [otpTarget, setOtpTarget] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const resendOtp = useResendOtp();
  const verifyOtp = useVerifyOtp();

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = window.setInterval(() => setOtpCooldown((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [otpCooldown]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const next = searchParams.get('next');
    navigate(isProfileComplete ? (next ?? ROUTES.home) : ROUTES.onboardingProfile, {
      replace: true,
    });
  }, [isAuthenticated, isProfileComplete, navigate, searchParams]);

  const onSubmit = handleSubmit((values) => {
    setOtpError(null);
    login.mutate(values);
  });

  const handleSendOtp = () => {
    const target = otpTarget.trim();
    if (!target) {
      setOtpError(en.auth.otpTargetRequired);
      return;
    }

    const validation = emailOrPhoneSchema.safeParse(target);
    if (!validation.success) {
      setOtpError(validation.error.issues[0].message);
      return;
    }

    setOtpError(null);
    resendOtp.mutate(
      { target, purpose: 'login' },
      {
        onSuccess: () => {
          setOtpSent(true);
          setOtpCode('');
          setOtpCooldown(OTP_RESEND_COOLDOWN_S);
        },
        onError: (error) => {
          setOtpError(getApiErrorMessage(error));
        },
      },
    );
  };

  const handleVerifyOtp = () => {
    const target = otpTarget.trim();
    if (!target) {
      setOtpError(en.auth.otpTargetRequired);
      return;
    }

    if (otpCode.length !== OTP_LENGTH) {
      setOtpError(en.auth.otpCodeRequired);
      return;
    }

    setOtpError(null);
    verifyOtp.mutate(
      { target, otp: otpCode, purpose: 'login' },
      {
        onError: (error) => {
          setOtpError(getApiErrorMessage(error));
        },
      },
    );
  };

  const handleSocialSelect = (provider: SocialProvider) => {
    const next = searchParams.get('next');
    const params = new URLSearchParams({ provider });
    if (next) params.set('next', next);
    navigate(`${ROUTES.authCallback}?${params.toString()}`);
  };

  const busy = login.isPending || resendOtp.isPending || verifyOtp.isPending;

  return (
    <AuthSplitLayout
      heading={en.auth.loginWelcomeHeading}
      subtitle={en.auth.loginWelcomeSubtitle}
      features={AUTH_FEATURES}
      cardTitle={en.auth.loginTitle}
      bottomPrompt={
        <>
          {en.auth.newToSocialCircle}{' '}
          <Link to={ROUTES.signup} className="font-medium text-primary-600 hover:underline">
            {en.auth.createAccountLink}
          </Link>
        </>
      }
    >
      <form
        onSubmit={mode === 'password' ? onSubmit : (event) => event.preventDefault()}
        noValidate
        className="space-y-3.5 sm:space-y-4"
      >
        <div className="rounded-xl border border-border bg-surface-subtle p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setMode('password');
                setOtpError(null);
              }}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                mode === 'password'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
              )}
            >
              {en.auth.loginWithPassword}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('otp');
                setOtpError(null);
              }}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                mode === 'otp'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
              )}
            >
              {en.auth.loginWithOtp}
            </button>
          </div>
        </div>

        <p className="text-sm text-text-secondary">
          {mode === 'password' ? en.auth.passwordModeHint : en.auth.otpModeHint}
        </p>

        {mode === 'password' ? (
          <>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                {en.labels.emailOrPhone}
              </Label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="text"
                  autoComplete="email"
                  placeholder={en.placeholders.emailOrPhone}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  autoFocus
                  disabled={busy}
                  className="pl-9"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-xs text-error-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                {en.labels.password}
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                  aria-hidden="true"
                />
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  placeholder={en.placeholders.currentPassword}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  disabled={busy}
                  className="pl-9"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-error-500">
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-end">
                <Link
                  to={ROUTES.forgotPassword}
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  {en.auth.forgotPassword}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={busy}
                  />
                )}
              />
              <Label htmlFor="rememberMe" className="font-normal">
                {en.auth.rememberMe}
              </Label>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="otpTarget" className="text-sm">
                {en.labels.emailOrPhone}
              </Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                  aria-hidden="true"
                />
                <Input
                  id="otpTarget"
                  type="text"
                  autoComplete="email"
                  placeholder={en.placeholders.emailOrPhone}
                  value={otpTarget}
                  onChange={(event) => {
                    setOtpTarget(event.target.value);
                    if (otpError) setOtpError(null);
                    if (otpSent) {
                      setOtpSent(false);
                      setOtpCode('');
                      setOtpCooldown(0);
                    }
                  }}
                  disabled={busy}
                  className="pl-9"
                  autoFocus
                />
              </div>
              <p className="text-xs text-text-muted">{en.auth.otpModeHelper}</p>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant={otpSent ? 'secondary' : 'outline'}
                className="w-full"
                disabled={busy || !otpTarget.trim() || (otpSent && otpCooldown > 0)}
                onClick={handleSendOtp}
              >
                {otpSent
                  ? otpCooldown > 0
                    ? `${en.auth.otpResendIn} ${otpCooldown}s`
                    : en.auth.otpResend
                  : en.auth.otpSendCta}
              </Button>

              {otpSent && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-text-primary">{en.auth.otpEntryLabel}</p>
                  <OtpInput
                    value={otpCode}
                    onChange={setOtpCode}
                    autoFocus
                    disabled={busy}
                    error={Boolean(otpError && otpCode.length === OTP_LENGTH)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {(login.isError || otpError) && (
          <p role="alert" className="text-sm text-error-500">
            {otpError ?? getApiErrorMessage(login.error)}
          </p>
        )}

        <Button
          type={mode === 'password' ? 'submit' : 'button'}
          size="lg"
          className="w-full"
          disabled={busy || (mode === 'otp' ? !otpSent || otpCode.length !== OTP_LENGTH : false)}
          onClick={mode === 'otp' ? handleVerifyOtp : undefined}
        >
          {mode === 'password'
            ? login.isPending
              ? en.auth.loginLoading
              : en.auth.loginCta
            : verifyOtp.isPending
              ? en.auth.otpVerifying
              : en.auth.otpVerifyCta}
        </Button>
      </form>

      <AuthDivider />

      <SocialLoginButtons disabled={busy} onSelect={handleSocialSelect} />

      <p className="text-center text-xs text-text-muted">
        {en.auth.legalConsentPrefix}{' '}
        <Link to={ROUTES.terms} className="font-medium text-primary-600 hover:underline">
          {en.marketing.footerLinkTermsOfService}
        </Link>{' '}
        {en.auth.legalConsentAnd}{' '}
        <Link to={ROUTES.privacyPolicy} className="font-medium text-primary-600 hover:underline">
          {en.marketing.footerLinkPrivacyPolicy}
        </Link>
        .
      </p>
    </AuthSplitLayout>
  );
}
