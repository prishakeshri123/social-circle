import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LS_THEME_KEY } from '@/shared/constants/app.constants';

type Theme = 'light' | 'dark' | 'system';

interface UiSlice {
  sidebarOpen: boolean;
  theme: Theme;
  notificationBadgeCount: number;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  incrementNotificationBadge: () => void;
  clearNotificationBadge: () => void;
}

export const useUiStore = create<UiSlice>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'system',
      notificationBadgeCount: 0,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      incrementNotificationBadge: () =>
        set((state) => ({ notificationBadgeCount: state.notificationBadgeCount + 1 })),
      clearNotificationBadge: () => set({ notificationBadgeCount: 0 }),
    }),
    {
      name: LS_THEME_KEY,
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
