import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { forgotPasswordSchema, resetPasswordSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { OTP_LENGTH } from '@/shared/constants/app.constants';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { toast } from '@/shared/components/ui/Toast';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import { OtpInput } from '@/features/auth/components/OtpInput';
import { useRequestPasswordReset, useResetPassword } from '@/features/auth/hooks/useForgotPassword';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';
import type { z } from 'zod';

type TargetFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetFormValues = z.infer<typeof resetPasswordSchema>;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [target, setTarget] = useState('');
  const [masked, setMasked] = useState('');
  const [otp, setOtp] = useState('');

  const requestReset = useRequestPasswordReset();
  const verifyOtp = useVerifyOtp();
  const resetPassword = useResetPassword();

  const targetForm = useForm<TargetFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { target: '' },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  });

  const newPassword = resetForm.watch('newPassword');

  const submitTarget = targetForm.handleSubmit((values) => {
    requestReset.mutate(
      { target: values.target },
      {
        onSuccess: (data) => {
          setTarget(values.target);
          setMasked(data.maskedTarget);
          setStep(2);
        },
      },
    );
  });

  const handleVerify = () => {
    verifyOtp.mutate(
      { target, otp, purpose: 'forgot_password' },
      {
        onSuccess: () => {
          resetForm.setValue('otp', otp);
          setStep(3);
        },
      },
    );
  };

  const submitReset = resetForm.handleSubmit((values) => {
    resetPassword.mutate(
      { target, otp: values.otp, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success(en.success.passwordReset);
          navigate(ROUTES.login, { replace: true });
        },
      },
    );
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg font-semibold text-primary-600">{en.app.name}</p>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary">{en.auth.forgotTitle}</h1>
      </div>

      {step === 1 && (
        <form onSubmit={submitTarget} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="target">{en.labels.email}</Label>
            <Input
              id="target"
              autoComplete="email"
              placeholder={en.placeholders.email}
              autoFocus
              disabled={requestReset.isPending}
              {...targetForm.register('target')}
            />
            {targetForm.formState.errors.target && (
              <p className="text-xs text-error-500">{targetForm.formState.errors.target.message}</p>
            )}
          </div>

          {requestReset.isError && (
            <p role="alert" className="text-sm text-error-500">
              {getApiErrorMessage(requestReset.error)}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={requestReset.isPending}>
            {en.auth.forgotCta}
          </Button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center">
          <p className="text-sm text-text-secondary">
            {en.auth.otpSubtitle} {masked}
          </p>
          <OtpInput
            value={otp}
            onChange={setOtp}
            onComplete={(value) => setOtp(value)}
            disabled={verifyOtp.isPending}
            error={verifyOtp.isError}
            autoFocus
          />
          {verifyOtp.isError && (
            <p role="alert" className="text-sm text-error-500">
              {getApiErrorMessage(verifyOtp.error)}
            </p>
          )}
          <Button
            type="button"
            className="w-full"
            disabled={otp.length !== OTP_LENGTH || verifyOtp.isPending}
            onClick={handleVerify}
          >
            {en.auth.otpVerifyCta}
          </Button>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={submitReset} noValidate className="space-y-4">
          <h2 className="text-center text-lg font-medium text-text-primary">
            {en.auth.resetTitle}
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">{en.labels.password}</Label>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              disabled={resetPassword.isPending}
              {...resetForm.register('newPassword')}
            />
            <PasswordStrengthMeter password={newPassword} />
            {resetForm.formState.errors.newPassword && (
              <p className="text-xs text-error-500">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{en.labels.confirmPassword}</Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              disabled={resetPassword.isPending}
              {...resetForm.register('confirmPassword')}
            />
            {resetForm.formState.errors.confirmPassword && (
              <p className="text-xs text-error-500">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {resetPassword.isError && (
            <p role="alert" className="text-sm text-error-500">
              {getApiErrorMessage(resetPassword.error)}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
            {en.auth.resetCta}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-text-secondary">
        <Link to={ROUTES.login} className="font-medium text-primary-600 hover:underline">
          {en.auth.backToLogin}
        </Link>
      </p>
    </div>
  );
}
