import { create } from 'zustand';

interface UiSlice {
  sidebarOpen: boolean;
  notificationBadgeCount: number;
  setSidebarOpen: (open: boolean) => void;
  incrementNotificationBadge: () => void;
  clearNotificationBadge: () => void;
}

export const useUiStore = create<UiSlice>()((set) => ({
  sidebarOpen: true,
  notificationBadgeCount: 0,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  incrementNotificationBadge: () =>
    set((state) => ({ notificationBadgeCount: state.notificationBadgeCount + 1 })),
  clearNotificationBadge: () => set({ notificationBadgeCount: 0 }),
}));
