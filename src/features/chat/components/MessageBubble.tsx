import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { en } from '@/shared/constants/locales/en';
import { formatTime } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';
import type { ChatMessage } from '@/types/chat.types';

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  senderName: string;
  senderAvatarUrl?: string;
}

function messageBody(message: ChatMessage): string {
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

export function MessageBubble({
  message,
  isMine,
  senderName,
  senderAvatarUrl,
}: MessageBubbleProps) {
  if (message.type === 'system') {
    return <p className="py-1 text-center text-xs text-text-muted">{message.text}</p>;
  }

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
          {messageBody(message)}
          {message.edited && (
            <span
              className={cn('ml-1.5 text-[10px]', isMine ? 'text-primary-100' : 'text-text-muted')}
            >
              ({en.chat.editedLabel})
            </span>
          )}
        </div>

        <span className="px-1 text-[10px] text-text-muted">{formatTime(message.sentAt)}</span>
      </div>
    </div>
  );
}
