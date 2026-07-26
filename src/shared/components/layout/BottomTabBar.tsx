import { NavLink } from 'react-router-dom';
import { Bell, Users } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { en } from '@/shared/constants/locales/en';
import { cn } from '@/shared/utils/cn';

const TAB_ITEMS = [
  { to: ROUTES.myClubs, label: en.nav.myClubs, icon: Users },
  { to: ROUTES.notifications, label: en.nav.notifications, icon: Bell },
] as const;

export function BottomTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-raised flex border-t border-border bg-surface-raised md:hidden"
      aria-label={en.nav.home}
    >
      {TAB_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-xs',
              isActive ? 'text-primary-600' : 'text-text-muted',
            )
          }
        >
          <Icon className="size-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
