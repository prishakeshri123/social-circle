import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { OTP_LENGTH, OTP_RESEND_COOLDOWN_S } from '@/shared/constants/app.constants';
import { emailOrPhoneSchema, fullNameSchema, signupSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import { OtpInput } from '@/features/auth/components/OtpInput';
import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButtons';
import { AuthDivider } from '@/features/auth/components/AuthDivider';
import { AUTH_FEATURES, AuthSplitLayout } from '@/features/auth/components/AuthSplitLayout';
import { useSignup } from '@/features/auth/hooks/useSignup';
import { useResendOtp } from '@/features/auth/hooks/useResendOtp';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';
import { cn } from '@/shared/utils/cn';
import type { SocialProvider } from '@/types/auth.types';
import type { z } from 'zod';

type SignupFormValues = z.infer<typeof signupSchema>;
type SignupMode = 'password' | 'otp';

export function SignupPage() {
  const navigate = useNavigate();
  const signup = useSignup();
  const [mode, setMode] = useState<SignupMode>('password');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const password = watch('password');

  const [otpFullName, setOtpFullName] = useState('');
  const [otpTarget, setOtpTarget] = useState('');
  const [otpTerms, setOtpTerms] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpFieldErrors, setOtpFieldErrors] = useState<{
    fullName?: string;
    target?: string;
    terms?: string;
  }>({});
  const [otpCooldown, setOtpCooldown] = useState(0);
  const resendOtp = useResendOtp();
  const verifyOtp = useVerifyOtp();

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = window.setInterval(() => setOtpCooldown((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [otpCooldown]);

  const onSubmit = handleSubmit((values) => {
    signup.mutate(
      { fullName: values.fullName, email: values.email, password: values.password },
      {
        onSuccess: (response) => {
          navigate(ROUTES.verifyOtp, {
            state: {
              target: values.email,
              channel: response.channel,
              masked: response.maskedTarget,
              purpose: 'signup',
            },
          });
        },
      },
    );
  });

  const handleSendOtp = () => {
    const fullNameResult = fullNameSchema.safeParse(otpFullName.trim());
    const targetResult = emailOrPhoneSchema.safeParse(otpTarget.trim());

    const fieldErrors: typeof otpFieldErrors = {};
    if (!fullNameResult.success) fieldErrors.fullName = fullNameResult.error.issues[0].message;
    if (!targetResult.success) fieldErrors.target = targetResult.error.issues[0].message;
    if (!otpTerms) fieldErrors.terms = en.errors.termsRequired;

    setOtpFieldErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setOtpError(null);
    signup.mutate(
      { fullName: otpFullName.trim(), email: otpTarget.trim() },
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

  const handleResendOtp = () => {
    setOtpError(null);
    resendOtp.mutate(
      { target: otpTarget.trim(), purpose: 'signup' },
      {
        onSuccess: () => {
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
    if (otpCode.length !== OTP_LENGTH) {
      setOtpError(en.auth.otpCodeRequired);
      return;
    }

    setOtpError(null);
    verifyOtp.mutate(
      { target: otpTarget.trim(), otp: otpCode, purpose: 'signup' },
      {
        onSuccess: () => navigate(ROUTES.onboardingProfile, { replace: true }),
        onError: (error) => {
          setOtpError(getApiErrorMessage(error));
        },
      },
    );
  };

  const handleSocialSelect = (provider: SocialProvider) => {
    navigate(`${ROUTES.authCallback}?${new URLSearchParams({ provider }).toString()}`);
  };

  const busy = signup.isPending || resendOtp.isPending || verifyOtp.isPending;

  return (
    <AuthSplitLayout
      heading={en.auth.signupWelcomeHeading}
      subtitle={en.auth.signupWelcomeSubtitle}
      features={AUTH_FEATURES}
      cardTitle={en.auth.signupTitle}
      bottomPrompt={
        <>
          {en.auth.alreadyHaveAccount}{' '}
          <Link to={ROUTES.login} className="font-medium text-primary-600 hover:underline">
            {en.auth.loginLink}
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
              onClick={() => setMode('password')}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                mode === 'password'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
              )}
            >
              {en.auth.signupWithPassword}
            </button>
            <button
              type="button"
              onClick={() => setMode('otp')}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                mode === 'otp'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
              )}
            >
              {en.auth.signupWithOtp}
            </button>
          </div>
        </div>

        <p className="text-sm text-text-secondary">
          {mode === 'password' ? en.auth.signupPasswordModeHint : en.auth.signupOtpModeHint}
        </p>

        {mode === 'password' ? (
          <>
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-sm">
                {en.labels.fullName}
              </Label>
              <Input
                id="fullName"
                autoComplete="name"
                placeholder={en.placeholders.fullName}
                autoFocus
                disabled={busy}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-xs text-error-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                {en.labels.email}
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={en.placeholders.email}
                disabled={busy}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-error-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm">
                {en.labels.phone}
              </Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder={en.placeholders.phone}
                disabled={busy}
                {...register('phone')}
              />
              {errors.phone && <p className="text-xs text-error-500">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                {en.labels.password}
              </Label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                placeholder={en.placeholders.password}
                disabled={busy}
                {...register('password')}
              />
              <PasswordStrengthMeter password={password} />
              {errors.password && (
                <p className="text-xs text-error-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-sm">
                {en.labels.confirmPassword}
              </Label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                disabled={busy}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-error-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Controller
                  name="terms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={busy}
                    />
                  )}
                />
                <Label htmlFor="terms" className="font-normal">
                  {en.auth.termsLabel}
                </Label>
              </div>
              {errors.terms && <p className="text-xs text-error-500">{errors.terms.message}</p>}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="otpFullName" className="text-sm">
                {en.labels.fullName}
              </Label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                  aria-hidden="true"
                />
                <Input
                  id="otpFullName"
                  autoComplete="name"
                  placeholder={en.placeholders.fullName}
                  value={otpFullName}
                  onChange={(event) => {
                    setOtpFullName(event.target.value);
                    if (otpFieldErrors.fullName) {
                      setOtpFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                    }
                  }}
                  disabled={busy || otpSent}
                  autoFocus
                  className="pl-9"
                />
              </div>
              {otpFieldErrors.fullName && (
                <p className="text-xs text-error-500">{otpFieldErrors.fullName}</p>
              )}
            </div>

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
                    if (otpFieldErrors.target) {
                      setOtpFieldErrors((prev) => ({ ...prev, target: undefined }));
                    }
                    if (otpSent) {
                      setOtpSent(false);
                      setOtpCode('');
                      setOtpCooldown(0);
                    }
                  }}
                  disabled={busy}
                  className="pl-9"
                />
              </div>
              {otpFieldErrors.target && (
                <p className="text-xs text-error-500">{otpFieldErrors.target}</p>
              )}
              <p className="text-xs text-text-muted">{en.auth.otpModeHelper}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="otpTerms"
                  checked={otpTerms}
                  onCheckedChange={(checked) => {
                    setOtpTerms(checked === true);
                    if (otpFieldErrors.terms) {
                      setOtpFieldErrors((prev) => ({ ...prev, terms: undefined }));
                    }
                  }}
                  disabled={busy || otpSent}
                />
                <Label htmlFor="otpTerms" className="font-normal">
                  {en.auth.termsLabel}
                </Label>
              </div>
              {otpFieldErrors.terms && (
                <p className="text-xs text-error-500">{otpFieldErrors.terms}</p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant={otpSent ? 'secondary' : 'outline'}
                className="w-full"
                disabled={busy || (otpSent && otpCooldown > 0)}
                onClick={otpSent ? handleResendOtp : handleSendOtp}
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

        {((mode === 'password' && signup.isError) || (mode === 'otp' && otpError)) && (
          <p role="alert" className="text-sm text-error-500">
            {mode === 'password' ? getApiErrorMessage(signup.error) : otpError}
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
            ? signup.isPending
              ? en.auth.signupLoading
              : en.auth.signupCta
            : verifyOtp.isPending
              ? en.auth.otpVerifying
              : en.auth.otpSignupVerifyCta}
        </Button>
      </form>

      <AuthDivider />

      <SocialLoginButtons disabled={busy} onSelect={handleSocialSelect} />
    </AuthSplitLayout>
  );
}
