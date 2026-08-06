import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { deleteAccountSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useDeleteAccount } from '@/features/settings/hooks/useDeleteAccount';
import { useAuthStore } from '@/store/authSlice';
import type { z } from 'zod';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormValues = z.infer<typeof deleteAccountSchema>;

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const deleteAccount = useDeleteAccount();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmText: '' },
  });

  function handleClose(next: boolean) {
    if (!next) {
      reset();
      deleteAccount.reset();
    }
    onOpenChange(next);
  }

  const onSubmit = handleSubmit(() => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        toast.success(en.success.accountDeleted);
        clearAuth();
        navigate(ROUTES.home);
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{en.settings.deleteAccountDialogTitle}</DialogTitle>
          <DialogDescription>{en.settings.deleteAccountDialogBody}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="confirmText">{en.settings.deleteAccountConfirmLabel}</Label>
            <Input
              id="confirmText"
              placeholder={en.settings.deleteAccountConfirmPlaceholder}
              autoComplete="off"
              {...register('confirmText')}
            />
            {errors.confirmText && (
              <p className="text-xs text-error-500">{errors.confirmText.message}</p>
            )}
          </div>
          {deleteAccount.isError && (
            <p role="alert" className="text-sm text-error-500">
              {getApiErrorMessage(deleteAccount.error)}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              {en.actions.cancel}
            </Button>
            <Button type="submit" variant="destructive" disabled={deleteAccount.isPending}>
              {en.settings.deleteAccountCta}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
