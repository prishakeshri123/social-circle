import { Helmet } from 'react-helmet-async';
import { Heart, MessageCircle, Users } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { Reveal, RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { CommunityCtaSection } from '@/features/discovery/components/CommunityCtaSection';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { useAuth } from '@/shared/hooks/useAuth';
import { useAboutContent } from '@/features/discovery/hooks/useContent';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { getIcon } from '@/shared/utils/iconRegistry';
import aboutIllustration from '@/assets/images/about-us.svg';

export function AboutPage() {
  const { user } = useAuth();
  const { data, isPending, isError } = useAboutContent();

  if (isPending) return <LoadingSpinner className="min-h-[50vh]" />;
  if (isError || !data) return <EmptyState title={en.errors.networkError} />;

  return (
    <PageContainer className="space-y-16">
      <Helmet>
        <title>{data.pageTitle} | Social Circle</title>
        <meta name="description" content={data.metaDescription} />
      </Helmet>

      <section className="grid grid-cols-1 items-center gap-10 py-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
            {data.heroEyebrow}
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl">
            {data.heroTitleLine1}
            <br />
            {data.heroTitleLine2Prefix}
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              {data.heroTitleHighlight}
            </span>
          </h1>
          <p className="max-w-lg text-base text-text-secondary sm:text-lg">{data.heroSubtitle}</p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            {data.stats.map((stat) => {
              const Icon = getIcon(stat.icon);
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xl font-bold text-text-primary">{stat.value}</span>
                    <span className="block text-xs text-text-secondary">{stat.label}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="mx-auto w-full max-w-md">
          <div className="relative rounded-[2rem] bg-surface p-3 shadow-modal">
            <img
              src={aboutIllustration}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="aspect-square w-full rounded-[1.6rem] bg-primary-50 object-contain p-6"
            />

            <div className="absolute inset-x-4 bottom-4 rounded-[1.4rem] border border-white/60 bg-white/90 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <Users className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{data.heroHighlight}</p>
                  <p className="text-xs text-text-secondary">{data.heroCardSubtitle}</p>
                </div>
              </div>
            </div>

            <span className="absolute -left-4 top-8 flex size-11 items-center justify-center rounded-2xl bg-surface text-error-500 shadow-modal">
              <Heart className="size-5 fill-current" aria-hidden="true" />
            </span>
            <span className="absolute right-6 -top-4 flex size-11 items-center justify-center rounded-2xl bg-surface text-primary-600 shadow-modal">
              <MessageCircle className="size-5" aria-hidden="true" />
            </span>
            <span className="absolute -right-4 top-1/3 flex size-11 items-center justify-center rounded-2xl bg-surface text-error-500 shadow-modal">
              <Heart className="size-5 fill-current" aria-hidden="true" />
            </span>
          </div>
        </Reveal>
      </section>

      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {data.missionEyebrow}
          </p>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">{data.missionTitle}</h2>
          <p className="text-sm text-text-secondary sm:text-base">{data.missionBody}</p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.missionFeatures.map((feature) => {
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

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:items-center lg:gap-8">
        <Reveal className="space-y-4 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {data.storyEyebrow}
          </p>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">{data.storyTitle}</h2>
          <p className="text-sm text-text-secondary sm:text-base">{data.storyBody[0]}</p>
        </Reveal>

        <div className="relative lg:col-span-2">
          <div
            className="absolute inset-x-0 top-5 hidden border-t border-dashed border-border sm:block"
            aria-hidden="true"
          />
          <RevealGroup className="relative grid grid-cols-2 gap-8 sm:grid-cols-4">
            {data.storyTimeline.map((step) => {
              const Icon = getIcon(step.icon);
              return (
                <RevealItem
                  key={step.title}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-4 ring-surface">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                    {step.year}
                  </p>
                  <h3 className="text-sm font-semibold text-text-primary">{step.title}</h3>
                  <p className="text-xs text-text-secondary">{step.body}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {data.valuesEyebrow}
          </p>
          <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">
            {data.valuesTitle}
          </h2>
        </div>
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.values.map((value) => {
            const Icon = getIcon(value.icon);
            return (
              <RevealItem
                key={value.title}
                className="space-y-3 rounded-2xl border border-border bg-surface p-6 text-center transition-transform duration-normal hover:-translate-y-1"
              >
                <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{value.title}</h3>
                <p className="text-sm text-text-secondary">{value.body}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <CommunityCtaSection
        title={data.ctaTitle}
        subtitle={data.ctaSubtitle}
        primaryCta={data.ctaPrimaryCta}
        primaryTo={ROUTES.clubs}
        secondaryCta={data.ctaSecondaryCta}
        secondaryTo={ROUTES.services}
      />

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
