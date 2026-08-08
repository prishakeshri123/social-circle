import { LegalPageTemplate } from '@/features/discovery/components/LegalPageTemplate';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useLegalContent } from '@/features/discovery/hooks/useContent';
import { en } from '@/shared/constants/locales/en';
import termsIllustration from '@/assets/images/accept-terms.svg';

export function TermsPage() {
  const { data, isPending, isError } = useLegalContent('terms');

  if (isPending) return <LoadingSpinner className="min-h-[50vh]" />;
  if (isError || !data) return <EmptyState title={en.errors.networkError} />;

  return <LegalPageTemplate content={data} illustration={termsIllustration} />;
}
