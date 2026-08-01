import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CalendarDays, ShieldCheck } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { Reveal, RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { useAuth } from '@/shared/hooks/useAuth';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/utils/cn';
import { getIcon } from '@/shared/utils/iconRegistry';

interface LegalSection {
  readonly heading: string;
  readonly icon?: string;
  readonly body?: readonly string[];
  readonly list?: readonly string[];
}

export interface LegalPageContent {
  readonly pageTitle: string;
  readonly metaDescription: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro: string;
  readonly calloutText?: string;
  readonly sections: readonly LegalSection[];
}

interface LegalPageTemplateProps {
  content: LegalPageContent;
  illustration?: string;
}

export function LegalPageTemplate({ content, illustration }: LegalPageTemplateProps) {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        }
      },
      { rootMargin: '-112px 0px -70% 0px', threshold: 0 },
    );

    for (const el of sectionRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [content]);

  function scrollToSection(index: number) {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <PageContainer className="space-y-10">
      <Helmet>
        <title>{content.pageTitle} | Social Circle</title>
        <meta name="description" content={content.metaDescription} />
      </Helmet>

      <section
        className={cn(
          'mt-6 grid grid-cols-1 items-center gap-6 rounded-3xl bg-primary-50 px-6 py-6 sm:px-10 sm:py-7',
          illustration && 'lg:grid-cols-2 lg:gap-16',
        )}
      >
        <Reveal className={cn('space-y-3', !illustration && 'mx-auto max-w-2xl text-center')}>
          <p className="text-xs font-bold uppercase tracking-wider gradient-text">
            {content.eyebrow}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {content.heading}
          </h1>
          <p className="text-sm text-text-secondary sm:text-base">{content.intro}</p>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-medium text-text-muted',
              !illustration && 'justify-center',
            )}
          >
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {en.legal.lastUpdatedLabel}: {en.legal.lastUpdatedDate}
          </div>
        </Reveal>

        {illustration && (
          <Reveal className="mx-auto w-full max-w-[10rem] sm:max-w-[13rem]">
            <img
              src={illustration}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full object-contain"
            />
          </Reveal>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
        <div className="space-y-4 lg:sticky lg:top-24">
          <nav
            aria-label={en.legal.sidebarHeading}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <p className="px-3 text-xs font-bold uppercase tracking-wide gradient-text">
              {en.legal.sidebarHeading}
            </p>
            <ul className="mt-2 space-y-1">
              {content.sections.map((section, index) => (
                <li key={section.heading}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(index)}
                    className={cn(
                      'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors duration-fast',
                      activeIndex === index
                        ? 'bg-primary-50 font-semibold gradient-text'
                        : 'text-text-secondary hover:bg-primary-50/60 hover:text-text-primary',
                    )}
                  >
                    {section.heading}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {content.calloutText && (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <p className="text-xs leading-relaxed text-text-secondary">{content.calloutText}</p>
            </div>
          )}
        </div>

        <RevealGroup className="space-y-8 rounded-2xl border border-border bg-surface p-6 sm:p-10">
          {content.sections.map((section, index) => {
            const Icon = getIcon(section.icon);
            return (
              <RevealItem
                key={section.heading}
                ref={(el: HTMLDivElement | null) => {
                  sectionRefs.current[index] = el;
                }}
                data-index={index}
                className="scroll-mt-28 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="text-lg font-semibold text-text-primary">{section.heading}</h2>
                </div>
                <div className="space-y-3 pl-14">
                  {section.body?.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-text-secondary">
                      {paragraph}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-text-secondary">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>

      <Reveal className="rounded-2xl bg-primary-50 p-6 text-center sm:p-8">
        <h2 className="text-lg font-semibold text-text-primary">{en.legal.contactCtaTitle}</h2>
        <p className="mt-2 text-sm text-text-secondary">{en.legal.contactCtaBody}</p>
        <Link
          to={ROUTES.contact}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          {en.legal.contactCtaCta}
        </Link>
      </Reveal>

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
