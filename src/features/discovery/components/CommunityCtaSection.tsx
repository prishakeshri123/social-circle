import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { Reveal } from '@/shared/components/ui/Reveal';
import clubGroupIllustration from '@/assets/images/club-group.svg';

interface CommunityCtaSectionProps {
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  primaryTo?: string;
  secondaryCta?: string;
  secondaryTo?: string;
}

export function CommunityCtaSection({
  title = en.marketing.ctaBannerTitle,
  subtitle = en.marketing.ctaBannerSubtitle,
  primaryCta = en.marketing.ctaBannerPrimaryCta,
  primaryTo = ROUTES.services,
  secondaryCta = en.marketing.ctaBannerSecondaryCta,
  secondaryTo = '#browse-clubs',
}: CommunityCtaSectionProps) {
  return (
    <section
      className="overflow-hidden rounded-2xl px-6 py-4 text-center text-white sm:px-10"
      style={{ background: 'var(--gradient-brand)' }}
    >
      <Reveal className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between sm:text-left">
        <div className="hidden shrink-0 sm:block">
          <img src={clubGroupIllustration} alt="" className="h-32 w-32 object-contain" />
        </div>

        <div className="sm:mr-auto">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/85 sm:mx-0 sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:shrink-0">
          <Button asChild size="lg" className="bg-white text-neutral-900 hover:bg-neutral-200">
            <Link to={primaryTo}>{primaryCta}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/10"
          >
            {secondaryTo.startsWith('#') ? (
              <a href={secondaryTo}>{secondaryCta}</a>
            ) : (
              <Link to={secondaryTo}>{secondaryCta}</Link>
            )}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
