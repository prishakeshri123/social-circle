import type { ReactNode } from 'react';
import { Calendar, MessageCircle, Users } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { cn } from '@/shared/utils/cn';
import { TopBar } from '@/shared/components/layout/TopBar';
import loginIllustration from '@/assets/images/login.svg';

// Keep a consistent inset from the header and viewport edges on both auth pages
const PAGE_GUTTER_CLASS = 'px-4 sm:px-6';

export const AUTH_FEATURES = [
  { icon: Users, title: en.auth.authFeatureClubsTitle, description: en.auth.authFeatureClubs },
  {
    icon: Calendar,
    title: en.auth.authFeatureEventsTitle,
    description: en.auth.authFeatureEvents,
  },
  {
    icon: MessageCircle,
    title: en.auth.authFeatureCircleTitle,
    description: en.auth.authFeatureCircle,
  },
] as const;

export type AuthFeature = (typeof AUTH_FEATURES)[number];

const CARD_WIDTH_CLASSES = {
  md: 'max-w-md',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
} as const;

interface AuthSplitLayoutProps {
  heading: string;
  subtitle: string;
  features: readonly AuthFeature[];
  bottomPrompt: ReactNode;
  cardTitle: string;
  /** Card width — narrower for short forms (login), wider for multi-field forms (signup). */
  cardWidth?: keyof typeof CARD_WIDTH_CLASSES;
  children: ReactNode;
}

export function AuthSplitLayout({
  heading,
  subtitle,
  features,
  bottomPrompt,
  cardTitle,
  cardWidth = 'md',
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="auth-neon">
      <TopBar />

      <div className="relative flex min-h-screen overflow-hidden bg-background pt-16">
        {/* Faint dot-grid texture for depth */}
        <div className="auth-neon-grid pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* Ambient neon glow field — indigo + electric cyan, slowly drifting */}
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

        {/* Constrained to match the header's max-w-6xl container so the auth
            card's right edge lines up with the header's auth button above it */}
        <div
          className={cn(
            'relative mx-auto flex w-full max-w-6xl items-start gap-8',
            PAGE_GUTTER_CLASS,
          )}
        >
          {/* Left: branding + marketing content, narrow single column */}
          <div className="hidden w-72 shrink-0 flex-col gap-6 py-6 lg:flex xl:w-80">
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-text-primary">{heading}</h1>
              <p className="text-sm text-text-secondary">{subtitle}</p>
            </div>

            <div className="relative flex h-44 w-full shrink-0 items-center justify-center">
              <div
                className="absolute inset-4 rounded-[2rem] opacity-30 blur-2xl"
                style={{ background: 'var(--gradient-brand)' }}
                aria-hidden="true"
              />
              <img
                src={loginIllustration}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="relative h-full w-full rounded-[2rem] border border-border bg-surface-raised/80 object-contain p-4 shadow-modal backdrop-blur-sm"
              />
              <span className="absolute -right-3 -top-3 flex size-10 items-center justify-center rounded-full bg-surface-raised text-primary-500 shadow-modal ring-1 ring-border">
                <Calendar className="size-4" aria-hidden="true" />
              </span>
              <span className="absolute -bottom-3 -left-3 flex size-10 items-center justify-center rounded-full bg-surface-raised text-info-500 shadow-modal ring-1 ring-border">
                <MessageCircle className="size-4" aria-hidden="true" />
              </span>
            </div>

            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-500 ring-1 ring-primary-200/60">
                    <feature.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text-primary">
                      {feature.title}
                    </span>
                    <span className="block text-sm text-text-secondary">{feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-text-secondary">{bottomPrompt}</p>
          </div>

          {/* Right: auth card */}
          <div className="flex w-full flex-1 items-center justify-center py-4 sm:py-6">
            <div
              className={cn(
                'w-full space-y-5 rounded-2xl border border-border bg-surface-raised/80 p-7 shadow-[0_0_60px_-15px_var(--color-glow-primary)] backdrop-blur-2xl sm:p-8 lg:p-10',
                CARD_WIDTH_CLASSES[cardWidth],
              )}
            >
              <h2 className="font-display text-xl font-bold text-text-primary">{cardTitle}</h2>

              {children}

              <p className="text-center text-sm text-text-secondary lg:hidden">{bottomPrompt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
