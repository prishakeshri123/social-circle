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
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { addPaymentMethodSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAddPaymentMethod } from '@/features/settings/hooks/useAddPaymentMethod';
import type { z } from 'zod';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormValues = z.infer<typeof addPaymentMethodSchema>;

export function AddPaymentMethodDialog({ open, onOpenChange }: AddPaymentMethodDialogProps) {
  const addPaymentMethod = useAddPaymentMethod();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(addPaymentMethodSchema),
    defaultValues: { cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '' },
  });

  function handleClose(next: boolean) {
    if (!next) {
      reset();
      addPaymentMethod.reset();
    }
    onOpenChange(next);
  }

  const onSubmit = handleSubmit((values) => {
    addPaymentMethod.mutate(values, {
      onSuccess: () => {
        toast.success(en.success.paymentMethodAdded);
        handleClose(false);
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{en.settings.addCardDialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cardName">{en.labels.cardName}</Label>
            <Input
              id="cardName"
              autoComplete="cc-name"
              placeholder={en.placeholders.cardName}
              {...register('cardName')}
            />
            {errors.cardName && <p className="text-xs text-error-500">{errors.cardName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cardNumber">{en.labels.cardNumber}</Label>
            <Input
              id="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder={en.placeholders.cardNumber}
              {...register('cardNumber')}
            />
            {errors.cardNumber && (
              <p className="text-xs text-error-500">{errors.cardNumber.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cardExpiry">{en.labels.cardExpiry}</Label>
              <Input
                id="cardExpiry"
                autoComplete="cc-exp"
                placeholder={en.placeholders.cardExpiry}
                {...register('cardExpiry')}
              />
              {errors.cardExpiry && (
                <p className="text-xs text-error-500">{errors.cardExpiry.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cardCvv">{en.labels.cardCvv}</Label>
              <Input
                id="cardCvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder={en.placeholders.cardCvv}
                {...register('cardCvv')}
              />
              {errors.cardCvv && <p className="text-xs text-error-500">{errors.cardCvv.message}</p>}
            </div>
          </div>
          {addPaymentMethod.isError && (
            <p role="alert" className="text-sm text-error-500">
              {getApiErrorMessage(addPaymentMethod.error)}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              {en.actions.cancel}
            </Button>
            <Button type="submit" disabled={addPaymentMethod.isPending}>
              {en.actions.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
