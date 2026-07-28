import { LegalPageTemplate } from '@/features/discovery/components/LegalPageTemplate';
import { en } from '@/shared/constants/locales/en';
import cookieIllustration from '@/assets/images/cookie.png';

export function CookiePolicyPage() {
  return <LegalPageTemplate content={en.legal.cookiePolicy} illustration={cookieIllustration} />;
}
