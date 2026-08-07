import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { en } from '@/shared/constants/locales/en';
import { TRANSPARENT_HEADER_SCROLL_THRESHOLD_PX } from '@/shared/constants/app.constants';
import { useAuthStore } from '@/store/authSlice';
import { useScrolled } from '@/shared/hooks/useScrolled';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Logo } from '@/shared/components/layout/Logo';
import { cn } from '@/shared/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';
import { Sheet, SheetContent, SheetTitle } from '@/shared/components/ui/Sheet';

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
              'hidden rounded-md sm:inline-flex',
              transparent && 'border-white/40 bg-transparent text-white hover:bg-white/10',
            )}
            asChild
          >
            <Link to={ROUTES.login}>{en.nav.signIn}</Link>
          </Button>
          <Button className="hidden rounded-md sm:inline-flex" asChild>
            <Link to={ROUTES.signup}>{en.nav.joinCreateAccount}</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn('rounded-full sm:hidden', transparent && 'text-white hover:bg-white/10')}
            aria-label={en.nav.openMenu}
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="right" className="flex flex-col gap-6">
          <SheetTitle className="sr-only">{en.nav.openMenu}</SheetTitle>
          <Logo />

          <nav className="flex flex-col gap-1 text-base font-medium text-text-secondary">
            {GUEST_NAV_LINKS.map((link) => {
              const isActive =
                link.to === ROUTES.home ? currentPath === ROUTES.home : currentPath === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-2 transition-colors duration-fast hover:bg-surface-raised hover:text-text-primary',
                    isActive && 'bg-primary-50 text-primary-600',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            <Button variant="outline" className="rounded-md" asChild>
              <Link to={ROUTES.login} onClick={() => setMobileNavOpen(false)}>
                {en.nav.signIn}
              </Link>
            </Button>
            <Button className="rounded-md" asChild>
              <Link to={ROUTES.signup} onClick={() => setMobileNavOpen(false)}>
                {en.nav.joinCreateAccount}
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

function MemberTopBar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [searchValue, setSearchValue] = useState('');

  const conversationsQuery = useConversations();
  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  const notificationsQuery = useNotifications();
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.login);
  };

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = searchValue.trim();
    navigate(trimmed ? `${ROUTES.search}?q=${encodeURIComponent(trimmed)}` : ROUTES.search);
  }

  return (
    <header className={cn(HEADER_BASE_CLASS, 'border-b border-border bg-background')}>
      <div className="flex w-full items-center justify-between gap-4">
        <Logo />

        <form onSubmit={handleSearchSubmit} className="hidden max-w-md flex-1 sm:block">
          <label className="relative block">
            <span className="sr-only">{en.home.searchPlaceholder}</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder={en.home.searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="rounded-full pl-9"
            />
          </label>
        </form>

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
              {unreadNotificationsCount > 0 && (
                <Badge
                  variant="error"
                  className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
                >
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            asChild
            aria-label={en.nav.chats}
          >
            <Link to={ROUTES.messages} className="relative">
              <MessageCircle className="size-5" />
              {unreadChatsCount > 0 && (
                <Badge
                  variant="error"
                  className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
                >
                  {unreadChatsCount > 9 ? '9+' : unreadChatsCount}
                </Badge>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-1 flex cursor-pointer items-center gap-2 rounded-full ring-offset-2 ring-offset-background transition-shadow duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={en.nav.profile}
              >
                <Avatar>
                  <AvatarImage src={user?.avatarUrl} alt={user?.fullName ?? ''} />
                  <AvatarFallback>{user?.fullName?.charAt(0) ?? '?'}</AvatarFallback>
                </Avatar>
                <span className="hidden text-left leading-tight lg:block">
                  <span className="block text-sm font-medium text-text-primary">
                    {user?.fullName}
                  </span>
                  <span className="block text-xs text-text-muted">{en.nav.profile}</span>
                </span>
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
