import { useEffect, useRef, useState } from 'react';
import { Eye, MessageCircle, Shield, UserX } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/Card';
import { Switch } from '@/shared/components/ui/Switch';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { en } from '@/shared/constants/locales/en';
import { LS_BLOCKED_USERS_KEY, SETTINGS_DEBOUNCE_MS } from '@/shared/constants/app.constants';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { useUsersByIds } from '@/shared/hooks/useUsersByIds';
import { usePrivacySettings } from '@/features/settings/hooks/usePrivacySettings';
import { useUpdatePrivacySettings } from '@/features/settings/hooks/useUpdatePrivacySettings';
import type { DmPermission, PrivacySettings, ProfileVisibility } from '@/types/user.types';

const VISIBILITY_OPTIONS: { value: ProfileVisibility; label: string }[] = [
  { value: 'public', label: en.settings.visibilityPublic },
  { value: 'members_only', label: en.settings.visibilityMembersOnly },
  { value: 'private', label: en.settings.visibilityPrivate },
];

const DM_OPTIONS: { value: DmPermission; label: string }[] = [
  { value: 'anyone', label: en.settings.dmAnyone },
  { value: 'club_members', label: en.settings.dmClubMembers },
  { value: 'nobody', label: en.settings.dmNobody },
];

function PrivacyPreferences() {
  const query = usePrivacySettings();
  const updatePrivacy = useUpdatePrivacySettings();
  const [privacy, setPrivacy] = useState<PrivacySettings | null>(null);
  const hydrated = useRef(false);
  const skipNextSave = useRef(true);
  const debouncedPrivacy = useDebouncedValue(privacy, SETTINGS_DEBOUNCE_MS);

  useEffect(() => {
    if (query.data && !hydrated.current) {
      setPrivacy(query.data);
      hydrated.current = true;
    }
  }, [query.data]);

  useEffect(() => {
    if (!hydrated.current || !debouncedPrivacy) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    updatePrivacy.mutate(debouncedPrivacy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPrivacy]);

  if (query.isPending || !privacy) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="group flex items-center justify-between gap-4 rounded-xl p-3 transition-colors duration-normal hover:bg-surface">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl gradient-bg text-text-inverse shadow-sm shadow-primary-500/20 transition-transform duration-normal group-hover:scale-105">
            <Shield className="size-4" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-text-primary">
            {en.settings.profileVisibilityLabel}
          </p>
        </div>
        <Select
          value={privacy.profileVisibility}
          onValueChange={(value) =>
            setPrivacy((prev) =>
              prev ? { ...prev, profileVisibility: value as ProfileVisibility } : prev,
            )
          }
        >
          <SelectTrigger className="w-44 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VISIBILITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="group flex items-center justify-between gap-4 rounded-xl p-3 transition-colors duration-normal hover:bg-surface">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl gradient-bg text-text-inverse shadow-sm shadow-primary-500/20 transition-transform duration-normal group-hover:scale-105">
            <Eye className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">
              {en.settings.showInDiscoveryLabel}
            </p>
            <p className="text-xs text-text-secondary">{en.settings.showInDiscoveryDesc}</p>
          </div>
        </div>
        <Switch
          checked={privacy.showInDiscovery}
          onCheckedChange={(checked) =>
            setPrivacy((prev) => (prev ? { ...prev, showInDiscovery: checked } : prev))
          }
          aria-label={en.settings.showInDiscoveryLabel}
        />
      </div>

      <div className="group flex items-center justify-between gap-4 rounded-xl p-3 transition-colors duration-normal hover:bg-surface">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl gradient-bg text-text-inverse shadow-sm shadow-primary-500/20 transition-transform duration-normal group-hover:scale-105">
            <MessageCircle className="size-4" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-text-primary">{en.settings.allowDmsFromLabel}</p>
        </div>
        <Select
          value={privacy.allowDmsFrom}
          onValueChange={(value) =>
            setPrivacy((prev) => (prev ? { ...prev, allowDmsFrom: value as DmPermission } : prev))
          }
        >
          <SelectTrigger className="w-44 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DM_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {updatePrivacy.isSuccess && !updatePrivacy.isPending && (
        <p
          className="flex items-center justify-end gap-1 text-xs font-medium text-success-500"
          aria-live="polite"
        >
          <span className="size-1.5 rounded-full bg-success-500" />
          {en.settings.savedIndicator}
        </p>
      )}
    </div>
  );
}

function BlockedUsersList() {
  const [blockedIds, setBlockedIds] = useLocalStorage<string[]>(LS_BLOCKED_USERS_KEY, []);
  const usersById = useUsersByIds(blockedIds);

  function handleUnblock(userId: string) {
    setBlockedIds((prev) => prev.filter((id) => id !== userId));
  }

  if (blockedIds.length === 0) {
    return <EmptyState icon={UserX} title={en.empty.noBlockedUsers} />;
  }

  return (
    <div className="divide-y divide-border">
      {blockedIds.map((userId) => {
        const user = usersById[userId];
        return (
          <div key={userId} className="flex items-center justify-between gap-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="ring-2 ring-error-100">
                <AvatarImage src={user?.avatarUrl} alt="" />
                <AvatarFallback>{user?.fullName?.charAt(0) ?? '?'}</AvatarFallback>
              </Avatar>
              <p className="truncate text-sm font-medium text-text-primary">
                {user?.fullName ?? userId}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleUnblock(userId)}>
              {en.actions.unblock}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function PrivacySettingsSection() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl gradient-bg text-text-inverse shadow-sm shadow-primary-500/20">
            <Shield className="size-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{en.settings.privacySectionTitle}</CardTitle>
            <CardDescription>{en.settings.privacySectionSubtitle}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <PrivacyPreferences />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-error-500 text-text-inverse shadow-sm shadow-error-500/30">
            <UserX className="size-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{en.settings.blockedUsersTitle}</CardTitle>
            <CardDescription>{en.settings.blockedUsersSubtitle}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <BlockedUsersList />
        </CardContent>
      </Card>
    </div>
  );
}
