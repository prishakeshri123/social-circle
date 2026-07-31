import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { en } from '@/shared/constants/locales/en';
import { TRANSPARENT_HEADER_SCROLL_THRESHOLD_PX } from '@/shared/constants/app.constants';
import { useAuthStore } from '@/store/authSlice';
import { useUiStore } from '@/store/uiSlice';
import { useScrolled } from '@/shared/hooks/useScrolled';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Logo } from '@/shared/components/layout/Logo';
import { cn } from '@/shared/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';

const GUEST_NAV_LINKS = [
  { to: ROUTES.home, label: en.nav.home },
  { to: ROUTES.clubs, label: en.nav.clubs },
  { to: ROUTES.events, label: en.nav.events },
  { to: ROUTES.services, label: en.nav.services },
  { to: ROUTES.about, label: en.nav.about },
  { to: ROUTES.contact, label: en.nav.contact },
] as const;

const HEADER_BASE_CLASS =
  'fixed inset-x-0 top-0 z-raised isolate flex h-16 shrink-0 items-center px-4 transition-colors duration-normal will-change-transform sm:px-6';

function GuestTopBar() {
  const { pathname, hash } = useLocation();
  const scrolled = useScrolled(TRANSPARENT_HEADER_SCROLL_THRESHOLD_PX);
  const transparent = pathname === ROUTES.home && !scrolled;
  // NavLink's isActive ignores the hash, which would make both "Home" (/) and
  // "Clubs" (/#browse-clubs) light up together — so match path+hash manually.
  const currentPath = `${pathname}${hash}`;

  return (
    <header
      className={cn(
        HEADER_BASE_CLASS,
        transparent
          ? 'border-b border-transparent bg-transparent backdrop-blur-[2px]'
          : 'border-b border-border bg-background',
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between">
        <Logo onDark={transparent} />

        <nav
          className={cn(
            'hidden items-center gap-6 text-sm font-medium sm:flex',
            transparent
              ? 'text-neutral-200 [text-shadow:0_1px_6px_rgb(0_0_0_/_0.5)]'
              : 'text-text-secondary',
          )}
        >
          {GUEST_NAV_LINKS.map((link) => {
            const isActive =
              link.to === ROUTES.home ? currentPath === ROUTES.home : currentPath === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'border-b-2 border-transparent pb-1 transition-colors duration-fast',
                  transparent ? 'hover:text-white' : 'hover:text-text-primary',
                  isActive && [
                    'border-primary-500',
                    transparent ? 'text-white' : 'text-text-primary',
                  ],
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className={cn(
              'rounded-md',
              transparent && 'border-white/40 bg-transparent text-white hover:bg-white/10',
            )}
            asChild
          >
            <Link to={ROUTES.login}>{en.nav.signIn}</Link>
          </Button>
          <Button className="rounded-md" asChild>
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
    <header className={cn(HEADER_BASE_CLASS, 'border-b border-border bg-background')}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Logo />

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
