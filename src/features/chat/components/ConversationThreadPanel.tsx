import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { ScrollArea } from '@/shared/components/ui/ScrollArea';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { en } from '@/shared/constants/locales/en';
import { useUsersByIds } from '@/shared/hooks/useUsersByIds';
import { useAuthStore } from '@/store/authSlice';
import { cn } from '@/shared/utils/cn';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';

interface ConversationThreadPanelProps {
  channelId: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  avatarFallback: string;
  isSquareAvatar: boolean;
  onBack: () => void;
  secondaryAction?: { label: string; onClick: () => void };
}

export function ConversationThreadPanel({
  channelId,
  title,
  subtitle,
  avatarUrl,
  avatarFallback,
  isSquareAvatar,
  onBack,
  secondaryAction,
}: ConversationThreadPanelProps) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { data, isLoading } = useMessages(channelId);
  const sendMessage = useSendMessage(channelId);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = data?.data ?? [];
  const senderIds = messages.map((m) => m.senderId);
  const usersById = useUsersByIds(senderIds);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, channelId]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    sendMessage.mutate({ type: 'text', text });
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onBack}
          aria-label={en.actions.back}
        >
          <ArrowLeft className="size-5" />
        </Button>

        <Avatar className={cn('size-10 shrink-0', isSquareAvatar && 'rounded-2xl')}>
          <AvatarImage src={avatarUrl} alt="" className={cn(isSquareAvatar && 'rounded-2xl')} />
          <AvatarFallback className={cn(isSquareAvatar && 'rounded-2xl')}>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{title}</p>
          {subtitle && <p className="truncate text-xs text-text-secondary">{subtitle}</p>}
        </div>

        {secondaryAction && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
                <Skeleton className="h-10 w-1/2 rounded-2xl" />
              </div>
            ))}

          {!isLoading && messages.length === 0 && (
            <p className="py-10 text-center text-sm text-text-secondary">
              {en.hub.threadEmptyBody}
            </p>
          )}

          {!isLoading &&
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isMine={message.senderId === currentUserId}
                senderName={usersById[message.senderId]?.fullName ?? ''}
                senderAvatarUrl={usersById[message.senderId]?.avatarUrl}
              />
            ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-border p-3"
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={en.placeholders.message}
          aria-label={en.placeholders.message}
          className="rounded-full"
          disabled={sendMessage.isPending}
        />
        <Button
          type="submit"
          size="icon"
          className="shrink-0 rounded-full"
          disabled={!draft.trim() || sendMessage.isPending}
          aria-label={en.actions.send}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
