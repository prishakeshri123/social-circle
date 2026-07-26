import { useAuthStore } from '@/store/authSlice';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isProfileComplete = useAuthStore((state) => state.isProfileComplete);

  return { user, isAuthenticated, isProfileComplete };
}
