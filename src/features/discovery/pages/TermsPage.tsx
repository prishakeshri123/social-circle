import { LegalPageTemplate } from '@/features/discovery/components/LegalPageTemplate';
import { en } from '@/shared/constants/locales/en';
import termsIllustration from '@/assets/images/accept-terms.svg';

export function TermsPage() {
  return <LegalPageTemplate content={en.legal.terms} illustration={termsIllustration} />;
}
