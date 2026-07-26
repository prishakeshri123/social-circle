import { NavLink, Navigate, Outlet, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { useClub } from '@/features/clubs/hooks/useClub';
import { useMyMembership } from '@/features/clubs/hooks/useMyMembership';
import type { ClubDashboardContext } from '@/features/clubs/hooks/useClubDashboardContext';
import { cn } from '@/shared/utils/cn';

const TAB_ITEMS = [
  { to: 'chat', label: en.tabs.chat, paidOnly: false },
  { to: 'events', label: en.tabs.events, paidOnly: false },
  { to: 'albums', label: en.tabs.albums, paidOnly: false },
  { to: 'members', label: en.tabs.members, paidOnly: false },
  { to: 'about', label: en.tabs.about, paidOnly: false },
  { to: 'payments', label: en.tabs.payments, paidOnly: true },
] as const;

export function ClubDashboardLayout() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data: club, isPending: clubPending, isError: clubError } = useClub(slug);
  const {
    data: membership,
    isPending: membershipPending,
    isError: membershipError,
  } = useMyMembership(club?.id ?? '');

  if (clubPending) return <LoadingSpinner className="min-h-[50vh]" />;

  if (clubError || !club) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState title={en.clubLanding.notFoundTitle} />
      </div>
    );
  }

  if (membershipPending) return <LoadingSpinner className="min-h-[50vh]" />;

  if (membershipError || !membership || membership.status !== 'active') {
    return <Navigate to={ROUTES.clubLanding(slug)} replace />;
  }

  const context: ClubDashboardContext = { club, membership, role: membership.role };
  const tabs = TAB_ITEMS.filter((tab) => !tab.paidOnly || club.type === 'paid');

  return (
    <div className="flex min-h-[70vh] flex-col">
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <NavLink
            to={ROUTES.clubLanding(slug)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary-600"
            aria-label={en.dashboard.backToClubPage}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </NavLink>
          <Avatar className="size-8">
            <AvatarImage src={club.logoUrl} alt="" />
            <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="min-w-0 truncate text-base font-semibold text-text-primary">
            {club.name}
          </h1>
        </div>

        <nav
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4"
          aria-label={en.tabs.chat}
        >
          {tabs.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors duration-fast',
                  isActive
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-text-secondary hover:text-text-primary',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="min-h-0 flex-1">
        <Outlet context={context} />
      </div>
    </div>
  );
}
