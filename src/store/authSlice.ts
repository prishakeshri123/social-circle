import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared/constants/app.constants';
import type { User } from '@/types/user.types';

interface AuthSlice {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isProfileComplete: false,
      setAuth: (user, token, refreshToken) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isProfileComplete: user.profileComplete,
        });
      },
      clearAuth: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isProfileComplete: false,
        });
      },
      updateUser: (partial) =>
        set((state) => {
          if (!state.user) return state;
          const user = { ...state.user, ...partial };
          return { user, isProfileComplete: user.profileComplete };
        }),
    }),
    { name: 'sc-auth' },
  ),
);
