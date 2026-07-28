import { LegalPageTemplate } from '@/features/discovery/components/LegalPageTemplate';
import { en } from '@/shared/constants/locales/en';
import privacyIllustration from '@/assets/images/privacy-policy.svg';

export function PrivacyPolicyPage() {
  return <LegalPageTemplate content={en.legal.privacy} illustration={privacyIllustration} />;
}
