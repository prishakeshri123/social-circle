import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { HOME_HERO_CLOCK_TICK_MS } from '@/shared/constants/app.constants';
import { formatTime } from '@/shared/utils/formatDate';

interface MemberWelcomeHeroProps {
  fullName: string;
}

interface OrbitNode {
  x: number;
  y: number;
  r: number;
  highlighted?: boolean;
}

const ORBIT_NODES: OrbitNode[] = [
  { x: 80, y: 16, r: 3 },
  { x: 140.9, y: 60.2, r: 4.5, highlighted: true },
  { x: 117.6, y: 131.8, r: 3 },
  { x: 42.4, y: 131.8, r: 2.5 },
  { x: 19.1, y: 60.2, r: 3.5 },
];

function getGreeting(hour: number): string {
  if (hour < 12) return en.home.greetingMorning;
  if (hour < 18) return en.home.greetingAfternoon;
  return en.home.greetingEvening;
}

export function MemberWelcomeHero({ fullName }: MemberWelcomeHeroProps) {
  const firstName = fullName.split(' ')[0] ?? fullName;
  const [now, setNow] = useState(() => new Date());
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), HOME_HERO_CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary-50 via-white to-accent-500/10 px-6 py-8 shadow-[0_0_60px_-15px_var(--color-glow-primary)] sm:px-8 sm:py-10">
      <div className="auth-neon-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="auth-orb pointer-events-none absolute -left-16 -top-24 size-64 rounded-full bg-primary-500/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="auth-orb pointer-events-none absolute right-0 top-0 size-64 rounded-full bg-info-500/20 blur-3xl"
        style={{ animationDelay: '-4s' }}
        aria-hidden="true"
      />
      <div
        className="auth-orb pointer-events-none absolute -bottom-24 right-1/3 size-72 rounded-full bg-accent-500/15 blur-3xl"
        style={{ animationDelay: '-9s' }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-text-secondary">
            <span className="relative flex size-1.5" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success-500/75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success-500" />
            </span>
            {getGreeting(now.getHours())}
            <span className="text-text-muted" aria-hidden="true">
              &middot;
            </span>
            <span className="font-mono normal-case tracking-normal text-text-muted">
              {formatTime(now)}
            </span>
          </span>

          <p className="mt-4 text-sm font-medium text-text-secondary">{en.home.welcomeBack}</p>
          <h1 className="mt-1 flex items-center gap-2 font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            <span className="gradient-text">{firstName}</span>
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-3 max-w-sm text-sm text-text-secondary sm:text-base">
            {en.home.welcomeSubtitle}
          </p>

          <Button asChild size="lg" className="mt-5">
            <Link to={ROUTES.search}>
              {en.marketing.heroExploreCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="relative hidden shrink-0 sm:block sm:size-32 md:size-40">
          <svg viewBox="0 0 160 160" className="absolute inset-0 size-full" aria-hidden="true">
            <defs>
              <linearGradient id="heroOrbitLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--color-brand-cyan)" stopOpacity="0.7" />
                <stop offset="1" stopColor="var(--color-brand-cyan)" stopOpacity="0" />
              </linearGradient>
            </defs>

            <motion.circle
              cx="80"
              cy="80"
              r="44"
              fill="none"
              stroke="var(--color-border-strong)"
              strokeWidth="1"
              strokeDasharray="1 5"
              style={{ transformOrigin: '80px 80px' }}
              animate={shouldReduceMotion ? undefined : { rotate: -360 }}
              transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            />

            <motion.g
              style={{ transformOrigin: '80px 80px' }}
              animate={shouldReduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
            >
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="none"
                stroke="var(--color-border-strong)"
                strokeWidth="1"
                strokeDasharray="2 6"
              />
              <line
                x1="80"
                y1="80"
                x2="140.9"
                y2="60.2"
                stroke="url(#heroOrbitLine)"
                strokeWidth="1"
                strokeDasharray="1 4"
              />
              {ORBIT_NODES.map((node, i) => (
                <g key={i}>
                  {node.highlighted && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r + 5}
                      fill="var(--color-brand-cyan)"
                      fillOpacity="0.2"
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={node.highlighted ? 'var(--color-brand-cyan)' : 'var(--color-text-muted)'}
                    fillOpacity={node.highlighted ? 1 : 0.5}
                  />
                </g>
              ))}
            </motion.g>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex size-14 items-center justify-center rounded-full gradient-bg font-display text-lg font-bold text-text-inverse shadow-lg shadow-primary-500/30 ring-4 ring-background md:size-16 md:text-xl">
              {firstName.charAt(0)}
              <span
                className="absolute -bottom-0.5 -right-0.5 flex size-4 rounded-full border-2 border-background bg-success-500"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
