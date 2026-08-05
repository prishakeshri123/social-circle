import { Download, FileText, Mic } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { en } from '@/shared/constants/locales/en';
import { formatFileSize } from '@/shared/utils/formatFileSize';
import { formatTime } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';
import { reactionGlyph } from '@/features/chat/utils/reactionEmoji';
import type { ChatMessage } from '@/types/chat.types';

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  senderName: string;
  senderAvatarUrl?: string;
  currentUserId?: string;
  onToggleReaction?: (emoji: string) => void;
}

function messageBody(message: ChatMessage): string {
  if (message.deleted) return en.hub.messageTypeDeleted;
  switch (message.type) {
    case 'text':
      return message.text ?? '';
    case 'poll':
      return en.hub.messageTypePoll(message.poll?.question ?? '');
    default:
      return message.text ?? '';
  }
}

function fileTypeLabel(mediaType?: string): string {
  if (!mediaType) return '';
  const subtype = mediaType.split('/')[1] ?? mediaType;
  return subtype.toUpperCase();
}

function MessageImageAttachment({ message }: { message: ChatMessage }) {
  return (
    <div className="space-y-1.5">
      <img
        src={message.mediaThumbnailUrl ?? message.mediaUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="max-h-72 w-full rounded-xl object-cover"
      />
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

function MessageVoiceAttachment({ isMine }: { isMine: boolean }) {
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
}: MessageBubbleProps) {
  if (message.type === 'system') {
    return <p className="py-1 text-center text-xs text-text-muted">{message.text}</p>;
  }

  const reactionEntries = Object.entries(message.reactions).filter(
    ([, userIds]) => userIds.length > 0,
  );

  return (
    <div className={cn('flex items-end gap-2', isMine && 'flex-row-reverse')}>
      {!isMine && (
        <Avatar className="size-7 shrink-0">
          <AvatarImage src={senderAvatarUrl} alt="" />
          <AvatarFallback className="text-[10px]">{senderName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex min-w-0 max-w-[75%] flex-col gap-1', isMine && 'items-end')}>
        {!isMine && (
          <span className="px-1 text-xs font-medium text-text-secondary">{senderName}</span>
        )}

        <div
          className={cn(
            'break-words rounded-2xl px-3.5 py-2 text-sm',
            isMine
              ? 'rounded-br-md bg-primary-600 text-text-inverse'
              : 'rounded-bl-md bg-surface text-text-primary',
          )}
        >
          {!message.deleted && message.type === 'image' && (
            <MessageImageAttachment message={message} />
          )}
          {!message.deleted && message.type === 'video' && (
            <MessageVideoAttachment message={message} />
          )}
          {!message.deleted && message.type === 'document' && (
            <MessageDocumentAttachment message={message} isMine={isMine} />
          )}
          {!message.deleted && message.type === 'voice' && (
            <MessageVoiceAttachment isMine={isMine} />
          )}
          {(message.deleted || message.type === 'text' || message.type === 'poll') && (
            <>{messageBody(message)}</>
          )}
          {message.edited && (
            <span
              className={cn('ml-1.5 text-[10px]', isMine ? 'text-primary-100' : 'text-text-muted')}
            >
              ({en.chat.editedLabel})
            </span>
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

        <span className="px-1 text-[10px] text-text-muted">{formatTime(message.sentAt)}</span>
      </div>
    </div>
  );
}
