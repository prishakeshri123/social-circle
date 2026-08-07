import { NavLink } from 'react-router-dom';
import {
  Bell,
  Bookmark,
  Calendar,
  CreditCard,
  Home,
  MessageCircle,
  Settings,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { en } from '@/shared/constants/locales/en';
import { Badge } from '@/shared/components/ui/Badge';
import { cn } from '@/shared/utils/cn';

interface SidebarNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: number;
}

interface SidebarProps {
  unreadChatsCount?: number;
  unreadNotificationsCount?: number;
  pendingInvitationsCount?: number;
  className?: string;
}

export function Sidebar({
  unreadChatsCount = 0,
  unreadNotificationsCount = 0,
  pendingInvitationsCount = 0,
  className,
}: SidebarProps) {
  const items: SidebarNavItem[] = [
    { to: ROUTES.home, label: en.nav.home, icon: Home, end: true },
    { to: ROUTES.myClubs, label: en.nav.myClubs, icon: Users },
    { to: ROUTES.messages, label: en.nav.chats, icon: MessageCircle, badge: unreadChatsCount },
    { to: ROUTES.myEvents, label: en.nav.eventsAndMeetings, icon: Calendar },
    {
      to: ROUTES.notifications,
      label: en.nav.notifications,
      icon: Bell,
      badge: unreadNotificationsCount,
    },
    { to: ROUTES.payments, label: en.nav.payments, icon: CreditCard },
    {
      to: ROUTES.invitations,
      label: en.nav.invitations,
      icon: UserPlus,
      badge: pendingInvitationsCount,
    },
    { to: ROUTES.savedClubs, label: en.nav.savedClubs, icon: Bookmark },
    { to: ROUTES.settings, label: en.nav.settings, icon: Settings },
  ];

  return (
    <aside className={cn('flex flex-col border-r border-border bg-surface-raised', className)}>
      <nav className="flex flex-col gap-1 overflow-y-auto p-3" aria-label={en.nav.home}>
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-fast',
                isActive
                  ? 'bg-[image:var(--gradient-brand)] text-text-inverse shadow-sm shadow-primary-500/25'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary',
              )
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </span>
            {Boolean(badge) && (
              <Badge variant="error" className="h-5 min-w-[20px] justify-center px-1.5">
                {badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
