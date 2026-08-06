import { useState, type ReactNode } from 'react';
import {
  Check,
  CheckCheck,
  Copy,
  Download,
  FileText,
  Flag,
  Mic,
  MoreHorizontal,
  Pencil,
  Reply,
  SmilePlus,
  Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/Popover';
import { Input } from '@/shared/components/ui/Input';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/RadioGroup';
import { en } from '@/shared/constants/locales/en';
import { MESSAGE_EDIT_WINDOW_MS } from '@/shared/constants/app.constants';
import { formatFileSize } from '@/shared/utils/formatFileSize';
import { formatTime } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';
import { toast } from '@/shared/components/ui/Toast';
import { reactionGlyph, QUICK_REACTIONS } from '@/features/chat/utils/reactionEmoji';
import { MediaLightbox } from '@/features/chat/components/MediaLightbox';
import type { ChatMessage } from '@/types/chat.types';

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  senderName: string;
  senderAvatarUrl?: string;
  currentUserId?: string;
  onToggleReaction?: (emoji: string) => void;
  onReply?: (message: ChatMessage) => void;
  onEdit?: (messageId: string, text: string) => void;
  onDeleteForEveryone?: (messageId: string) => void;
  onDeleteForMe?: (messageId: string) => void;
  onReport?: (message: ChatMessage) => void;
  onSenderClick?: (senderId: string) => void;
  onVote?: (optionIds: string[]) => void;
  mentionNames?: string[];
}

function messageBody(message: ChatMessage): string {
  return message.deleted ? en.hub.messageTypeDeleted : (message.text ?? '');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Highlights "@FullName" occurrences that match a known club member, without
// requiring the sender to have tagged anyone via a rich-text editor.
function linkifyMentions(
  text: string,
  mentionNames: string[] | undefined,
  isMine: boolean,
): ReactNode {
  if (!mentionNames || mentionNames.length === 0) return text;

  const sortedNames = [...mentionNames].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`@(${sortedNames.map(escapeRegExp).join('|')})\\b`, 'g');
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <span
        key={match.index}
        className={cn('font-semibold', isMine ? 'text-primary-100' : 'text-primary-600')}
      >
        @{match[1]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  parts.push(text.slice(lastIndex));
  return parts;
}

function PollMessageContent({
  message,
  isMine,
  onVote,
}: {
  message: ChatMessage;
  isMine: boolean;
  onVote?: (optionIds: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const poll = message.poll;
  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, o) => sum + o.voteCount, 0);
  const hasVoted = (poll.userVotedOptionIds?.length ?? 0) > 0;
  const showResults = hasVoted || poll.closed;

  function toggleChecked(optionId: string) {
    setSelected((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
    );
  }

  return (
    <div className="min-w-56 space-y-2.5">
      <p className="font-medium">{poll.question}</p>

      {showResults ? (
        <div className="space-y-2">
          {poll.options.map((option) => {
            const pct = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
            const isMineVote = poll.userVotedOptionIds?.includes(option.id);
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className={cn(isMineVote && 'font-semibold')}>{option.text}</span>
                  <span className="shrink-0">{pct}%</span>
                </div>
                <div
                  className={cn(
                    'h-1.5 w-full overflow-hidden rounded-full',
                    isMine ? 'bg-primary-800/50' : 'bg-border',
                  )}
                >
                  <div
                    className={cn(
                      'h-full rounded-full',
                      isMine ? 'bg-primary-200' : 'bg-primary-500',
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : poll.allowMultiple ? (
        <div className="space-y-1.5">
          {poll.options.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={selected.includes(option.id)}
                onCheckedChange={() => toggleChecked(option.id)}
              />
              {option.text}
            </label>
          ))}
          <Button
            type="button"
            size="sm"
            className="mt-1"
            disabled={selected.length === 0}
            onClick={() => onVote?.(selected)}
          >
            {en.chat.vote}
          </Button>
        </div>
      ) : (
        <RadioGroup value="" onValueChange={(value) => onVote?.([value])} className="gap-1.5">
          {poll.options.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value={option.id} />
              {option.text}
            </label>
          ))}
        </RadioGroup>
      )}

      <p className="text-[11px] opacity-75">
        {poll.closed ? en.chat.pollClosed : en.chat.votes(totalVotes)}
      </p>
    </div>
  );
}

function fileTypeLabel(mediaType?: string): string {
  if (!mediaType) return '';
  const subtype = mediaType.split('/')[1] ?? mediaType;
  return subtype.toUpperCase();
}

function MessageImageAttachment({
  message,
  onExpand,
}: {
  message: ChatMessage;
  onExpand: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <button type="button" onClick={onExpand} className="block w-full">
        <img
          src={message.mediaThumbnailUrl ?? message.mediaUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="max-h-72 w-full rounded-xl object-cover"
        />
      </button>
      {message.text && <p>{message.text}</p>}
    </div>
  );
}

function MessageVideoAttachment({ message }: { message: ChatMessage }) {
  return (
    <div className="space-y-1.5">
      <video
        src={message.mediaUrl}
        poster={message.mediaThumbnailUrl}
        controls
        className="max-h-72 w-full rounded-xl"
      />
      {message.text && <p>{message.text}</p>}
    </div>
  );
}

function MessageDocumentAttachment({ message, isMine }: { message: ChatMessage; isMine: boolean }) {
  const hasRealFile = Boolean(message.mediaUrl) && message.mediaUrl !== '#';

  return (
    <a
      href={hasRealFile ? message.mediaUrl : undefined}
      download={hasRealFile}
      target={hasRealFile ? '_blank' : undefined}
      rel={hasRealFile ? 'noreferrer' : undefined}
      onClick={(e) => {
        if (!hasRealFile) e.preventDefault();
      }}
      className={cn(
        'flex items-center gap-3 rounded-xl border px-3 py-2.5',
        isMine ? 'border-primary-400 bg-primary-700/40' : 'border-border bg-surface-raised',
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          isMine ? 'bg-primary-800/50' : 'bg-error-100 text-error-500',
        )}
      >
        <FileText className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{message.text}</span>
        <span className="block text-xs opacity-80">
          {formatFileSize(message.mediaSize ?? 0)}
          {message.mediaType ? ` · ${fileTypeLabel(message.mediaType)}` : ''}
        </span>
      </span>
      <Download className="size-4 shrink-0 opacity-80" aria-hidden="true" />
    </a>
  );
}

// Rendered below the (colored) bubble, on the panel background -- so ticks
// use neutral/brand text colors rather than the bubble's inverse palette.
function MessageStatusTicks({ message }: { message: ChatMessage }) {
  const isRead = message.readBy.length > 0;
  const isDelivered = message.deliveredTo.length > 0;

  if (isRead) {
    return (
      <CheckCheck className="size-3.5 text-primary-600" aria-label={en.chat.messageStatusRead} />
    );
  }
  if (isDelivered) {
    return (
      <CheckCheck
        className="size-3.5 text-text-muted"
        aria-label={en.chat.messageStatusDelivered}
      />
    );
  }
  return <Check className="size-3.5 text-text-muted" aria-label={en.chat.messageStatusSent} />;
}

function MessageReplyPreview({ message, isMine }: { message: ChatMessage; isMine: boolean }) {
  if (!message.replyTo) return null;
  return (
    <div
      className={cn(
        'mb-1.5 rounded-lg border-l-2 px-2 py-1 text-xs',
        isMine
          ? 'border-primary-200 bg-primary-800/40 text-primary-50'
          : 'border-primary-400 bg-surface-raised text-text-secondary',
      )}
    >
      <p className="font-medium">{message.replyTo.senderName}</p>
      <p className="truncate opacity-90">{message.replyTo.previewText}</p>
    </div>
  );
}

function MessageVoiceAttachment({ message, isMine }: { message: ChatMessage; isMine: boolean }) {
  const hasRealAudio = Boolean(message.mediaUrl) && message.mediaUrl !== '#';

  if (hasRealAudio) {
    return (
      <audio controls src={message.mediaUrl} className="h-9 w-56 max-w-full">
        {en.chat.voiceNote}
      </audio>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full',
          isMine ? 'bg-primary-800/50' : 'bg-surface',
        )}
        aria-label={en.chat.playVoiceNoteCta}
      >
        <Mic className="size-4" aria-hidden="true" />
      </span>
      {en.chat.voiceNote}
    </span>
  );
}

export function MessageBubble({
  message,
  isMine,
  senderName,
  senderAvatarUrl,
  currentUserId,
  onToggleReaction,
  onReply,
  onEdit,
  onDeleteForEveryone,
  onDeleteForMe,
  onReport,
  onSenderClick,
  onVote,
  mentionNames,
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text ?? '');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (message.type === 'system') {
    return <p className="py-1 text-center text-xs text-text-muted">{message.text}</p>;
  }

  const reactionEntries = Object.entries(message.reactions).filter(
    ([, userIds]) => userIds.length > 0,
  );

  // Editability of *type* is a pure, render-time check. Whether the 15-minute
  // window has actually elapsed is checked at click time instead (an event
  // handler, not render) since it depends on the current wall-clock time.
  const isEditableType = isMine && !message.deleted && message.type === 'text';
  const canCopy = !message.deleted && message.type === 'text' && Boolean(message.text);
  const hasActions =
    !message.deleted && (onReply || onToggleReaction || isEditableType || onDeleteForMe);

  function startEdit() {
    const withinWindow = Date.now() - new Date(message.sentAt).getTime() <= MESSAGE_EDIT_WINDOW_MS;
    if (!withinWindow) {
      toast.error(en.chat.editWindowExpired);
      return;
    }
    setEditText(message.text ?? '');
    setIsEditing(true);
  }

  function saveEdit() {
    const text = editText.trim();
    if (!text || text === message.text) {
      setIsEditing(false);
      return;
    }
    onEdit?.(message.id, text);
    setIsEditing(false);
  }

  function handleCopy() {
    if (!message.text) return;
    navigator.clipboard?.writeText(message.text).then(() => toast.success(en.chat.messageCopied));
  }

  function handleReport() {
    onReport?.(message);
    toast.success(en.chat.messageReported);
  }

  return (
    <>
      <div className={cn('group flex items-end gap-2', isMine && 'flex-row-reverse')}>
        {!isMine && (
          <button
            type="button"
            onClick={() => onSenderClick?.(message.senderId)}
            disabled={!onSenderClick}
            className="shrink-0"
            aria-label={senderName}
          >
            <Avatar className="size-7">
              <AvatarImage src={senderAvatarUrl} alt="" />
              <AvatarFallback className="text-[10px]">{senderName.charAt(0)}</AvatarFallback>
            </Avatar>
          </button>
        )}

        <div className={cn('flex min-w-0 max-w-[75%] flex-col gap-1', isMine && 'items-end')}>
          {!isMine && (
            <button
              type="button"
              onClick={() => onSenderClick?.(message.senderId)}
              disabled={!onSenderClick}
              className="px-1 text-left text-xs font-medium text-text-secondary hover:underline"
            >
              {senderName}
            </button>
          )}

          <div className={cn('flex items-center gap-1', isMine && 'flex-row-reverse')}>
            <div
              className={cn(
                'break-words rounded-2xl px-3.5 py-2 text-sm',
                isMine
                  ? 'rounded-br-md bg-primary-600 text-text-inverse'
                  : 'rounded-bl-md bg-surface text-text-primary',
              )}
            >
              <MessageReplyPreview message={message} isMine={isMine} />

              {isEditing ? (
                <div className="flex min-w-48 items-center gap-1.5">
                  <Input
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                    className="h-8 text-sm text-text-primary"
                  />
                  <Button type="button" size="sm" className="h-8 px-2" onClick={saveEdit}>
                    {en.actions.save}
                  </Button>
                </div>
              ) : (
                <>
                  {!message.deleted && message.type === 'image' && (
                    <MessageImageAttachment
                      message={message}
                      onExpand={() => setLightboxOpen(true)}
                    />
                  )}
                  {!message.deleted && message.type === 'video' && (
                    <MessageVideoAttachment message={message} />
                  )}
                  {!message.deleted && message.type === 'document' && (
                    <MessageDocumentAttachment message={message} isMine={isMine} />
                  )}
                  {!message.deleted && message.type === 'voice' && (
                    <MessageVoiceAttachment message={message} isMine={isMine} />
                  )}
                  {!message.deleted && message.type === 'poll' && (
                    <PollMessageContent message={message} isMine={isMine} onVote={onVote} />
                  )}
                  {message.deleted && <>{messageBody(message)}</>}
                  {!message.deleted && message.type === 'text' && (
                    <>{linkifyMentions(message.text ?? '', mentionNames, isMine)}</>
                  )}
                  {message.edited && (
                    <span
                      className={cn(
                        'ml-1.5 text-[10px]',
                        isMine ? 'text-primary-100' : 'text-text-muted',
                      )}
                    >
                      ({en.chat.editedLabel})
                    </span>
                  )}
                </>
              )}
            </div>

            {hasActions && !isEditing && (
              <div className="flex shrink-0 items-center opacity-0 transition-opacity duration-fast group-hover:opacity-100">
                {onToggleReaction && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        aria-label={en.chat.addReaction}
                        title={en.chat.addReaction}
                      >
                        <SmilePlus className="size-3.5" aria-hidden="true" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1.5">
                      <div className="flex gap-1">
                        {QUICK_REACTIONS.map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => onToggleReaction(key)}
                            className="rounded-md p-1 text-lg hover:bg-surface"
                          >
                            {reactionGlyph(key)}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={en.hub.moreOptionsTooltip}
                      title={en.hub.moreOptionsTooltip}
                    >
                      <MoreHorizontal className="size-3.5" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isMine ? 'end' : 'start'}>
                    {onReply && (
                      <DropdownMenuItem onClick={() => onReply(message)}>
                        <Reply className="size-4" aria-hidden="true" />
                        {en.chat.reply}
                      </DropdownMenuItem>
                    )}
                    {canCopy && (
                      <DropdownMenuItem onClick={handleCopy}>
                        <Copy className="size-4" aria-hidden="true" />
                        {en.chat.copyText}
                      </DropdownMenuItem>
                    )}
                    {isEditableType && (
                      <DropdownMenuItem onClick={startEdit}>
                        <Pencil className="size-4" aria-hidden="true" />
                        {en.actions.edit}
                      </DropdownMenuItem>
                    )}
                    {isMine && onDeleteForMe && (
                      <DropdownMenuItem onClick={() => onDeleteForMe(message.id)}>
                        <Trash2 className="size-4" aria-hidden="true" />
                        {en.chat.deleteForMe}
                      </DropdownMenuItem>
                    )}
                    {isMine && onDeleteForEveryone && (
                      <DropdownMenuItem
                        className="text-error-500"
                        onClick={() => onDeleteForEveryone(message.id)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        {en.chat.deleteForEveryone}
                      </DropdownMenuItem>
                    )}
                    {!isMine && onDeleteForMe && (
                      <DropdownMenuItem onClick={() => onDeleteForMe(message.id)}>
                        <Trash2 className="size-4" aria-hidden="true" />
                        {en.chat.deleteForMe}
                      </DropdownMenuItem>
                    )}
                    {!isMine && (
                      <DropdownMenuItem className="text-error-500" onClick={handleReport}>
                        <Flag className="size-4" aria-hidden="true" />
                        {en.chat.reportMessage}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {reactionEntries.length > 0 && (
            <div className={cn('flex flex-wrap gap-1 px-1', isMine && 'justify-end')}>
              {reactionEntries.map(([emoji, userIds]) => {
                const isMineReaction = Boolean(currentUserId) && userIds.includes(currentUserId!);
                return (
                  <button
                    key={emoji}
                    type="button"
                    disabled={!onToggleReaction}
                    onClick={() => onToggleReaction?.(emoji)}
                    className={cn(
                      'flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs',
                      isMineReaction
                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                        : 'border-border bg-surface-raised text-text-secondary',
                    )}
                  >
                    <span>{reactionGlyph(emoji)}</span>
                    <span>{userIds.length}</span>
                  </button>
                );
              })}
            </div>
          )}

          <span className="flex items-center gap-1 px-1 text-[10px] text-text-muted">
            {formatTime(message.sentAt)}
            {isMine && !message.deleted && <MessageStatusTicks message={message} />}
          </span>
        </div>
      </div>

      {message.type === 'image' && (
        <MediaLightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          mediaUrl={message.mediaUrl}
          mediaType="image"
        />
      )}
    </>
  );
}
