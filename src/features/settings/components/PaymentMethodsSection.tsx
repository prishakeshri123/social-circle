import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, MapPin, Plus, Trash2 } from 'lucide-react';
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
import { CARD_BRAND_LABELS, MAX_SAVED_PAYMENT_METHODS } from '@/shared/constants/app.constants';
import { billingAddressSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { cn } from '@/shared/utils/cn';
import { usePaymentMethods } from '@/features/settings/hooks/usePaymentMethods';
import { useDeletePaymentMethod } from '@/features/settings/hooks/useDeletePaymentMethod';
import { useSetDefaultPaymentMethod } from '@/features/settings/hooks/useSetDefaultPaymentMethod';
import { useBillingAddress } from '@/features/settings/hooks/useBillingAddress';
import { useUpdateBillingAddress } from '@/features/settings/hooks/useUpdateBillingAddress';
import { AddPaymentMethodDialog } from '@/features/settings/components/AddPaymentMethodDialog';
import type { CardBrand } from '@/types/payment.types';
import type { z } from 'zod';

type BillingAddressValues = z.infer<typeof billingAddressSchema>;

const BRAND_GRADIENT: Record<CardBrand, string> = {
  visa: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900',
  mastercard: 'bg-gradient-to-br from-orange-500 via-red-500 to-rose-700',
  rupay: 'bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900',
  amex: 'bg-gradient-to-br from-teal-500 via-cyan-600 to-sky-800',
};

function SavedPaymentMethods() {
  const query = usePaymentMethods();
  const deleteMethod = useDeletePaymentMethod();
  const setDefaultMethod = useSetDefaultPaymentMethod();
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {!query.isPending && methods.length === 0 && (
          <EmptyState icon={CreditCard} title={en.empty.noPaymentMethods} />
        )}

        {!query.isPending && methods.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {methods.map((method) => (
              <div
                key={method.id}
                className={cn(
                  'relative flex flex-col overflow-hidden rounded-2xl p-5 text-white shadow-lg transition-transform duration-normal hover:-translate-y-0.5 hover:shadow-xl',
                  BRAND_GRADIENT[method.brand],
                )}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative flex items-start justify-between">
                  <CreditCard className="size-7 opacity-90" aria-hidden="true" />
                  {method.isDefault && (
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                      {en.settings.defaultBadge}
                    </span>
                  )}
                </div>

                <p className="relative mt-6 font-mono text-lg tracking-[0.2em]">
                  •••• •••• •••• {method.last4}
                </p>

                <div className="relative mt-3 flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wide opacity-90">
                    {CARD_BRAND_LABELS[method.brand]}
                  </span>
                  <span className="opacity-80">
                    {String(method.expiryMonth).padStart(2, '0')}/
                    {String(method.expiryYear).slice(-2)}
                  </span>
                </div>

                <div className="relative mt-4 flex items-center gap-3 border-t border-white/15 pt-3">
                  {!method.isDefault && (
                    <button
                      type="button"
                      disabled={setDefaultMethod.isPending}
                      onClick={() => setDefaultMethod.mutate(method.id)}
                      className="text-xs font-medium text-white/85 underline-offset-2 hover:text-white hover:underline disabled:opacity-50"
                    >
                      {en.settings.setDefaultCta}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={deleteMethod.isPending}
                    onClick={() =>
                      deleteMethod.mutate(method.id, {
                        onSuccess: () => toast.success(en.success.paymentMethodRemoved),
                      })
                    }
                    className="ml-auto flex items-center gap-1 text-xs font-medium text-white/70 hover:text-white disabled:opacity-50"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    {en.settings.removeCardCta}
                  </button>
                </div>
              </div>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
