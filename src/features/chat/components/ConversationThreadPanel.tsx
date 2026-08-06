import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { isToday, isYesterday } from 'date-fns';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BellOff,
  LogOut,
  Mic,
  MoreVertical,
  Paperclip,
  Pin,
  Search,
  Send,
  Smile,
  Square,
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
import {
  MAX_VIDEO_SIZE_MB,
  MAX_DOC_SIZE_MB,
  MAX_PERSISTABLE_MEDIA_MB,
} from '@/shared/constants/app.constants';
import { readFileAsDataUrl } from '@/shared/utils/readFileAsDataUrl';
import { formatDate } from '@/shared/utils/formatDate';
import { useUsersByIds } from '@/shared/hooks/useUsersByIds';
import { useAuthStore } from '@/store/authSlice';
import { cn } from '@/shared/utils/cn';
import { CategoryIconBadge } from '@/features/clubs/components/CategoryIconBadge';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { useToggleReaction } from '@/features/chat/hooks/useToggleReaction';
import { useMarkAsRead } from '@/features/chat/hooks/useMarkAsRead';
import { useEditMessage } from '@/features/chat/hooks/useEditMessage';
import { useDeleteMessage } from '@/features/chat/hooks/useDeleteMessage';
import { useVote } from '@/features/chat/hooks/useVote';
import { PollComposer } from '@/features/chat/components/PollComposer';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { toast } from '@/shared/components/ui/Toast';
import type { ChatMessage, ChatPoll } from '@/types/chat.types';

const QUICK_EMOJIS = ['😀', '😂', '❤️', '👍', '🎉', '😮', '🙏', '😢'];

function dayDividerLabel(date: string): string {
  const d = new Date(date);
  if (isToday(d)) return en.chat.todayDivider;
  if (isYesterday(d)) return en.chat.yesterdayDivider;
  return formatDate(d, 'MMMM d, yyyy');
}

// Mirrors the mock's server-side message-preview labels for the reply-quote
// strip, since non-text message types don't have plain text to quote.
function replyPreviewText(message: ChatMessage): string {
  if (message.deleted) return en.hub.messageTypeDeleted;
  switch (message.type) {
    case 'text':
      return message.text ?? '';
    case 'image':
      return en.hub.messageTypeImage;
    case 'video':
      return en.hub.messageTypeVideo;
    case 'document':
      return en.hub.messageTypeDocument(message.text ?? en.hub.messageTypeVoice);
    case 'voice':
      return en.hub.messageTypeVoice;
    case 'poll':
      return en.hub.messageTypePoll(message.poll?.question ?? '');
    default:
      return message.text ?? '';
  }
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
  onOpenProfile?: (userId: string) => void;
  // 1:1-DM-only: lets the header avatar/name open the other participant's
  // profile drawer (group chats open a sender's profile from their bubbles).
  headerUserId?: string;
  pollComposerOpen?: boolean;
  onPollComposerOpenChange?: (open: boolean) => void;
  // Group-chat-only: fed the club roster so the composer can offer @mention
  // autocomplete and messages can highlight mentions of known members.
  mentionCandidates?: { id: string; fullName: string }[];
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
  onOpenProfile,
  headerUserId,
  pollComposerOpen: pollComposerOpenProp,
  onPollComposerOpenChange,
  mentionCandidates,
}: ConversationThreadPanelProps) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { data, isLoading } = useMessages(channelId);
  const sendMessage = useSendMessage(channelId);
  const toggleReaction = useToggleReaction(channelId);
  const markAsRead = useMarkAsRead(channelId);
  const editMessage = useEditMessage(channelId);
  const deleteMessage = useDeleteMessage(channelId);
  const vote = useVote(channelId);
  const [draft, setDraft] = useState('');
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [internalPollComposerOpen, setInternalPollComposerOpen] = useState(false);
  const pollComposerOpen = pollComposerOpenProp ?? internalPollComposerOpen;
  const setPollComposerOpen = onPollComposerOpenChange ?? setInternalPollComposerOpen;
  const [hiddenMessageIds, setHiddenMessageIds] = useLocalStorage<string[]>(
    `sc_hidden_messages_${currentUserId ?? 'anon'}`,
    [],
  );
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const searchOpen = searchOpenProp ?? internalSearchOpen;
  const searchQuery = searchQueryProp ?? internalSearchQuery;
  const toggleSearch = onToggleSearch ?? (() => setInternalSearchOpen((v) => !v));
  const setSearchQuery = onSearchQueryChange ?? setInternalSearchQuery;

  const allMessages = (data?.data ?? []).filter((m) => !hiddenMessageIds.includes(m.id));
  const messages = searchQuery.trim()
    ? allMessages.filter((m) => m.text?.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : allMessages;
  const senderIds = allMessages.map((m) => m.senderId);
  const usersById = useUsersByIds(senderIds);
  const mentionNames = mentionCandidates?.map((c) => c.fullName);

  const mentionMatch = /(^|\s)@(\w*)$/.exec(draft);
  const mentionQuery = mentionMatch?.[2] ?? null;
  const mentionMatches =
    mentionQuery !== null && mentionCandidates
      ? mentionCandidates
          .filter((c) => c.fullName.toLowerCase().startsWith(mentionQuery.toLowerCase()))
          .slice(0, 5)
      : [];

  function selectMention(candidate: { id: string; fullName: string }) {
    setDraft((prev) => prev.replace(/(^|\s)@(\w*)$/, `$1@${candidate.fullName} `));
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, channelId]);

  const markRead = markAsRead.mutate;
  useEffect(() => {
    if (!channelId || allMessages.length === 0) return;
    markRead();
  }, [channelId, allMessages.length, markRead]);

  useEffect(() => {
    return () => {
      recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function buildReplyTo(): ChatMessage['replyTo'] {
    if (!replyingTo) return undefined;
    return {
      id: replyingTo.id,
      senderId: replyingTo.senderId,
      senderName: usersById[replyingTo.senderId]?.fullName ?? '',
      previewText: replyPreviewText(replyingTo),
    };
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    const replyTo = buildReplyTo();
    setReplyingTo(null);
    sendMessage.mutate({ type: 'text', text, replyTo }, { onSuccess: onMessageSent });
  }

  function fileMessageType(file: File): 'image' | 'video' | 'document' {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  }

  async function handleAttachFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const type = fileMessageType(file);
    const sizeMb = file.size / (1024 * 1024);
    if (type === 'video' && sizeMb > MAX_VIDEO_SIZE_MB) {
      toast.error(en.errors.fileTooLarge(`${MAX_VIDEO_SIZE_MB} MB`));
      return;
    }
    if (type === 'document' && sizeMb > MAX_DOC_SIZE_MB) {
      toast.error(en.errors.fileTooLarge(`${MAX_DOC_SIZE_MB} MB`));
      return;
    }

    let mediaUrl: string;
    if (sizeMb <= MAX_PERSISTABLE_MEDIA_MB) {
      mediaUrl = await readFileAsDataUrl(file);
    } else {
      mediaUrl = URL.createObjectURL(file);
      toast(en.chat.mediaSessionOnly);
    }

    const replyTo = buildReplyTo();
    setReplyingTo(null);
    sendMessage.mutate(
      {
        type,
        text: type === 'document' ? file.name : undefined,
        mediaUrl,
        mediaType: file.type,
        mediaSize: file.size,
        replyTo,
      },
      { onSuccess: onMessageSent },
    );
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        recordingStreamRef.current = null;
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const sizeMb = blob.size / (1024 * 1024);

        let mediaUrl: string;
        if (sizeMb <= MAX_PERSISTABLE_MEDIA_MB) {
          mediaUrl = await readFileAsDataUrl(blob);
        } else {
          mediaUrl = URL.createObjectURL(blob);
          toast(en.chat.mediaSessionOnly);
        }

        const replyTo = buildReplyTo();
        setReplyingTo(null);
        sendMessage.mutate(
          { type: 'voice', mediaUrl, mediaType: blob.type, mediaSize: blob.size, replyTo },
          { onSuccess: onMessageSent },
        );
      };

      recordingStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      toast.error(en.chat.micPermissionDenied);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
  }

  function handleDeleteForMe(messageId: string) {
    setHiddenMessageIds((prev) => (prev.includes(messageId) ? prev : [...prev, messageId]));
    toast.success(en.chat.messageHidden);
  }

  function handleCreatePoll(poll: Omit<ChatPoll, 'closed'>) {
    sendMessage.mutate(
      { type: 'poll', poll: { ...poll, closed: false } },
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

        <button
          type="button"
          onClick={() => headerUserId && onOpenProfile?.(headerUserId)}
          disabled={!headerUserId || !onOpenProfile}
          className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:cursor-default"
        >
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
        </button>

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
        <div className="space-y-4 p-4" aria-label={title} aria-live="polite">
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
                    onReply={setReplyingTo}
                    onEdit={(messageId, text) => editMessage.mutate({ messageId, text })}
                    onDeleteForEveryone={(messageId) => deleteMessage.mutate(messageId)}
                    onDeleteForMe={handleDeleteForMe}
                    onSenderClick={onOpenProfile}
                    onVote={(optionIds) => vote.mutate({ messageId: message.id, optionIds })}
                    mentionNames={mentionNames}
                  />
                </div>
              );
            })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {typingName && (
        <p className="shrink-0 px-4 pb-1 text-xs text-text-muted" aria-live="polite">
          {en.chat.typingIndicator(typingName)}
        </p>
      )}

      {replyingTo && (
        <div className="flex shrink-0 items-start gap-2 border-t border-border bg-surface px-4 py-2">
          <div className="min-w-0 flex-1 border-l-2 border-primary-500 pl-2">
            <p className="text-xs font-semibold text-primary-700">
              {en.chat.replyingTo(usersById[replyingTo.senderId]?.fullName ?? '')}
            </p>
            <p className="truncate text-xs text-text-secondary">{replyPreviewText(replyingTo)}</p>
          </div>
          <button
            type="button"
            onClick={() => setReplyingTo(null)}
            aria-label={en.chat.cancelReply}
            title={en.chat.cancelReply}
            className="shrink-0 text-text-muted hover:text-text-primary"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative flex shrink-0 items-center gap-2 border-t border-border p-3"
      >
        {mentionMatches.length > 0 && (
          <div className="absolute inset-x-3 bottom-full z-10 mb-1 overflow-hidden rounded-lg border border-border bg-surface-raised shadow-card">
            {mentionMatches.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => selectMention(candidate)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-surface"
              >
                {candidate.fullName}
              </button>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleAttachFile}
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

        {isGroup && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            onClick={() => setPollComposerOpen(true)}
            aria-label={en.chat.pollQuestion}
            title={en.chat.createPoll}
          >
            <BarChart3 className="size-4" aria-hidden="true" />
          </Button>
        )}

        {isRecording ? (
          <div className="flex flex-1 items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm text-error-500">
            <span className="size-2 shrink-0 animate-pulse rounded-full bg-error-500" />
            {en.chat.recordingInProgress}
          </div>
        ) : (
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={en.placeholders.message}
            aria-label={en.placeholders.message}
            className="rounded-full"
            disabled={sendMessage.isPending}
          />
        )}

        <Button
          type="button"
          variant={isRecording ? 'destructive' : 'ghost'}
          size="icon"
          className="shrink-0 rounded-full"
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? en.chat.stopRecording : en.chat.recordVoice}
          title={isRecording ? en.chat.stopRecording : en.chat.recordVoice}
        >
          {isRecording ? (
            <Square className="size-4" aria-hidden="true" />
          ) : (
            <Mic className="size-4" aria-hidden="true" />
          )}
        </Button>

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

      {isGroup && (
        <PollComposer
          open={pollComposerOpen}
          onOpenChange={setPollComposerOpen}
          onSubmit={handleCreatePoll}
        />
      )}
    </div>
  );
}
