import { useState, type FormEvent, type SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Logo } from '@/shared/components/layout/Logo';
import { toast } from '@/shared/components/ui/Toast';
import { emailSchema } from '@/shared/utils/validators';

const FOOTER_LINK_CLASS =
  'text-text-secondary transition-colors duration-fast hover:text-primary-500';
const FOOTER_HEADING_CLASS = 'text-xs font-semibold uppercase tracking-wider text-text-muted';

function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.1 23.7v-8H6.6v-3.67h2.47v-1.58c0-4.08 1.85-5.97 5.86-5.97.4 0 .95.04 1.46.1v3.33h-.62c-1.5 0-2.02.71-2.02 2.13v1.99h3.92l-.39 3.67h-3.53v8h-4.65Z" />
    </svg>
  );
}

function TwitterGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.64 4.94a9.3 9.3 0 0 1-2.67.73 4.67 4.67 0 0 0 2.05-2.58 9.36 9.36 0 0 1-2.96 1.13 4.65 4.65 0 0 0-7.93 4.24A13.2 13.2 0 0 1 2.5 3.66a4.65 4.65 0 0 0 1.44 6.2 4.6 4.6 0 0 1-2.1-.58v.06a4.65 4.65 0 0 0 3.73 4.56 4.7 4.7 0 0 1-2.1.08 4.66 4.66 0 0 0 4.35 3.23A9.34 9.34 0 0 1 1 19.13a13.17 13.17 0 0 0 7.14 2.09c8.57 0 13.26-7.1 13.26-13.26l-.02-.6a9.5 9.5 0 0 0 2.32-2.42Z" />
    </svg>
  );
}

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.42.56.21.96.48 1.38.9.42.42.68.81.9 1.38.17.42.37 1.05.42 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.42-.37-1.06-.42-2.23-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42 1.27-.06 1.64-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07c-1.27.06-2.15.26-2.91.56a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .62 4.15c-.3.76-.5 1.64-.56 2.91C0 8.33 0 8.74 0 12s.01 3.67.07 4.94c.06 1.27.26 2.15.56 2.91a5.9 5.9 0 0 0 1.39 2.13 5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 24 8.74 24 12 24s3.67 0 4.94-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.39-2.13c.3-.76.5-1.64.56-2.91.06-1.27.07-1.68.07-4.94s-.01-3.67-.07-4.94c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.39-2.13A5.9 5.9 0 0 0 19.85.63c-.76-.3-1.64-.5-2.91-.56C15.67 0 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}

function LinkedInGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.86-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function AppleGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
    </svg>
  );
}

function GooglePlayGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      {/* Play-store-style triangle, divided into 4 wedges meeting at a shared centre point */}
      <path d="M5 4 16 9 13 12Z" fill="#00C3FF" />
      <path d="M16 9 20 12 16 15 13 12Z" fill="#FF3D00" />
      <path d="M16 15 5 20 13 12Z" fill="#00E177" />
      <path d="M5 20 5 4 13 12Z" fill="#FFCE00" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { icon: FacebookGlyph, label: 'Facebook' },
  { icon: TwitterGlyph, label: 'Twitter' },
  { icon: InstagramGlyph, label: 'Instagram' },
  { icon: LinkedInGlyph, label: 'LinkedIn' },
] as const;

const QUICK_LINKS = [
  { label: en.marketing.footerLinkAboutUs, to: ROUTES.about },
  { label: en.nav.services, to: ROUTES.services },
  { label: en.marketing.howItWorksPageTitle, to: ROUTES.howItWorks },
  { label: en.marketing.footerLinkFaqs, to: `${ROUTES.home}#faqs` },
  { label: en.marketing.footerLinkContactUs, to: ROUTES.contact },
] as const;

const MEMBER_LINKS = [
  { label: en.marketing.footerLinkOurClubs, to: ROUTES.clubs },
  { label: en.marketing.footerLinkUpcomingEvents, to: ROUTES.events },
  { label: en.marketing.footerLinkMembershipPlans, to: ROUTES.subscriptions },
] as const;

const LEGAL_LINKS = [
  { label: en.marketing.footerLinkPrivacyPolicy, to: ROUTES.privacyPolicy },
  { label: en.marketing.footerLinkTermsOfService, to: ROUTES.terms },
  { label: en.marketing.footerLinkCookiePolicy, to: ROUTES.cookiePolicy },
  { label: en.legal.refundPolicy.heading, to: ROUTES.refundPolicy },
] as const;

function AppStoreBadges() {
  function handleClick() {
    toast(en.marketing.footerAppComingSoon);
  }

  return (
    <div className="space-y-3">
      <p className={FOOTER_HEADING_CLASS}>{en.marketing.footerAppHeading}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleClick}
          aria-label={en.marketing.footerAppAppStoreLabel}
          className="flex size-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-fast hover:border-primary-500 hover:text-primary-500"
        >
          <AppleGlyph className="size-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleClick}
          aria-label={en.marketing.footerAppGooglePlayLabel}
          className="flex size-8 items-center justify-center rounded-full border border-border transition-colors duration-fast hover:border-primary-500"
        >
          <GooglePlayGlyph className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function FooterNewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setEmail('');
    toast.success(en.marketing.newsletterSuccess);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={en.marketing.newsletterPlaceholder}
          aria-label={en.marketing.newsletterPlaceholder}
          className="border-white/15 bg-white/5 text-sm text-white placeholder:text-neutral-500"
        />
        <Button type="submit" size="icon" aria-label={en.marketing.newsletterCta}>
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </div>
      {error && <p className="text-xs text-error-500">{error}</p>}
    </form>
  );
}

export function MarketingFooter() {
  return (
    <footer className="marketing-dark relative left-1/2 -mx-[50vw] w-screen border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-6 lg:grid-cols-5">
        <div className="col-span-2 space-y-3 lg:col-span-1">
          <Logo onDark />
          <p className="text-xs text-text-muted">{en.marketing.footerTagline}</p>
          <div className="flex items-center gap-2 pt-1">
            {SOCIAL_LINKS.map((social) => (
              <span
                key={social.label}
                aria-label={social.label}
                className="flex size-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-fast hover:border-primary-500 hover:text-primary-500"
              >
                <social.icon className="size-3.5" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>

        <nav aria-label={en.marketing.footerExploreHeading} className="space-y-3">
          <p className={FOOTER_HEADING_CLASS}>{en.marketing.footerExploreHeading}</p>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className={FOOTER_LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={en.marketing.footerAccountHeading} className="space-y-3">
          <p className={FOOTER_HEADING_CLASS}>{en.marketing.footerAccountHeading}</p>
          <ul className="space-y-2 text-sm">
            {MEMBER_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className={FOOTER_LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <AppStoreBadges />

        <div className="col-span-2 space-y-3 lg:col-span-1">
          <p className={FOOTER_HEADING_CLASS}>{en.marketing.footerNewsletterHeading}</p>
          <p className="text-sm text-text-secondary">{en.marketing.footerNewsletterBody}</p>
          <FooterNewsletterForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-5 text-xs text-text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>{en.marketing.footerCopyright(new Date().getFullYear())}</p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className={FOOTER_LINK_CLASS}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
