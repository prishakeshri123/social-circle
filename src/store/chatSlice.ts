import { create } from 'zustand';

interface ChatSlice {
  unreadCounts: Record<string, number>;
  draftMessages: Record<string, string>;
  incrementUnread: (channelId: string) => void;
  clearUnread: (channelId: string) => void;
  setDraft: (channelId: string, text: string) => void;
}

export const useChatStore = create<ChatSlice>()((set) => ({
  unreadCounts: {},
  draftMessages: {},
  incrementUnread: (channelId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [channelId]: (state.unreadCounts[channelId] ?? 0) + 1,
      },
    })),
  clearUnread: (channelId) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [channelId]: 0 },
    })),
  setDraft: (channelId, text) =>
    set((state) => ({
      draftMessages: { ...state.draftMessages, [channelId]: text },
    })),
}));
