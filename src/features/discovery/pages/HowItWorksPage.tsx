import { Helmet } from 'react-helmet-async';
import { Compass, MessageCircle, UserPlus, Users } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { Reveal, RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { HowItWorksSection } from '@/features/discovery/components/HowItWorksSection';
import { CommunityCtaSection } from '@/features/discovery/components/CommunityCtaSection';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { useAuth } from '@/shared/hooks/useAuth';
import { useHowItWorksContent } from '@/features/discovery/hooks/useContent';
import { en } from '@/shared/constants/locales/en';
import { getIcon } from '@/shared/utils/iconRegistry';
import howItWorksIllustration from '@/assets/images/how-it-works.png';

export function HowItWorksPage() {
  const { user } = useAuth();
  const { data, isPending, isError } = useHowItWorksContent();

  if (isPending) return <LoadingSpinner className="min-h-[50vh]" />;
  if (isError || !data) return <EmptyState title={en.errors.networkError} />;

  return (
    <PageContainer className="space-y-14">
      <Helmet>
        <title>{data.pageTitle} | Social Circle</title>
        <meta name="description" content={data.metaDescription} />
      </Helmet>

      {/* Hero: same split-layout pattern as Clubs/Events/Services — no search,
          this page walks through the process rather than listing anything. */}
      <section className="relative left-1/2 -mx-[50vw] w-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-500/5">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                {data.heroEyebrow}
              </span>
              <h1 className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                {data.pageTitle}
              </h1>
              <p className="max-w-lg text-sm text-text-secondary sm:text-base">
                {data.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                {data.stats.map((stat) => {
                  const Icon = getIcon(stat.icon);
                  return (
                    <div key={stat.label} className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-xl font-bold text-text-primary">
                          {stat.value}
                        </span>
                        <span className="block text-xs text-text-secondary">{stat.label}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal className="relative mx-auto w-full max-w-sm">
              <img
                src={howItWorksIllustration}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="w-full object-contain"
              />
              <span className="absolute -left-2 top-6 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-primary-600 shadow-modal">
                <Compass className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-primary-600 shadow-modal">
                <UserPlus className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute -right-2 top-1/2 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-success-500 shadow-modal">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute bottom-2 right-8 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-warning-500 shadow-modal">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
            </Reveal>
          </div>
        </div>
      </section>

      <HowItWorksSection eyebrow={data.stepsEyebrow} title={data.stepsTitle} steps={data.steps} />

      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {data.whyEyebrow}
          </p>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">{data.whyTitle}</h2>
          <p className="text-sm text-text-secondary sm:text-base">{data.whyBody}</p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.whyFeatures.map((feature) => {
            const Icon = getIcon(feature.icon);
            return (
              <RevealItem
                key={feature.title}
                className="space-y-3 rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.body}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <CommunityCtaSection />

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
