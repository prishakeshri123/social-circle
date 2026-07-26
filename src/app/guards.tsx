import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/shared/hooks/useAuth';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to={`${ROUTES.login}?next=${encodeURIComponent(location.pathname)}`} replace />
    );
  }

  return <>{children}</>;
}

export function OnboardingGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isProfileComplete } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }
  if (!isProfileComplete) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <>{children}</>;
}
