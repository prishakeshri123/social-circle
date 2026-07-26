import { useMemo } from 'react';
import { cn } from '@/shared/utils/cn';
import { en } from '@/shared/constants/locales/en';

type StrengthLevel = 0 | 1 | 2 | 3;

const LEVELS: { label: string; barClassName: string }[] = [
  { label: en.auth.passwordStrengthWeak, barClassName: 'bg-error-500' },
  { label: en.auth.passwordStrengthFair, barClassName: 'bg-warning-500' },
  { label: en.auth.passwordStrengthGood, barClassName: 'bg-success-500' },
  { label: en.auth.passwordStrengthStrong, barClassName: 'bg-success-500' },
];

function calculateStrength(password: string): StrengthLevel {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 0;
  if (score === 2) return 1;
  if (score === 3) return 2;
  return 3;
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  const level = useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  const { label, barClassName } = LEVELS[level];

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1" role="img" aria-hidden="true">
        {LEVELS.map((_, index) => (
          <span
            key={index}
            className={cn('h-1 flex-1 rounded-full bg-surface', index <= level && barClassName)}
          />
        ))}
      </div>
      <p className="text-xs text-text-secondary" aria-live="polite">
        {en.auth.passwordStrengthLabel}: {label}
      </p>
    </div>
  );
}
