import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AUTO_REPLY_CHANCE,
  TYPING_INDICATOR_MAX_MS,
  TYPING_INDICATOR_MIN_MS,
} from '@/shared/constants/app.constants';

// Lightweight, client-only presence simulation: after the member sends a
// message, occasionally show "<name> is typing..." from another channel
// participant for a bit. No message is actually fabricated on their behalf.
export function useTypingSimulation(channelId: string | null, participantNames: string[]) {
  const [typingName, setTypingName] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Reset the indicator when the channel changes, without a state-syncing
  // effect (https://react.dev/learn/you-might-not-need-an-effect).
  const [renderedChannelId, setRenderedChannelId] = useState(channelId);
  if (channelId !== renderedChannelId) {
    setRenderedChannelId(channelId);
    setTypingName(null);
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const trigger = useCallback(() => {
    if (participantNames.length === 0) return;
    if (Math.random() > AUTO_REPLY_CHANCE) return;

    const name = participantNames[Math.floor(Math.random() * participantNames.length)];
    const duration =
      TYPING_INDICATOR_MIN_MS + Math.random() * (TYPING_INDICATOR_MAX_MS - TYPING_INDICATOR_MIN_MS);

    clearTimeout(timeoutRef.current);
    setTypingName(name);
    timeoutRef.current = setTimeout(() => setTypingName(null), duration);
  }, [participantNames]);

  return { typingName, trigger };
}
