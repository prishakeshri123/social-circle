import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/utils/cn';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import { useJoinClub } from '@/features/clubs/hooks/useJoinClub';
import type { Club } from '@/types/club.types';

interface ClubStickyMobileBarProps {
  club: Club;
  isMember?: boolean;
}

export function ClubStickyMobileBar({ club, isMember }: ClubStickyMobileBarProps) {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const joinMutation = useJoinClub(club.slug);
  const plan = club.pricingPlans?.[0];

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      setVisible(currentY > 200 && currentY > lastScrollY.current);
      lastScrollY.current = currentY;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ctaLabel = isMember
    ? en.clubLanding.alreadyMemberCta
    : club.type === 'free'
      ? en.discovery.joinFreeCta
      : en.discovery.joinCta;

  function handleClick() {
    if (isMember) {
      navigate(ROUTES.clubDashboard(club.slug));
      return;
    }
    if (club.type === 'free') {
      requireAuth('join', () => joinMutation.mutate(club.id));
    } else {
      requireAuth('buy', () => navigate(ROUTES.checkout(plan?.id ?? '')), {
        communitySlug: club.category,
      });
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-raised flex items-center justify-between gap-3 border-t border-border bg-surface-raised px-4 py-3 shadow-modal transition-transform duration-normal md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <span className="truncate text-sm font-medium text-text-primary">{club.name}</span>
      <Button size="sm" onClick={handleClick} disabled={joinMutation.isPending}>
        {ctaLabel}
      </Button>
    </div>
  );
}
