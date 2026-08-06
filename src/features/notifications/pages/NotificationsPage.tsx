import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bell, Calendar, CreditCard, LayoutGrid, Users, type LucideIcon } from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Button } from '@/shared/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { en } from '@/shared/constants/locales/en';
import { PAGE_SIZE_NOTIFICATIONS } from '@/shared/constants/app.constants';
import { cn } from '@/shared/utils/cn';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useMarkNotificationAsRead } from '@/features/notifications/hooks/useMarkNotificationAsRead';
import { useMarkAllNotificationsRead } from '@/features/notifications/hooks/useMarkAllNotificationsRead';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { NotificationItemSkeleton } from '@/features/notifications/components/NotificationItemSkeleton';
import { NOTIFICATION_TYPE_CONFIG } from '@/features/notifications/constants/notificationTypeConfig';
import type { NotificationCategory } from '@/features/notifications/constants/notificationTypeConfig';

type CategoryFilter = 'all' | NotificationCategory;

const CATEGORY_TABS: { value: CategoryFilter; label: string; icon: LucideIcon }[] = [
  { value: 'all', label: en.notifications.filterAll, icon: LayoutGrid },
  { value: 'club_activity', label: en.notifications.filterClubActivity, icon: Users },
  { value: 'events', label: en.notifications.filterEvents, icon: Calendar },
  { value: 'payments', label: en.notifications.filterPayments, icon: CreditCard },
  { value: 'system', label: en.notifications.filterSystem, icon: Bell },
];

export function NotificationsPage() {
  const [category, setCategory] = useState<CategoryFilter>('all');

  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications(PAGE_SIZE_NOTIFICATIONS);
  const invitationsQuery = useInvitations();
  const markAsRead = useMarkNotificationAsRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const notifications = notificationsQuery.data ?? [];
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  const filtered =
    category === 'all'
      ? notifications
      : notifications.filter((n) => NOTIFICATION_TYPE_CONFIG[n.type].category === category);

  const activeTabLabel = CATEGORY_TABS.find((t) => t.value === category)?.label ?? '';

  const unreadCountByCategory: Record<CategoryFilter, number> = {
    all: unreadNotificationsCount,
    club_activity: 0,
    events: 0,
    payments: 0,
    system: 0,
  };
  notifications
    .filter((n) => !n.read)
    .forEach((n) => {
      unreadCountByCategory[NOTIFICATION_TYPE_CONFIG[n.type].category] += 1;
    });

  return (
    <div className="flex items-start">
      <Helmet>
        <title>{en.notifications.title} | Social Circle</title>
      </Helmet>

      <Sidebar
        unreadChatsCount={unreadChatsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 md:flex"
      />

      <div className="min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{en.notifications.title}</h1>
            <p className="mt-1 text-sm text-text-secondary">{en.notifications.subtitle}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={unreadNotificationsCount === 0 || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            {en.notifications.markAllRead}
          </Button>
        </div>

        <Tabs value={category} onValueChange={(v) => setCategory(v as CategoryFilter)}>
          <TabsList className="w-full justify-start sm:w-fit">
            {CATEGORY_TABS.map((tab) => {
              const isActive = category === tab.value;
              const unread = unreadCountByCategory[tab.value];
              return (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <tab.icon className="size-4" aria-hidden="true" />
                  {tab.label}
                  {unread > 0 && (
                    <span
                      className={cn(
                        'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
                        isActive
                          ? 'bg-white/25 text-text-inverse'
                          : 'bg-primary-100 text-primary-700',
                      )}
                    >
                      {unread}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {notificationsQuery.isPending && (
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <NotificationItemSkeleton key={i} />
            ))}
          </div>
        )}

        {!notificationsQuery.isPending && filtered.length === 0 && (
          <EmptyState
            icon={Bell}
            title={
              category === 'all'
                ? en.empty.noNotifications
                : en.notifications.emptyCategory(activeTabLabel)
            }
          />
        )}

        {!notificationsQuery.isPending && filtered.length > 0 && (
          <div className="space-y-1">
            {filtered.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={(id) => markAsRead.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
