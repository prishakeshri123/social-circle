import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared/constants/app.constants';
import { setStoredToken, clearStoredToken } from '@/shared/utils/authTokenStorage';
import type { User } from '@/types/user.types';

interface AuthSlice {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  setAuth: (user: User, token: string, refreshToken: string, remember?: boolean) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<User>) => void;
}

// Mirrors the raw token storage choice (see authTokenStorage.ts) for this
// slice's own persisted state (user, isAuthenticated, ...), so an unchecked
// "Keep me signed in" keeps the whole session tab-scoped, not just the
// tokens the axios interceptor reads directly.
let rememberSession = true;

const dualStorage: StateStorage = {
  getItem: (name) => sessionStorage.getItem(name) ?? localStorage.getItem(name),
  setItem: (name, value) => {
    sessionStorage.setItem(name, value);
    if (rememberSession) {
      localStorage.setItem(name, value);
    } else {
      localStorage.removeItem(name);
    }
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name);
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isProfileComplete: false,
      setAuth: (user, token, refreshToken, remember = true) => {
        rememberSession = remember;
        setStoredToken(ACCESS_TOKEN_KEY, token, remember);
        setStoredToken(REFRESH_TOKEN_KEY, refreshToken, remember);
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isProfileComplete: user.profileComplete,
        });
      },
      clearAuth: () => {
        clearStoredToken(ACCESS_TOKEN_KEY);
        clearStoredToken(REFRESH_TOKEN_KEY);
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
    { name: 'sc-auth', storage: createJSONStorage(() => dualStorage) },
  ),
);
