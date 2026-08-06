import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Label } from '@/shared/components/ui/Label';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { changePasswordSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useChangePassword } from '@/features/settings/hooks/useChangePassword';
import type { z } from 'zod';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const newPassword = watch('newPassword') ?? '';

  function handleClose(next: boolean) {
    if (!next) {
      reset();
      changePassword.reset();
    }
    onOpenChange(next);
  }

  const onSubmit = handleSubmit((values) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success(en.success.passwordChanged);
          handleClose(false);
        },
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{en.settings.changePasswordDialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">{en.settings.currentPasswordLabel}</Label>
            <PasswordInput
              id="currentPassword"
              autoComplete="current-password"
              placeholder={en.placeholders.currentPassword}
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="text-xs text-error-500">{errors.currentPassword.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">{en.settings.newPasswordLabel}</Label>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              placeholder={en.placeholders.password}
              {...register('newPassword')}
            />
            <PasswordStrengthMeter password={newPassword} />
            {errors.newPassword && (
              <p className="text-xs text-error-500">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{en.labels.confirmPassword}</Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-error-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          {changePassword.isError && (
            <p role="alert" className="text-sm text-error-500">
              {getApiErrorMessage(changePassword.error)}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              {en.actions.cancel}
            </Button>
            <Button type="submit" disabled={changePassword.isPending}>
              {en.actions.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
