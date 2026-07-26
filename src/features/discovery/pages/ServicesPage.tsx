import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/Button';
import { Reveal, RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';
import { HowItWorksSection } from '@/features/discovery/components/HowItWorksSection';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { useAuth } from '@/shared/hooks/useAuth';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';

const iconMap = Icons as unknown as Record<string, LucideIcon>;

export function ServicesPage() {
  const { user } = useAuth();

  return (
    <PageContainer className="space-y-14">
      <Helmet>
        <title>{en.marketing.servicesPageTitle} | Social Circle</title>
        <meta name="description" content={en.marketing.servicesMetaDescription} />
      </Helmet>

      <section className="marketing-dark relative overflow-hidden rounded-3xl bg-background px-6 py-20 text-center sm:py-28">
        <Reveal className="relative mx-auto max-w-2xl space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
            {en.marketing.servicesHeroEyebrow}
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {en.marketing.servicesHeroTitle}
          </h1>
          <p className="mx-auto max-w-xl text-base text-text-secondary sm:text-lg">
            {en.marketing.servicesHeroSubtitle}
          </p>
        </Reveal>
      </section>

      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {en.marketing.services.map((service) => {
          const Icon = iconMap[service.icon] ?? Icons.Circle;
          return (
            <RevealItem
              key={service.title}
              className="space-y-3 rounded-2xl border border-border bg-surface p-6 transition-transform duration-normal hover:-translate-y-1"
            >
              <div
                className="flex size-11 items-center justify-center rounded-xl text-text-inverse"
                style={{ background: 'var(--gradient-brand)' }}
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">{service.title}</h3>
              <p className="text-sm text-text-secondary">{service.body}</p>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <HowItWorksSection />

      <Reveal className="marketing-dark overflow-hidden rounded-3xl bg-background px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
          {en.marketing.servicesCtaTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary sm:text-base">
          {en.marketing.servicesCtaSubtitle}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white px-7 text-neutral-900 hover:bg-neutral-200"
          >
            <Link to={ROUTES.signup}>{en.marketing.servicesCtaPrimaryCta}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-border-strong bg-transparent px-7 text-text-primary hover:bg-surface"
          >
            <Link to={ROUTES.home}>{en.marketing.servicesCtaSecondaryCta}</Link>
          </Button>
        </div>
      </Reveal>

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
