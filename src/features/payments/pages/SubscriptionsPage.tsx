import { Helmet } from 'react-helmet-async';
import { CalendarClock, CreditCard, Wallet } from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { en } from '@/shared/constants/locales/en';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { useSubscriptions } from '@/features/payments/hooks/useSubscriptions';
import { useTransactions } from '@/features/payments/hooks/useTransactions';
import { SubscriptionCard } from '@/features/payments/components/SubscriptionCard';
import { TransactionHistoryTable } from '@/features/payments/components/TransactionHistoryTable';
import type { LucideIcon } from 'lucide-react';

interface SummaryTileProps {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: string;
}

function SummaryTile({ icon: Icon, iconClassName, label, value }: SummaryTileProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl',
            iconClassName,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="truncate text-2xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
    </Card>
  );
}

export function SubscriptionsPage() {
  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();
  const myClubsQuery = useMyClubs();
  const subscriptionsQuery = useSubscriptions();
  const transactionsQuery = useTransactions();

  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  const clubs = myClubsQuery.data ?? [];
  const subscriptions = subscriptionsQuery.data ?? [];
  const transactions = transactionsQuery.data?.data ?? [];
  const isLoadingSubscriptions = subscriptionsQuery.isPending || myClubsQuery.isPending;

  const activeSubscriptionsCount = subscriptions.filter((s) => s.status === 'active').length;

  const successfulTransactions = transactions.filter((t) => t.status === 'success');
  const totalSpent = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalSpentLabel = formatCurrency(totalSpent, successfulTransactions[0]?.currency ?? 'INR');

  const upcomingRenewal = subscriptions
    .filter((s) => s.status === 'active' && !s.cancelAtPeriodEnd)
    .sort(
      (a, b) => new Date(a.currentPeriodEnd).getTime() - new Date(b.currentPeriodEnd).getTime(),
    )[0];
  const nextRenewalLabel = upcomingRenewal
    ? formatDate(upcomingRenewal.currentPeriodEnd)
    : en.payment.noUpcomingRenewal;

  return (
    <div className="flex items-start">
      <Helmet>
        <title>{en.payment.title} | Social Circle</title>
      </Helmet>

      <Sidebar
        unreadChatsCount={unreadChatsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 md:flex"
      />

      <div className="auth-neon min-w-0 flex-1 space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{en.payment.title}</h1>
          <p className="mt-1 text-sm text-text-secondary">{en.payment.subtitle}</p>
        </div>

        {!isLoadingSubscriptions && subscriptions.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryTile
              icon={CreditCard}
              iconClassName="bg-primary-100 text-primary-600"
              label={en.payment.statActiveSubscriptions}
              value={String(activeSubscriptionsCount)}
            />
            <SummaryTile
              icon={Wallet}
              iconClassName="bg-success-100 text-success-500"
              label={en.payment.statTotalSpent}
              value={totalSpentLabel}
            />
            <SummaryTile
              icon={CalendarClock}
              iconClassName="bg-info-100 text-info-500"
              label={en.payment.statNextRenewal}
              value={nextRenewalLabel}
            />
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">{en.nav.subscriptions}</h2>

          {isLoadingSubscriptions && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="space-y-4 p-6">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoadingSubscriptions && subscriptions.length === 0 && (
            <EmptyState icon={CreditCard} title={en.empty.noSubscriptions} />
          )}

          {!isLoadingSubscriptions && subscriptions.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  club={clubs.find((c) => c.id === subscription.clubId)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <TransactionHistoryTable
            transactions={transactions}
            isLoading={transactionsQuery.isPending}
          />
        </section>
      </div>
    </div>
  );
}
