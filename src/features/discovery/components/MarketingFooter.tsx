import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';

const FOOTER_LINK_CLASS =
  'text-text-secondary transition-colors duration-fast hover:text-primary-500';
const FOOTER_HEADING_CLASS = 'text-xs font-semibold uppercase tracking-wider text-text-muted';

export function MarketingFooter() {
  return (
    <footer className="marketing-dark relative left-1/2 -mx-[50vw] w-screen border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-6 lg:grid-cols-4">
        <div className="col-span-2 space-y-3 lg:col-span-1">
          <Link to={ROUTES.home} className="flex items-center gap-1.5 text-lg font-semibold">
            <Sparkles className="size-5 text-primary-500" aria-hidden="true" />
            <span className="gradient-text">{en.app.name}</span>
          </Link>
          <p className="text-xs text-text-muted">
            {en.marketing.footerCopyright(new Date().getFullYear())}
          </p>
        </div>

        <nav aria-label={en.marketing.footerExploreHeading} className="space-y-3">
          <p className={FOOTER_HEADING_CLASS}>{en.marketing.footerExploreHeading}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={ROUTES.home} className={FOOTER_LINK_CLASS}>
                {en.nav.home}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.about} className={FOOTER_LINK_CLASS}>
                {en.nav.about}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.services} className={FOOTER_LINK_CLASS}>
                {en.nav.services}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.search} className={FOOTER_LINK_CLASS}>
                {en.marketing.footerLinkOurClubs}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={en.marketing.footerAccountHeading} className="space-y-3">
          <p className={FOOTER_HEADING_CLASS}>{en.marketing.footerAccountHeading}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={ROUTES.contact} className={FOOTER_LINK_CLASS}>
                {en.marketing.footerLinkContactUs}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.contact} className={FOOTER_LINK_CLASS}>
                {en.marketing.footerLinkEnquiry}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.login} className={FOOTER_LINK_CLASS}>
                {en.marketing.footerLinkMemberSignIn}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.signup} className={FOOTER_LINK_CLASS}>
                {en.marketing.footerLinkCreateAccount}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-3">
          <p className={FOOTER_HEADING_CLASS}>{en.marketing.footerContactHeading}</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
              <a href={`mailto:${en.marketing.footerContactEmail}`} className={FOOTER_LINK_CLASS}>
                {en.marketing.footerContactEmail}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
              <a href={`tel:${en.marketing.footerContactPhone}`} className={FOOTER_LINK_CLASS}>
                {en.marketing.footerContactPhone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
              <span className="text-text-secondary">{en.marketing.footerContactAddress}</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
