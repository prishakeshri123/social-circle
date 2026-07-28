import type { ReactNode } from 'react';
import { Calendar, CalendarCheck, Link2, MessageCircle, Users } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { cn } from '@/shared/utils/cn';
import { TopBar } from '@/shared/components/layout/TopBar';
import loginIllustration from '@/assets/images/login.svg';

// Keep a consistent inset from the header and viewport edges on both auth pages
const PAGE_GUTTER_CLASS = 'px-4 sm:px-6';

export const AUTH_FEATURES = [
  { icon: Users, label: en.auth.authFeatureClubs },
  { icon: Calendar, label: en.auth.authFeatureEvents },
  { icon: MessageCircle, label: en.auth.authFeatureCircle },
] as const;

export type AuthFeature = (typeof AUTH_FEATURES)[number];

interface AuthSplitLayoutProps {
  heading: string;
  subtitle: string;
  features: readonly AuthFeature[];
  bottomPrompt: ReactNode;
  cardTitle: string;
  children: ReactNode;
}

export function AuthSplitLayout({
  heading,
  subtitle,
  features,
  bottomPrompt,
  cardTitle,
  children,
}: AuthSplitLayoutProps) {
  return (
    <>
      <TopBar />

      <div className="relative flex min-h-screen overflow-hidden bg-primary-50 pt-16">
        {/* Constrained to match the header's max-w-6xl container so the auth
            card's right edge lines up with the header's auth button above it */}
        <div className={cn('mx-auto flex w-full max-w-6xl', PAGE_GUTTER_CLASS)}>
          {/* Left: branding + marketing content (reference mock's "Welcome Back!" panel) */}
          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex xl:gap-10">
            <div className="max-w-sm space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-text-primary">{heading}</h1>
                <p className="text-text-secondary">{subtitle}</p>
              </div>

              <ul className="space-y-3">
                {features.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-center gap-3 text-sm text-text-secondary"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <feature.icon className="size-4" aria-hidden="true" />
                    </span>
                    {feature.label}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-text-secondary">{bottomPrompt}</p>
            </div>

            <div className="relative hidden h-56 w-64 shrink-0 items-center justify-center xl:flex">
              <img
                src={loginIllustration}
                alt=""
                className="h-full w-full rounded-[2rem] bg-primary-100 object-contain p-4 shadow-modal"
              />
              <span className="absolute -top-2 -left-4 flex size-11 items-center justify-center rounded-full bg-surface-raised text-success-500 shadow-modal">
                <MessageCircle className="size-4" aria-hidden="true" />
              </span>
              <span className="absolute -right-6 top-8 flex size-11 items-center justify-center rounded-full bg-surface-raised text-primary-600 shadow-modal">
                <Calendar className="size-4" aria-hidden="true" />
              </span>
              <span className="absolute -left-8 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface-raised text-primary-600 shadow-modal">
                <Users className="size-4" aria-hidden="true" />
              </span>
              <span className="absolute -right-8 bottom-10 flex size-11 items-center justify-center rounded-full bg-surface-raised text-info-500 shadow-modal">
                <Link2 className="size-4" aria-hidden="true" />
              </span>
              <span className="absolute -bottom-4 left-1/2 flex size-11 -translate-x-1/2 items-center justify-center rounded-full bg-surface-raised text-success-500 shadow-modal">
                <CalendarCheck className="size-4" aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* Right: auth card */}
          <div className="flex w-full items-center justify-center py-4 sm:py-6 lg:w-[400px] lg:shrink-0 xl:w-[430px]">
            <div className="w-full max-w-[22rem] space-y-5 rounded-2xl border border-border bg-surface-raised p-6 shadow-modal sm:p-7 lg:p-8">
              <h2 className="text-xl font-bold text-text-primary">{cardTitle}</h2>

              {children}

              <p className="text-center text-sm text-text-secondary lg:hidden">{bottomPrompt}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
