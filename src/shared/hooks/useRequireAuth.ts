import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/shared/hooks/useAuth';

interface RequireAuthOptions {
  /** Club category slug to pre-select in the signup form's community picker. */
  communitySlug?: string;
}

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return function requireAuth(intent: string, action: () => void, options?: RequireAuthOptions) {
    if (!isAuthenticated) {
      const next = encodeURIComponent(location.pathname + location.search);
      // "Buy membership" and event "RSVP/Join" both mean the guest doesn't
      // have an account yet — send them to signup (with the club's community
      // pre-selected) rather than login, which assumes an existing account.
      if (intent === 'buy' || intent === 'rsvp') {
        navigate(ROUTES.signup, { state: { communitySlug: options?.communitySlug } });
        return;
      }
      navigate(`${ROUTES.login}?next=${next}&intent=${intent}`);
      return;
    }
    action();
  };
}
