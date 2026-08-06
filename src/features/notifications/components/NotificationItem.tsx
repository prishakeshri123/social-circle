import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  NOTIFICATION_TONE_CLASSES,
  NOTIFICATION_TYPE_CONFIG,
} from '@/features/notifications/constants/notificationTypeConfig';
import { formatRelativeTime } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';
import type { Notification } from '@/types/user.types';

interface NotificationItemProps {
  notification: Notification;
  onRead: (notificationId: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const navigate = useNavigate();
  const { icon: Icon, tone } = NOTIFICATION_TYPE_CONFIG[notification.type];

  function handleClick() {
    if (!notification.read) onRead(notification.id);
    if (notification.deepLink) navigate(notification.deepLink);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-fast',
        notification.read ? 'hover:bg-surface' : 'bg-primary-50/60 hover:bg-primary-50',
      )}
    >
      <div
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-2xl',
          NOTIFICATION_TONE_CLASSES[tone],
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'truncate text-sm',
              notification.read
                ? 'font-medium text-text-secondary'
                : 'font-semibold text-text-primary',
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="size-2 shrink-0 rounded-full bg-primary-600" aria-hidden="true" />
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-text-secondary">{notification.body}</p>
        <p className="mt-1 text-xs text-text-muted">{formatRelativeTime(notification.createdAt)}</p>
      </div>

      <ChevronRight className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
    </button>
  );
}
