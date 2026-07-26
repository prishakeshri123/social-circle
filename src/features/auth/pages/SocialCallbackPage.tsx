import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { useSocialLogin } from '@/features/auth/hooks/useSocialLogin';
import type { SocialProvider } from '@/types/auth.types';

const VALID_PROVIDERS: SocialProvider[] = ['google', 'apple', 'facebook'];

export function SocialCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const socialLogin = useSocialLogin();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const provider = searchParams.get('provider');
    const next = searchParams.get('next');

    if (!provider || !VALID_PROVIDERS.includes(provider as SocialProvider)) {
      return;
    }

    socialLogin.mutate(provider as SocialProvider, {
      onSuccess: (data) => {
        navigate(data.isNewUser ? ROUTES.onboardingInterests : (next ?? ROUTES.home), {
          replace: true,
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (socialLogin.isError) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-error-500">{en.auth.signInFailed}</p>
        <p className="text-xs text-text-muted">{getApiErrorMessage(socialLogin.error)}</p>
        <Link to={ROUTES.login} className="font-medium text-primary-600 hover:underline">
          {en.auth.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <LoadingSpinner />
      <p className="text-sm text-text-secondary">{en.auth.completeSignIn}</p>
    </div>
  );
}
