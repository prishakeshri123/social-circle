import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, MapPin, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { MAX_SAVED_PAYMENT_METHODS } from '@/shared/constants/app.constants';
import { billingAddressSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { usePaymentMethods } from '@/features/settings/hooks/usePaymentMethods';
import { useBillingAddress } from '@/features/settings/hooks/useBillingAddress';
import { useUpdateBillingAddress } from '@/features/settings/hooks/useUpdateBillingAddress';
import { AddPaymentMethodDialog } from '@/features/settings/components/AddPaymentMethodDialog';
import { SavedPaymentMethodCard } from '@/features/settings/components/SavedPaymentMethodCard';
import type { z } from 'zod';

type BillingAddressValues = z.infer<typeof billingAddressSchema>;

function SavedPaymentMethods() {
  const query = usePaymentMethods();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const methods = query.data ?? [];
  const atLimit = methods.length >= MAX_SAVED_PAYMENT_METHODS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl gradient-bg text-text-inverse shadow-sm shadow-primary-500/20">
            <CreditCard className="size-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{en.settings.paymentMethodsTitle}</CardTitle>
            <CardDescription>{en.settings.paymentMethodsSubtitle}</CardDescription>
          </div>
        </div>
        <Button size="sm" disabled={atLimit} onClick={() => setAddDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          {en.settings.addPaymentMethodCta}
        </Button>
      </CardHeader>
      <CardContent>
        {query.isPending && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full max-w-[27rem] rounded-xl" />
            ))}
          </div>
        )}

        {!query.isPending && methods.length === 0 && (
          <EmptyState icon={CreditCard} title={en.empty.noPaymentMethods} />
        )}

        {!query.isPending && methods.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {methods.map((method) => (
              <SavedPaymentMethodCard key={method.id} method={method} />
            ))}
          </div>
        )}
      </CardContent>

      <AddPaymentMethodDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </Card>
  );
}

function BillingAddressForm() {
  const query = useBillingAddress();
  const updateAddress = useUpdateBillingAddress();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BillingAddressValues>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: { line1: '', city: '', state: '', postalCode: '', country: '' },
  });

  useEffect(() => {
    if (query.data) reset(query.data);
  }, [query.data, reset]);

  const onSubmit = handleSubmit((values) => {
    updateAddress.mutate(values, {
      onSuccess: () => toast.success(en.success.billingAddressSaved),
    });
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl gradient-bg text-text-inverse shadow-sm shadow-primary-500/20">
          <MapPin className="size-4" aria-hidden="true" />
        </span>
        <div>
          <CardTitle>{en.settings.billingAddressTitle}</CardTitle>
          <CardDescription>{en.settings.billingAddressSubtitle}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {query.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="line1">{en.labels.address}</Label>
              <Input id="line1" placeholder={en.placeholders.address} {...register('line1')} />
              {errors.line1 && <p className="text-xs text-error-500">{errors.line1.message}</p>}
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">{en.labels.city}</Label>
                <Input id="city" placeholder={en.placeholders.city} {...register('city')} />
                {errors.city && <p className="text-xs text-error-500">{errors.city.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">{en.labels.state}</Label>
                <Input id="state" placeholder={en.placeholders.state} {...register('state')} />
                {errors.state && <p className="text-xs text-error-500">{errors.state.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="postalCode">{en.labels.postalCode}</Label>
                <Input
                  id="postalCode"
                  placeholder={en.placeholders.postalCode}
                  {...register('postalCode')}
                />
                {errors.postalCode && (
                  <p className="text-xs text-error-500">{errors.postalCode.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">{en.labels.country}</Label>
                <Input
                  id="country"
                  placeholder={en.placeholders.country}
                  {...register('country')}
                />
                {errors.country && (
                  <p className="text-xs text-error-500">{errors.country.message}</p>
                )}
              </div>
            </div>
            {updateAddress.isError && (
              <p role="alert" className="text-sm text-error-500">
                {getApiErrorMessage(updateAddress.error)}
              </p>
            )}
            <Button type="submit" disabled={updateAddress.isPending}>
              {en.settings.saveAddressCta}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export function PaymentMethodsSection() {
  return (
    <div className="space-y-6">
      <SavedPaymentMethods />
      <BillingAddressForm />
    </div>
  );
}
