import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from '@/shared/components/layout/TopBar';
import { BottomTabBar } from '@/shared/components/layout/BottomTabBar';
import { ScrollManager } from '@/shared/components/layout/ScrollManager';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { useAuth } from '@/shared/hooks/useAuth';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/utils/cn';

export function AppShell() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  // The home hero renders full-bleed behind the transparent guest header, so it
  // supplies its own top spacing instead of the usual fixed-header offset.
  const hasTransparentHero = !isAuthenticated && pathname === ROUTES.home;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollManager />
      <TopBar />
      <main className={cn('flex-1 pb-16 md:pb-0', !hasTransparentHero && 'pt-16')}>
        <Suspense fallback={<LoadingSpinner className="min-h-[50vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      {isAuthenticated && <BottomTabBar />}
    </div>
  );
}
