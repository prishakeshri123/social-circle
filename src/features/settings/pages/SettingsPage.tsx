import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Bell,
  CreditCard,
  Settings as SettingsIcon,
  Shield,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { AccountSection } from '@/features/settings/components/AccountSection';
import { NotificationSettingsSection } from '@/features/settings/components/NotificationSettingsSection';
import { PrivacySettingsSection } from '@/features/settings/components/PrivacySettingsSection';
import { PaymentMethodsSection } from '@/features/settings/components/PaymentMethodsSection';

interface SettingsTab {
  value: string;
  route: string;
  label: string;
  icon: LucideIcon;
}

const TABS: SettingsTab[] = [
  { value: 'account', route: ROUTES.settings, label: en.settings.account, icon: UserIcon },
  {
    value: 'notifications',
    route: ROUTES.settingsNotifs,
    label: en.settings.notifications,
    icon: Bell,
  },
  { value: 'privacy', route: ROUTES.settingsPrivacy, label: en.settings.privacy, icon: Shield },
  {
    value: 'payments',
    route: ROUTES.settingsPayments,
    label: en.settings.payments,
    icon: CreditCard,
  },
];

export function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();

  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  const activeTab = TABS.find((t) => t.route === location.pathname)?.value ?? 'account';

  function handleTabChange(value: string) {
    const tab = TABS.find((t) => t.value === value);
    if (tab) navigate(tab.route);
  }

  return (
    <div className="flex items-start">
      <Helmet>
        <title>{en.settings.title} | Social Circle</title>
      </Helmet>

      <Sidebar
        unreadChatsCount={unreadChatsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 md:flex"
      />

      <div className="min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl gradient-bg text-text-inverse shadow-md shadow-primary-500/25">
            <SettingsIcon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{en.settings.title}</h1>
            <p className="mt-0.5 text-sm text-text-secondary">{en.settings.subtitle}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                <tab.icon className="size-4" aria-hidden="true" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {activeTab === 'account' && <AccountSection />}
        {activeTab === 'notifications' && <NotificationSettingsSection />}
        {activeTab === 'privacy' && <PrivacySettingsSection />}
        {activeTab === 'payments' && <PaymentMethodsSection />}
      </div>
    </div>
  );
}
