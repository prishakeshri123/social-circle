import { Link, useNavigate } from 'react-router-dom';
import { Globe, Lock, Mail } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { CATEGORIES } from '@/shared/constants/categories';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import { useJoinClub } from '@/features/clubs/hooks/useJoinClub';
import type { Club } from '@/types/club.types';

const PRIVACY_LABEL: Record<Club['privacy'], string> = {
  public: en.clubLanding.publicPill,
  private: en.clubLanding.privatePill,
  invite_only: en.clubLanding.inviteOnlyPill,
};

const PRIVACY_ICON: Record<Club['privacy'], typeof Globe> = {
  public: Globe,
  private: Lock,
  invite_only: Mail,
};

interface ClubDetailsCardProps {
  club: Club;
  isMember: boolean;
}

export function ClubDetailsCard({ club, isMember }: ClubDetailsCardProps) {
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const joinMutation = useJoinClub(club.slug);
  const plan = club.pricingPlans?.[0];
  const categoryLabel = CATEGORIES.find((c) => c.slug === club.category)?.label ?? club.category;
  const PrivacyIcon = PRIVACY_ICON[club.privacy];

  const priceValue =
    club.type === 'free'
      ? en.payment.freeLabel
      : `${formatCurrency(plan?.price ?? 0, plan?.currency)}${plan ? en.clubLanding.billingCycleSuffix[plan.billingCycle] : ''}`;

  const rows = [
    { label: en.clubLanding.priceLabel, value: priceValue },
    {
      label: en.clubLanding.accessLabel,
      value: (
        <span className="flex items-center gap-1.5">
          <PrivacyIcon className="size-3.5" aria-hidden="true" />
          {PRIVACY_LABEL[club.privacy]}
        </span>
      ),
    },
    {
      label: en.clubLanding.approvalLabel,
      value:
        club.membershipApproval === 'auto'
          ? en.clubLanding.approvalAutoValue
          : en.clubLanding.approvalManualValue,
    },
    { label: en.clubLanding.membersLabel, value: club.memberCount.toLocaleString() },
    { label: en.clubLanding.categoryLabel, value: categoryLabel },
    { label: en.clubLanding.locationLabel, value: club.city ?? en.clubLanding.onlineLabel },
  ];

  function handleJoin() {
    if (club.type === 'free') {
      requireAuth('join', () => joinMutation.mutate(club.id));
    } else {
      requireAuth('buy', () => navigate(ROUTES.checkout(plan?.id ?? '')), {
        communitySlug: club.category,
      });
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-text-primary">{en.clubLanding.detailsTitle}</h2>

      <dl className="divide-y divide-border text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2.5">
            <dt className="text-text-secondary">{row.label}</dt>
            <dd className="font-medium text-text-primary">{row.value}</dd>
          </div>
        ))}
      </dl>

      {isMember ? (
        <Button asChild className="w-full">
          <Link to={ROUTES.clubDashboard(club.slug)}>{en.clubLanding.alreadyMemberCta}</Link>
        </Button>
      ) : club.type === 'free' ? (
        <Button className="w-full" onClick={handleJoin} disabled={joinMutation.isPending}>
          {en.discovery.joinFreeCta}
        </Button>
      ) : (
        <Button className="w-full" onClick={handleJoin}>
          {en.discovery.buyMembershipCta(formatCurrency(plan?.price ?? 0, plan?.currency))}
        </Button>
      )}

      <Button asChild variant="outline" className="w-full">
        <Link to={ROUTES.contact}>{en.clubLanding.haveQuestionCta}</Link>
      </Button>
    </div>
  );
}
