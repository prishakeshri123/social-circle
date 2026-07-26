import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Settings, Sparkles, User as UserIcon } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { en } from '@/shared/constants/locales/en';
import { useAuthStore } from '@/store/authSlice';
import { useUiStore } from '@/store/uiSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';

const GUEST_NAV_LINKS = [
  { to: ROUTES.home, label: en.nav.explore },
  { to: ROUTES.search, label: en.nav.events },
  { to: ROUTES.about, label: en.nav.about },
  { to: ROUTES.services, label: en.nav.services },
  { to: ROUTES.contact, label: en.nav.contact },
] as const;

function Wordmark() {
  return (
    <Link to={ROUTES.home} className="flex items-center gap-1.5 text-lg font-semibold">
      <Sparkles className="size-4 text-primary-500" aria-hidden="true" />
      <span className="gradient-text">{en.app.name}</span>
    </Link>
  );
}

function GuestTopBar() {
  return (
    <header className="sticky top-0 z-raised isolate flex h-16 shrink-0 items-center border-b border-border bg-background px-4 will-change-transform sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Wordmark />

        <nav className="hidden items-center gap-6 text-sm font-medium text-text-secondary sm:flex">
          {GUEST_NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.home}
              className={({ isActive }) =>
                cn(
                  'transition-colors duration-fast hover:text-text-primary',
                  isActive && 'text-text-primary',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-full" asChild>
            <Link to={ROUTES.login}>{en.nav.signIn}</Link>
          </Button>
          <Button className="rounded-full" asChild>
            <Link to={ROUTES.signup}>{en.nav.joinCreateAccount}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function MemberTopBar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const badgeCount = useUiStore((state) => state.notificationBadgeCount);

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.login);
  };

  return (
    <header className="sticky top-0 z-raised isolate flex h-16 shrink-0 items-center border-b border-border bg-background px-4 will-change-transform sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Wordmark />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            asChild
            aria-label={en.nav.notifications}
          >
            <Link to={ROUTES.notifications} className="relative">
              <Bell className="size-5" />
              {badgeCount > 0 && (
                <Badge
                  variant="error"
                  className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
                >
                  {badgeCount > 9 ? '9+' : badgeCount}
                </Badge>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-1 rounded-full ring-offset-2 ring-offset-background transition-shadow duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={en.nav.profile}
              >
                <Avatar>
                  <AvatarImage src={user?.avatarUrl} alt={user?.fullName ?? ''} />
                  <AvatarFallback>{user?.fullName?.charAt(0) ?? '?'}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={ROUTES.profile(user?.id ?? '')}>
                  <UserIcon className="mr-2 size-4" />
                  {en.nav.profile}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={ROUTES.settings}>
                  <Settings className="mr-2 size-4" />
                  {en.nav.settings}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 size-4" />
                {en.nav.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function TopBar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <MemberTopBar /> : <GuestTopBar />;
}
