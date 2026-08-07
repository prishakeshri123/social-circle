import {
  NOTIFICATION_TONE_CLASSES,
  NOTIFICATION_TYPE_CONFIG,
} from '@/features/notifications/constants/notificationTypeConfig';
import { formatRelativeTime } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';
import type { Notification } from '@/types/user.types';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { icon: Icon, tone } = NOTIFICATION_TYPE_CONFIG[notification.type];

  return (
    <div
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3.5',
        !notification.read && 'bg-primary-50/60',
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
            <span
              className="size-2 shrink-0 rounded-full bg-[image:var(--gradient-brand)]"
              aria-hidden="true"
            />
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-text-secondary">{notification.body}</p>
        <p className="mt-1 text-xs text-text-muted">{formatRelativeTime(notification.createdAt)}</p>
      </div>
    </div>
  );
}
