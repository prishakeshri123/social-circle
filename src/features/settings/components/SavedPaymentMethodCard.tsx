import { useState } from 'react';
import { CreditCard as CardChip, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { CARD_BRAND_LABELS } from '@/shared/constants/app.constants';
import { useDeletePaymentMethod } from '@/features/settings/hooks/useDeletePaymentMethod';
import { useSetDefaultPaymentMethod } from '@/features/settings/hooks/useSetDefaultPaymentMethod';
import type { SavedPaymentMethod } from '@/types/payment.types';

interface SavedPaymentMethodCardProps {
  method: SavedPaymentMethod;
}

export function SavedPaymentMethodCard({ method }: SavedPaymentMethodCardProps) {
  const [numberVisible, setNumberVisible] = useState(false);
  const deleteMethod = useDeletePaymentMethod();
  const setDefaultMethod = useSetDefaultPaymentMethod();

  return (
    <div className="w-full max-w-[27rem] overflow-hidden rounded-xl shadow-lg shadow-primary-500/25 transition-transform duration-normal hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative flex aspect-[1.586/1] flex-col justify-between overflow-hidden bg-[image:var(--gradient-brand)] p-4 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/15 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 size-28 rounded-full bg-black/10 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative flex items-start justify-between">
          <span
            className="flex h-6 w-9 items-center justify-center rounded-md bg-gradient-to-br from-amber-200 to-amber-500 shadow-sm"
            aria-hidden="true"
          >
            <CardChip className="size-3.5 text-amber-800/70" />
          </span>
          {method.isDefault && (
            <span className="rounded-full border border-white/25 bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
              {en.settings.defaultBadge}
            </span>
          )}
        </div>

        <div className="relative flex items-center justify-between gap-3">
          <p className="truncate font-mono text-base tracking-[0.18em]">
            {numberVisible ? `•••• •••• •••• ${method.last4}` : '•••• •••• •••• ••••'}
          </p>
          <button
            type="button"
            onClick={() => setNumberVisible((v) => !v)}
            className="shrink-0 rounded-full p-1 text-white/80 transition-colors duration-fast hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label={numberVisible ? en.settings.hideCardNumber : en.settings.showCardNumber}
          >
            {numberVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        <div className="relative flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide opacity-90">
            {CARD_BRAND_LABELS[method.brand]}
          </span>
          <span className="opacity-80">
            {String(method.expiryMonth).padStart(2, '0')}/{String(method.expiryYear).slice(-2)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-border bg-surface-raised px-4 py-2.5">
        {!method.isDefault && (
          <button
            type="button"
            disabled={setDefaultMethod.isPending}
            onClick={() => setDefaultMethod.mutate(method.id)}
            className="text-xs font-medium text-text-secondary underline-offset-2 hover:text-text-primary hover:underline disabled:opacity-50"
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
          className="ml-auto flex items-center gap-1 text-xs font-medium text-text-muted hover:text-error-500 disabled:opacity-50"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          {en.settings.removeCardCta}
        </button>
      </div>
    </div>
  );
}
