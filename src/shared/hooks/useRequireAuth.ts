import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/shared/hooks/useAuth';

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return function requireAuth(intent: string, action: () => void) {
    if (!isAuthenticated) {
      const next = encodeURIComponent(location.pathname + location.search);
      navigate(`${ROUTES.login}?next=${next}&intent=${intent}`);
      return;
    }
    action();
  };
}
