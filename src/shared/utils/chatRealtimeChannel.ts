// Cross-tab pub/sub for chat updates. Mock handlers call broadcastChatChange
// after a mutation; useChatRealtimeSync listens and invalidates queries so
// other open tabs (e.g. a second logged-in account) pick up the change
// without a manual refresh. If a real backend replaces the mock later, the
// broadcast call site simply becomes a WebSocket message handler -- the
// listener side (this module + the hook) doesn't need to change.
const CHANNEL_NAME = 'sc-chat-sync';

export interface ChatChangeEvent {
  channelId?: string;
}

function isBroadcastChannelSupported(): boolean {
  return typeof BroadcastChannel !== 'undefined';
}

export function broadcastChatChange(payload: ChatChangeEvent = {}): void {
  if (!isBroadcastChannelSupported()) return;
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(payload);
    channel.close();
  } catch {
    // Ignore -- the polling fallback still covers this case.
  }
}

export function onChatChange(handler: (payload: ChatChangeEvent) => void): () => void {
  if (!isBroadcastChannelSupported()) return () => {};

  const channel = new BroadcastChannel(CHANNEL_NAME);
  const listener = (event: MessageEvent<ChatChangeEvent>) => handler(event.data);
  channel.addEventListener('message', listener);

  return () => {
    channel.removeEventListener('message', listener);
    channel.close();
  };
}
