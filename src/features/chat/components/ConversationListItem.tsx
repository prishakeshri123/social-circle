import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { CONVERSATION_LIST_BADGE_MAX } from '@/shared/constants/app.constants';
import { cn } from '@/shared/utils/cn';
import { CategoryIconBadge } from '@/features/clubs/components/CategoryIconBadge';

interface ConversationListItemProps {
  kind: 'direct' | 'group' | 'club';
  avatarUrl?: string;
  avatarFallback: string;
  category?: string;
  title: string;
  subtitle: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationListItem({
  kind,
  avatarUrl,
  avatarFallback,
  category,
  title,
  subtitle,
  timestamp,
  unreadCount = 0,
  isOnline,
  isSelected,
  onClick,
}: ConversationListItemProps) {
  const isSquare = kind !== 'direct';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-fast',
        isSelected ? 'bg-primary-50' : 'hover:bg-surface',
      )}
    >
      <div className="relative shrink-0">
        {isSquare ? (
          category ? (
            <CategoryIconBadge category={category} className="size-11 ring-0" />
          ) : (
            <div className="gradient-bg flex size-11 items-center justify-center overflow-hidden rounded-2xl text-text-inverse">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              )}
            </div>
          )
        ) : (
          <Avatar className="size-11 rounded-2xl">
            <AvatarImage src={avatarUrl} alt="" className="rounded-2xl" />
            <AvatarFallback className="rounded-2xl">{avatarFallback}</AvatarFallback>
          </Avatar>
        )}
        {kind === 'direct' && isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface-raised bg-success-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-text-primary">{title}</p>
          {timestamp && <span className="shrink-0 text-xs text-text-muted">{timestamp}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-text-secondary">{subtitle}</p>
          {unreadCount > 0 && (
            <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full p-0 text-[10px]">
              {unreadCount > CONVERSATION_LIST_BADGE_MAX
                ? `${CONVERSATION_LIST_BADGE_MAX}+`
                : unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
