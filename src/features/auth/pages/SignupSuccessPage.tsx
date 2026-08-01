import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, CopyCheck } from 'lucide-react';
import { nanoid } from 'nanoid';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/Button';
import { toast } from '@/shared/components/ui/Toast';
import { TopBar } from '@/shared/components/layout/TopBar';

interface SignupSuccessState {
  communityLabel?: string;
}

export function SignupSuccessPage() {
  const location = useLocation();
  const { communityLabel } = (location.state ?? {}) as SignupSuccessState;
  const referenceId = useMemo(() => `REQ-${nanoid(8).toUpperCase()}`, []);
  const [copied, setCopied] = useState(false);

  const handleCopyReference = async () => {
    await navigator.clipboard.writeText(referenceId);
    setCopied(true);
    toast.success(en.auth.signupSuccessReferenceCopied);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="auth-neon">
      <TopBar />

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 pt-16 sm:px-6">
        <div className="auth-neon-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="auth-orb pointer-events-none absolute -left-40 -top-32 size-[28rem] rounded-full bg-primary-500/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="auth-orb pointer-events-none absolute right-0 top-1/4 size-96 rounded-full bg-info-500/20 blur-3xl"
          style={{ animationDelay: '-4s' }}
          aria-hidden="true"
        />
        <div
          className="auth-orb pointer-events-none absolute -bottom-24 left-1/3 size-96 rounded-full bg-accent-500/20 blur-3xl"
          style={{ animationDelay: '-9s' }}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface-raised/80 p-8 text-center shadow-[0_0_60px_-15px_var(--color-glow-primary)] backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 16 }}
            className="gradient-bg mx-auto flex size-20 items-center justify-center rounded-full shadow-[0_0_50px_-10px_var(--color-glow-primary)]"
          >
            <svg viewBox="0 0 24 24" className="size-10" fill="none" aria-hidden="true">
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
              />
            </svg>
          </motion.div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-text-primary">
              {en.auth.signupSuccessHeading}
            </h1>
            <p className="text-sm text-text-secondary">
              {communityLabel
                ? en.auth.signupSuccessSubheadingWithCommunity(communityLabel)
                : en.auth.signupSuccessSubheadingGeneric}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5">
            <span className="text-xs text-text-muted">{en.auth.signupSuccessReferenceLabel}</span>
            <span className="font-mono text-sm font-semibold text-text-primary">{referenceId}</span>
            <button
              type="button"
              onClick={handleCopyReference}
              aria-label={en.auth.signupSuccessCopyReference}
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-text-muted transition-transform duration-200 hover:scale-110 hover:text-primary-600 active:scale-95"
            >
              {copied ? (
                <CopyCheck className="size-3.5 text-success-500" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg" asChild>
              <Link to={ROUTES.home}>{en.auth.signupSuccessBackHome}</Link>
            </Button>
            <p className="text-sm text-text-secondary">
              {en.auth.signupSuccessLoginPrompt}{' '}
              <Link to={ROUTES.login} className="font-medium text-primary-600 hover:underline">
                {en.auth.loginLink}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
