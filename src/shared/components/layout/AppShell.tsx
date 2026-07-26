import { Outlet } from 'react-router-dom';
import { TopBar } from '@/shared/components/layout/TopBar';
import { BottomTabBar } from '@/shared/components/layout/BottomTabBar';
import { useAuth } from '@/shared/hooks/useAuth';

export function AppShell() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      {isAuthenticated && <BottomTabBar />}
    </div>
  );
}
