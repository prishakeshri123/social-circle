import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { isToday, isYesterday } from 'date-fns';
import {
  ArrowLeft,
  Bell,
  BellOff,
  LogOut,
  MoreVertical,
  Paperclip,
  Pin,
  Search,
  Send,
  Smile,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';
import { Input } from '@/shared/components/ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/Popover';
import { ScrollArea } from '@/shared/components/ui/ScrollArea';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { en } from '@/shared/constants/locales/en';
import { formatDate } from '@/shared/utils/formatDate';
import { useUsersByIds } from '@/shared/hooks/useUsersByIds';
import { useAuthStore } from '@/store/authSlice';
import { cn } from '@/shared/utils/cn';
import { CategoryIconBadge } from '@/features/clubs/components/CategoryIconBadge';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { useToggleReaction } from '@/features/chat/hooks/useToggleReaction';
import type { ChatMessage } from '@/types/chat.types';

const QUICK_EMOJIS = ['😀', '😂', '❤️', '👍', '🎉', '😮', '🙏', '😢'];

function dayDividerLabel(date: string): string {
  const d = new Date(date);
  if (isToday(d)) return en.chat.todayDivider;
  if (isYesterday(d)) return en.chat.yesterdayDivider;
  return formatDate(d, 'MMMM d, yyyy');
}

interface ConversationThreadPanelProps {
  channelId: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  avatarFallback: string;
  category?: string;
  isSquareAvatar: boolean;
  onBack: () => void;
  secondaryAction?: { label: string; onClick: () => void };
  // Group-chat-only chrome (omitted for 1:1 direct messages).
  isGroup?: boolean;
  pinnedMessage?: ChatMessage | null;
  pinnedVisible?: boolean;
  onDismissPinned?: () => void;
  notificationsMuted?: boolean;
  onToggleNotifications?: () => void;
  onExitGroup?: () => void;
  typingName?: string | null;
  onMessageSent?: () => void;
  searchOpen?: boolean;
  searchQuery?: string;
  onToggleSearch?: () => void;
  onSearchQueryChange?: (value: string) => void;
}

export function ConversationThreadPanel({
  channelId,
  title,
  subtitle,
  avatarUrl,
  avatarFallback,
  category,
  isSquareAvatar,
  onBack,
  secondaryAction,
  isGroup,
  pinnedMessage,
  pinnedVisible,
  onDismissPinned,
  notificationsMuted,
  onToggleNotifications,
  onExitGroup,
  typingName,
  onMessageSent,
  searchOpen: searchOpenProp,
  searchQuery: searchQueryProp,
  onToggleSearch,
  onSearchQueryChange,
}: ConversationThreadPanelProps) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { data, isLoading } = useMessages(channelId);
  const sendMessage = useSendMessage(channelId);
  const toggleReaction = useToggleReaction(channelId);
  const [draft, setDraft] = useState('');
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchOpen = searchOpenProp ?? internalSearchOpen;
  const searchQuery = searchQueryProp ?? internalSearchQuery;
  const toggleSearch = onToggleSearch ?? (() => setInternalSearchOpen((v) => !v));
  const setSearchQuery = onSearchQueryChange ?? setInternalSearchQuery;

  const allMessages = data?.data ?? [];
  const messages = searchQuery.trim()
    ? allMessages.filter((m) => m.text?.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : allMessages;
  const senderIds = allMessages.map((m) => m.senderId);
  const usersById = useUsersByIds(senderIds);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, channelId]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    sendMessage.mutate({ type: 'text', text }, { onSuccess: onMessageSent });
  }

  function handleAttachImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const mediaUrl = URL.createObjectURL(file);
    sendMessage.mutate(
      { type: 'image', mediaUrl, mediaType: file.type, mediaSize: file.size },
      { onSuccess: onMessageSent },
    );
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

        {isSquareAvatar && category ? (
          <CategoryIconBadge category={category} className="size-10 shrink-0 ring-0" />
        ) : (
          <Avatar className={cn('size-10 shrink-0', isSquareAvatar && 'rounded-2xl')}>
            <AvatarImage src={avatarUrl} alt="" className={cn(isSquareAvatar && 'rounded-2xl')} />
            <AvatarFallback className={cn(isSquareAvatar && 'rounded-2xl')}>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        )}

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

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={toggleSearch}
          aria-label={en.hub.searchToggleTooltip}
          title={en.hub.searchToggleTooltip}
        >
          <Search className="size-4" aria-hidden="true" />
        </Button>

        {isGroup && (
          <>
            {pinnedMessage && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={onDismissPinned}
                aria-label={en.hub.pinToggleTooltip}
                title={en.hub.pinToggleTooltip}
              >
                <Pin className="size-4" aria-hidden="true" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  aria-label={en.hub.moreOptionsTooltip}
                  title={en.hub.moreOptionsTooltip}
                >
                  <MoreVertical className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onToggleNotifications}>
                  {notificationsMuted ? (
                    <Bell className="size-4" aria-hidden="true" />
                  ) : (
                    <BellOff className="size-4" aria-hidden="true" />
                  )}
                  {notificationsMuted ? en.hub.unmuteNotificationsCta : en.hub.muteNotificationsCta}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-error-500" onClick={onExitGroup}>
                  <LogOut className="size-4" aria-hidden="true" />
                  {en.hub.exitGroupCta}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {searchOpen && (
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2">
          <Input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={en.chat.searchMessagesPlaceholder}
            aria-label={en.chat.searchMessages}
            className="rounded-full"
          />
        </div>
      )}

      {isGroup && pinnedMessage && pinnedVisible !== false && (
        <div className="flex shrink-0 items-start gap-2 border-b border-border bg-primary-50 px-4 py-2">
          <Pin className="mt-0.5 size-3.5 shrink-0 text-primary-600" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-primary-700">{en.chat.pinnedMessage}</p>
            <p className="truncate text-xs text-text-secondary">
              {pinnedMessage.text ?? en.hub.messageTypeDeleted}
            </p>
          </div>
          {onDismissPinned && (
            <button
              type="button"
              onClick={onDismissPinned}
              aria-label={en.actions.close}
              className="shrink-0 text-text-muted hover:text-text-primary"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
                <Skeleton className="h-10 w-1/2 rounded-2xl" />
              </div>
            ))}

          {!isLoading && messages.length === 0 && searchQuery.trim() && (
            <p className="py-10 text-center text-sm text-text-secondary">
              {en.chat.noSearchResults}
            </p>
          )}

          {!isLoading && messages.length === 0 && !searchQuery.trim() && (
            <p className="py-10 text-center text-sm text-text-secondary">
              {en.hub.threadEmptyBody}
            </p>
          )}

          {!isLoading &&
            messages.map((message, index) => {
              const previous = messages[index - 1];
              const showDivider =
                !previous ||
                new Date(previous.sentAt).toDateString() !==
                  new Date(message.sentAt).toDateString();

              return (
                <div key={message.id}>
                  {showDivider && (
                    <p className="py-2 text-center text-xs font-medium text-text-muted">
                      {dayDividerLabel(message.sentAt)}
                    </p>
                  )}
                  <MessageBubble
                    message={message}
                    isMine={message.senderId === currentUserId}
                    senderName={usersById[message.senderId]?.fullName ?? ''}
                    senderAvatarUrl={usersById[message.senderId]?.avatarUrl}
                    currentUserId={currentUserId}
                    onToggleReaction={(emoji) =>
                      toggleReaction.mutate({ messageId: message.id, emoji })
                    }
                  />
                </div>
              );
            })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {typingName && (
        <p className="shrink-0 px-4 pb-1 text-xs text-text-muted">
          {en.chat.typingIndicator(typingName)}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-border p-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAttachImage}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full"
          onClick={() => fileInputRef.current?.click()}
          aria-label={en.chat.attachImage}
          title={en.chat.attachImage}
        >
          <Paperclip className="size-4" aria-hidden="true" />
        </Button>

        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={en.placeholders.message}
          aria-label={en.placeholders.message}
          className="rounded-full"
          disabled={sendMessage.isPending}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full"
              aria-label={en.chat.emojiPicker}
              title={en.chat.emojiPicker}
            >
              <Smile className="size-4" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-4 gap-1">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setDraft((v) => v + emoji)}
                  className="rounded-md p-1.5 text-lg hover:bg-surface"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

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
