import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Target, Eye } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/Button';
import { Reveal, RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';
import { StatsStrip } from '@/features/discovery/components/StatsStrip';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { useAuth } from '@/shared/hooks/useAuth';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';

const iconMap = Icons as unknown as Record<string, LucideIcon>;

export function AboutPage() {
  const { user } = useAuth();

  return (
    <PageContainer className="space-y-14">
      <Helmet>
        <title>{en.marketing.aboutPageTitle} | Social Circle</title>
        <meta name="description" content={en.marketing.aboutMetaDescription} />
      </Helmet>

      <section className="marketing-dark relative overflow-hidden rounded-3xl bg-background px-6 py-20 text-center sm:py-28">
        <Reveal className="relative mx-auto max-w-2xl space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
            {en.marketing.aboutHeroEyebrow}
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {en.marketing.aboutHeroTitle}
          </h1>
          <p className="mx-auto max-w-xl text-base text-text-secondary sm:text-lg">
            {en.marketing.aboutHeroSubtitle}
          </p>
        </Reveal>
      </section>

      <StatsStrip />

      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <RevealItem className="space-y-3 rounded-2xl border border-border bg-surface p-8">
          <div
            className="flex size-11 items-center justify-center rounded-xl text-text-inverse"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Target className="size-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {en.marketing.missionEyebrow}
          </p>
          <h2 className="text-xl font-semibold text-text-primary">{en.marketing.missionTitle}</h2>
          <p className="text-sm text-text-secondary">{en.marketing.missionBody}</p>
        </RevealItem>

        <RevealItem className="space-y-3 rounded-2xl border border-border bg-surface p-8">
          <div
            className="flex size-11 items-center justify-center rounded-xl text-text-inverse"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Eye className="size-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {en.marketing.visionEyebrow}
          </p>
          <h2 className="text-xl font-semibold text-text-primary">{en.marketing.visionTitle}</h2>
          <p className="text-sm text-text-secondary">{en.marketing.visionBody}</p>
        </RevealItem>
      </RevealGroup>

      <section className="space-y-8">
        <h2 className="text-center text-2xl font-semibold text-text-primary sm:text-3xl">
          {en.marketing.valuesTitle}
        </h2>
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {en.marketing.values.map((value) => {
            const Icon = iconMap[value.icon] ?? Icons.Circle;
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

      <Reveal className="mx-auto max-w-2xl space-y-4">
        <h2 className="text-center text-2xl font-semibold text-text-primary sm:text-3xl">
          {en.marketing.storyTitle}
        </h2>
        {en.marketing.storyBody.map((paragraph) => (
          <p key={paragraph} className="text-sm text-text-secondary sm:text-base">
            {paragraph}
          </p>
        ))}
      </Reveal>

      <Reveal className="marketing-dark overflow-hidden rounded-3xl bg-background px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
          {en.marketing.aboutCtaTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary sm:text-base">
          {en.marketing.aboutCtaSubtitle}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white px-7 text-neutral-900 hover:bg-neutral-200"
          >
            <Link to={ROUTES.signup}>{en.marketing.aboutCtaPrimaryCta}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-border-strong bg-transparent px-7 text-text-primary hover:bg-surface"
          >
            <Link to={ROUTES.home}>{en.marketing.aboutCtaSecondaryCta}</Link>
          </Button>
        </div>
      </Reveal>

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
