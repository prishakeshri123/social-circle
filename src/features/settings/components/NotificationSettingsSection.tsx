import { useEffect, useRef, useState } from 'react';
import { AtSign, Bell, Calendar, CreditCard, Smartphone, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/Card';
import { Switch } from '@/shared/components/ui/Switch';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { en } from '@/shared/constants/locales/en';
import { SETTINGS_DEBOUNCE_MS } from '@/shared/constants/app.constants';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useNotificationPreferences } from '@/features/settings/hooks/useNotificationPreferences';
import { useUpdateNotificationPreferences } from '@/features/settings/hooks/useUpdateNotificationPreferences';
import type { NotificationPreferences } from '@/types/user.types';
import type { LucideIcon } from 'lucide-react';

interface Row {
  key: keyof NotificationPreferences;
  icon: LucideIcon;
  label: string;
  desc: string;
}

const ROWS: Row[] = [
  {
    key: 'emailEnabled',
    icon: Bell,
    label: en.settings.notifEmailEnabled,
    desc: en.settings.notifEmailEnabledDesc,
  },
  {
    key: 'pushEnabled',
    icon: Smartphone,
    label: en.settings.notifPushEnabled,
    desc: en.settings.notifPushEnabledDesc,
  },
  {
    key: 'eventReminders',
    icon: Calendar,
    label: en.settings.notifEventReminders,
    desc: en.settings.notifEventRemindersDesc,
  },
  {
    key: 'chatMentions',
    icon: AtSign,
    label: en.settings.notifChatMentions,
    desc: en.settings.notifChatMentionsDesc,
  },
  {
    key: 'clubUpdates',
    icon: Users,
    label: en.settings.notifClubUpdates,
    desc: en.settings.notifClubUpdatesDesc,
  },
  {
    key: 'paymentAlerts',
    icon: CreditCard,
    label: en.settings.notifPaymentAlerts,
    desc: en.settings.notifPaymentAlertsDesc,
  },
];

export function NotificationSettingsSection() {
  const query = useNotificationPreferences();
  const updatePrefs = useUpdateNotificationPreferences();
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const hydrated = useRef(false);
  const skipNextSave = useRef(true);
  const debouncedPrefs = useDebouncedValue(prefs, SETTINGS_DEBOUNCE_MS);

  useEffect(() => {
    if (query.data && !hydrated.current) {
      setPrefs(query.data);
      hydrated.current = true;
    }
  }, [query.data]);

  useEffect(() => {
    if (!hydrated.current || !debouncedPrefs) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    updatePrefs.mutate(debouncedPrefs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPrefs]);

  function toggle(key: keyof NotificationPreferences) {
    setPrefs((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl gradient-bg text-text-inverse shadow-sm shadow-primary-500/20">
            <Bell className="size-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{en.settings.notificationsSectionTitle}</CardTitle>
            <CardDescription>{en.settings.notificationsSectionSubtitle}</CardDescription>
          </div>
        </div>
        {updatePrefs.isSuccess && !updatePrefs.isPending && (
          <span
            className="mt-1 flex shrink-0 items-center gap-1 text-xs font-medium text-success-500"
            aria-live="polite"
          >
            <span className="size-1.5 rounded-full bg-success-500" />
            {en.settings.savedIndicator}
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {query.isPending &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}

        {!query.isPending &&
          prefs &&
          ROWS.map(({ key, icon: Icon, label, desc }) => (
            <div
              key={key}
              className="group flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition-colors duration-normal hover:bg-surface"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl gradient-bg text-text-inverse shadow-sm shadow-primary-500/20 transition-transform duration-normal group-hover:scale-105">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{label}</p>
                  <p className="text-xs text-text-secondary">{desc}</p>
                </div>
              </div>
              <Switch checked={prefs[key]} onCheckedChange={() => toggle(key)} aria-label={label} />
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
