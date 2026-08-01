import type { ReactNode } from 'react';
import { Pencil } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';

interface ReviewRow {
  label: string;
  value: string;
}

interface ReviewSectionProps {
  title: string;
  stepNumber: number;
  onEdit: (step: number) => void;
  rows?: ReviewRow[];
  children?: ReactNode;
}

export function ReviewSection({ title, stepNumber, onEdit, rows, children }: ReviewSectionProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-raised/60 p-4 backdrop-blur-sm transition-colors duration-200 hover:border-primary-200">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-display text-sm font-semibold text-text-primary">{title}</h4>
        <button
          type="button"
          onClick={() => onEdit(stepNumber)}
          className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-primary-600 transition-transform duration-200 hover:scale-105 hover:underline active:scale-95"
        >
          <Pencil className="size-3" aria-hidden="true" />
          {en.actions.edit}
        </button>
      </div>

      {rows && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {rows.map((row) => (
            <div key={row.label} className="min-w-0 space-y-0.5">
              <dt className="text-xs text-text-muted">{row.label}</dt>
              <dd className="truncate text-sm font-medium text-text-primary">
                {row.value || en.auth.signupReviewNotProvided}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
