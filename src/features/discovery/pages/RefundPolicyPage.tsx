import { LegalPageTemplate } from '@/features/discovery/components/LegalPageTemplate';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useLegalContent } from '@/features/discovery/hooks/useContent';
import { en } from '@/shared/constants/locales/en';
import refundIllustration from '@/assets/images/refund.svg';

export function RefundPolicyPage() {
  const { data, isPending, isError } = useLegalContent('refund-policy');

  if (isPending) return <LoadingSpinner className="min-h-[50vh]" />;
  if (isError || !data) return <EmptyState title={en.errors.networkError} />;

  return <LegalPageTemplate content={data} illustration={refundIllustration} />;
}
