import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { loginSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAuthStore } from '@/store/authSlice';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButtons';
import { AuthDivider } from '@/features/auth/components/AuthDivider';
import { useLogin } from '@/features/auth/hooks/useLogin';
import type { SocialProvider } from '@/types/auth.types';
import type { z } from 'zod';

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isProfileComplete = useAuthStore((state) => state.isProfileComplete);
  const login = useLogin();

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
    login.mutate(values);
  });

  const handleSocialSelect = (provider: SocialProvider) => {
    const next = searchParams.get('next');
    const params = new URLSearchParams({ provider });
    if (next) params.set('next', next);
    navigate(`${ROUTES.authCallback}?${params.toString()}`);
  };

  const busy = login.isPending;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg font-semibold text-primary-600">{en.app.name}</p>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary">{en.auth.loginTitle}</h1>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{en.labels.email}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={en.placeholders.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoFocus
            disabled={busy}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-error-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">{en.labels.password}</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            disabled={busy}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="text-xs text-error-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
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
          <Link to={ROUTES.forgotPassword} className="text-sm text-primary-600 hover:underline">
            {en.auth.forgotPassword}
          </Link>
        </div>

        {login.isError && (
          <p role="alert" className="text-sm text-error-500">
            {getApiErrorMessage(login.error)}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {login.isPending ? en.auth.loginLoading : en.auth.loginCta}
        </Button>
      </form>

      <AuthDivider />

      <SocialLoginButtons disabled={busy} onSelect={handleSocialSelect} />

      <p className="text-center text-sm text-text-secondary">
        {en.auth.noAccount}{' '}
        <Link to={ROUTES.signup} className="font-medium text-primary-600 hover:underline">
          {en.auth.signUpLink}
        </Link>
      </p>
    </div>
  );
}
