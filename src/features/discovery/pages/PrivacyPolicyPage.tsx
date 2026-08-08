import { LegalPageTemplate } from '@/features/discovery/components/LegalPageTemplate';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useLegalContent } from '@/features/discovery/hooks/useContent';
import { en } from '@/shared/constants/locales/en';
import privacyIllustration from '@/assets/images/privacy-policy.svg';

export function PrivacyPolicyPage() {
  const { data, isPending, isError } = useLegalContent('privacy');

  if (isPending) return <LoadingSpinner className="min-h-[50vh]" />;
  if (isError || !data) return <EmptyState title={en.errors.networkError} />;

  return <LegalPageTemplate content={data} illustration={privacyIllustration} />;
}
