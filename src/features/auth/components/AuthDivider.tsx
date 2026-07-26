import { en } from '@/shared/constants/locales/en';

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-xs text-text-muted">
      <span className="h-px flex-1 bg-border" />
      {en.auth.orContinueWith}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
