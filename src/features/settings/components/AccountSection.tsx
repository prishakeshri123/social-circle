import { useState } from 'react';
import { BadgeCheck, KeyRound, Mail, Phone, ShieldAlert } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { en } from '@/shared/constants/locales/en';
import { useAuth } from '@/shared/hooks/useAuth';
import { ChangeContactDialog } from '@/features/settings/components/ChangeContactDialog';
import { ChangePasswordDialog } from '@/features/settings/components/ChangePasswordDialog';
import { DeleteAccountDialog } from '@/features/settings/components/DeleteAccountDialog';
import type { LucideIcon } from 'lucide-react';

interface AccountRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  verified?: boolean;
  onChangeClick: () => void;
}

function AccountRow({ icon: Icon, label, value, verified, onChangeClick }: AccountRowProps) {
  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-border p-4 transition-all duration-normal hover:border-primary-200 hover:shadow-md">
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl gradient-bg text-text-inverse shadow-sm shadow-primary-500/20 transition-transform duration-normal group-hover:scale-105">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text-primary">{label}</p>
            {verified && (
              <Badge variant="success" className="gap-1 px-1.5 py-0 text-[10px]">
                <BadgeCheck className="size-3" aria-hidden="true" />
                {en.settings.verifiedBadge}
              </Badge>
            )}
          </div>
          <p className="truncate text-sm text-text-secondary">{value}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="shrink-0" onClick={onChangeClick}>
        {en.settings.changeCta}
      </Button>
    </div>
  );
}

export function AccountSection() {
  const { user } = useAuth();
  const [contactDialog, setContactDialog] = useState<'email' | 'phone' | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>{en.settings.accountSectionTitle}</CardTitle>
          <CardDescription>{en.settings.accountSectionSubtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <AccountRow
            icon={Mail}
            label={en.settings.emailLabel}
            value={user?.email ?? ''}
            verified={user?.emailVerified}
            onChangeClick={() => setContactDialog('email')}
          />
          <AccountRow
            icon={Phone}
            label={en.settings.phoneLabel}
            value={user?.phone || en.settings.noPhoneSet}
            verified={Boolean(user?.phone) && user?.phoneVerified}
            onChangeClick={() => setContactDialog('phone')}
          />
          <AccountRow
            icon={KeyRound}
            label={en.settings.passwordLabel}
            value={en.settings.passwordMaskedValue}
            onChangeClick={() => setPasswordDialogOpen(true)}
          />
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-error-500/20 bg-gradient-to-br from-error-100/40 via-transparent to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-error-500 text-text-inverse shadow-sm shadow-error-500/30">
              <ShieldAlert className="size-4" aria-hidden="true" />
            </span>
            <CardTitle className="text-error-500">{en.settings.dangerZoneTitle}</CardTitle>
          </div>
          <CardDescription>{en.settings.dangerZoneSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            {en.settings.deleteAccountCta}
          </Button>
        </CardContent>
      </Card>

      <ChangeContactDialog
        mode="email"
        open={contactDialog === 'email'}
        onOpenChange={(open) => setContactDialog(open ? 'email' : null)}
      />
      <ChangeContactDialog
        mode="phone"
        open={contactDialog === 'phone'}
        onOpenChange={(open) => setContactDialog(open ? 'phone' : null)}
      />
      <ChangePasswordDialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen} />
      <DeleteAccountDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
    </div>
  );
}
