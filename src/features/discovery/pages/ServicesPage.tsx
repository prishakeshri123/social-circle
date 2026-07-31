import { Helmet } from 'react-helmet-async';
import { Compass, CreditCard, MessageCircle, Sparkles, Ticket } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { Reveal, RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { useAuth } from '@/shared/hooks/useAuth';
import { en } from '@/shared/constants/locales/en';
import { getIcon } from '@/shared/utils/iconRegistry';
import servicesIllustration from '@/assets/images/services.png';
import { CommunityCtaSection } from '../components/CommunityCtaSection';

export function ServicesPage() {
  const { user } = useAuth();

  return (
    <PageContainer className="space-y-14">
      <Helmet>
        <title>{en.marketing.servicesPageTitle} | Social Circle</title>
        <meta name="description" content={en.marketing.servicesMetaDescription} />
      </Helmet>

      {/* Hero: same split-layout pattern as Clubs/Events (gradient + dotted
          backdrop, illustration with floating badges) — no search, this page
          isn't a filterable listing. */}
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
            <Reveal className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                {en.marketing.servicesHeroEyebrow}
              </span>
              <h1 className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                {en.marketing.servicesHeroTitle}
                <Sparkles
                  className="hidden size-6 shrink-0 text-accent-500 sm:block"
                  aria-hidden="true"
                />
              </h1>
              <p className="max-w-lg text-sm text-text-secondary sm:text-base">
                {en.marketing.servicesHeroSubtitle}
              </p>
            </Reveal>

            <Reveal className="relative mx-auto w-full max-w-sm">
              <img
                src={servicesIllustration}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="w-full object-contain"
              />
              <span className="absolute -left-2 top-6 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-primary-600 shadow-modal">
                <Compass className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-primary-600 shadow-modal">
                <Ticket className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute -right-2 top-1/2 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-success-500 shadow-modal">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <span className="absolute bottom-2 right-8 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-warning-500 shadow-modal">
                <CreditCard className="size-5" aria-hidden="true" />
              </span>
            </Reveal>
          </div>
        </div>
      </section>

      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {en.marketing.services.map((service) => {
          const Icon = getIcon(service.icon);
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

      <CommunityCtaSection />

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
