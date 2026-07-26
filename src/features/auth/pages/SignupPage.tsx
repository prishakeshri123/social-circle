import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { signupSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButtons';
import { AuthDivider } from '@/features/auth/components/AuthDivider';
import { useSignup } from '@/features/auth/hooks/useSignup';
import type { SocialProvider } from '@/types/auth.types';
import type { z } from 'zod';

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const signup = useSignup();

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

  const handleSocialSelect = (provider: SocialProvider) => {
    navigate(`${ROUTES.authCallback}?${new URLSearchParams({ provider }).toString()}`);
  };

  const busy = signup.isPending;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg font-semibold text-primary-600">{en.app.name}</p>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary">{en.auth.signupTitle}</h1>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">{en.labels.fullName}</Label>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder={en.placeholders.fullName}
            autoFocus
            disabled={busy}
            {...register('fullName')}
          />
          {errors.fullName && <p className="text-xs text-error-500">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{en.labels.email}</Label>
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

        <div className="space-y-1.5">
          <Label htmlFor="phone">{en.labels.phone}</Label>
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

        <div className="space-y-1.5">
          <Label htmlFor="password">{en.labels.password}</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder={en.placeholders.password}
            disabled={busy}
            {...register('password')}
          />
          <PasswordStrengthMeter password={password} />
          {errors.password && <p className="text-xs text-error-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">{en.labels.confirmPassword}</Label>
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

        {signup.isError && (
          <p role="alert" className="text-sm text-error-500">
            {getApiErrorMessage(signup.error)}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {signup.isPending ? en.auth.signupLoading : en.auth.signupCta}
        </Button>
      </form>

      <AuthDivider />

      <SocialLoginButtons disabled={busy} onSelect={handleSocialSelect} />

      <p className="text-center text-sm text-text-secondary">
        {en.auth.alreadyHaveAccount}{' '}
        <Link to={ROUTES.login} className="font-medium text-primary-600 hover:underline">
          {en.auth.loginLink}
        </Link>
      </p>
    </div>
  );
}
