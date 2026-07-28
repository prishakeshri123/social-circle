import { LegalPageTemplate } from '@/features/discovery/components/LegalPageTemplate';
import { en } from '@/shared/constants/locales/en';
import refundIllustration from '@/assets/images/refund.svg';

export function RefundPolicyPage() {
  return <LegalPageTemplate content={en.legal.refundPolicy} illustration={refundIllustration} />;
}
