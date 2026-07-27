import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { en } from '@/shared/constants/locales/en';
import { cn } from '@/shared/utils/cn';

interface LogoProps {
  /** White wordmark for dark backgrounds (transparent hero header, dark footer). */
  onDark?: boolean;
  className?: string;
}

export function Logo({ onDark = false, className }: LogoProps) {
  return (
    <Link to={ROUTES.home} className={cn('flex items-center gap-2', className)}>
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <Sparkles className="size-3.5 text-white" aria-hidden="true" />
      </span>
      <span
        className={cn(
          'text-base font-bold uppercase tracking-wide',
          onDark ? 'text-white [text-shadow:0_1px_6px_rgb(0_0_0_/_0.5)]' : 'gradient-text',
        )}
      >
        {en.app.name}
      </span>
    </Link>
  );
}
