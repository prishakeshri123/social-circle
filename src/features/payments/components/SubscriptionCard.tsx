import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge, type BadgeProps } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/Dialog';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { en } from '@/shared/constants/locales/en';
import {
  BILLING_CYCLE_LABELS,
  SUBSCRIPTION_EXPIRING_SOON_DAYS,
} from '@/shared/constants/app.constants';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';
import { useCancelSubscription } from '@/features/payments/hooks/useCancelSubscription';
import type { Subscription } from '@/types/payment.types';
import type { MyClub } from '@/types/club.types';

interface SubscriptionCardProps {
  subscription: Subscription;
  club: MyClub | undefined;
}

interface DisplayStatus {
  label: string;
  variant: NonNullable<BadgeProps['variant']>;
}

function getDisplayStatus(subscription: Subscription): DisplayStatus {
  if (subscription.cancelAtPeriodEnd) {
    return { label: en.payment.statusCancelled, variant: 'secondary' };
  }
  if (subscription.status === 'cancelled') {
    return { label: en.payment.statusCancelled, variant: 'secondary' };
  }
  if (subscription.status === 'expired') {
    return { label: en.payment.statusExpired, variant: 'error' };
  }
  if (subscription.status === 'trialing') {
    return { label: en.payment.statusTrialing, variant: 'info' };
  }
  const daysUntilRenewal = Math.ceil(
    (new Date(subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (daysUntilRenewal <= SUBSCRIPTION_EXPIRING_SOON_DAYS) {
    return { label: en.payment.statusExpiringSoon, variant: 'warning' };
  }
  return { label: en.payment.statusActive, variant: 'success' };
}

export function SubscriptionCard({ subscription, club }: SubscriptionCardProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const cancelSubscription = useCancelSubscription();

  const plan = club?.pricingPlans?.find((p) => p.id === subscription.planId);
  const displayStatus = getDisplayStatus(subscription);
  const canCancel = !subscription.cancelAtPeriodEnd && subscription.status === 'active';
  const accessUntilDate = formatDate(subscription.currentPeriodEnd);

  function handleConfirmCancel() {
    cancelSubscription.mutate(subscription.id, {
      onSuccess: () => setDialogOpen(false),
    });
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={club?.logoUrl} alt="" />
              <AvatarFallback>{(club?.name ?? '?').charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-text-primary">{club?.name ?? '—'}</p>
              <p className="text-sm text-text-secondary">
                {plan?.name ?? en.payment.currentPlanTitle}
              </p>
            </div>
          </div>
          <Badge variant={displayStatus.variant}>{displayStatus.label}</Badge>
        </div>

        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <div>
            <p className="text-lg font-bold text-text-primary">
              {plan ? formatCurrency(plan.price, plan.currency) : '—'}
              {plan && (
                <span className="ml-1 text-sm font-normal text-text-secondary">
                  / {BILLING_CYCLE_LABELS[plan.billingCycle]}
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {subscription.cancelAtPeriodEnd
                ? en.payment.accessUntil(accessUntilDate)
                : en.payment.renewsOn(accessUntilDate)}
            </p>
          </div>

          {canCancel && (
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  {en.payment.cancelSub}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{en.payment.cancelSub}</DialogTitle>
                  <DialogDescription>
                    {en.payment.cancelConfirm} {accessUntilDate}.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    {en.payment.keepSubscription}
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={cancelSubscription.isPending}
                    onClick={handleConfirmCancel}
                  >
                    <CreditCard className="size-4" aria-hidden="true" />
                    {en.payment.cancelSub}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
