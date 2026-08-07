import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { useAuth } from '@/shared/hooks/useAuth';
import { useClub } from '@/features/clubs/hooks/useClub';
import { ClubHero } from '@/features/clubs/components/ClubHero';
import { ClubDetailsCard } from '@/features/clubs/components/ClubDetailsCard';
import { ClubAboutSection } from '@/features/clubs/components/ClubAboutSection';
import { ClubHighlightsStrip } from '@/features/clubs/components/ClubHighlightsStrip';
import { ClubGalleryPreview } from '@/features/clubs/components/ClubGalleryPreview';
import { ClubEventsStrip } from '@/features/clubs/components/ClubEventsStrip';
import { ClubMembersPreview } from '@/features/clubs/components/ClubMembersPreview';
import { ClubFaqAccordion } from '@/features/clubs/components/ClubFaqAccordion';
import { ClubShareBar } from '@/features/clubs/components/ClubShareBar';
import { ClubStickyMobileBar } from '@/features/clubs/components/ClubStickyMobileBar';

export function ClubLandingPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { data: club, isPending, isError } = useClub(slug);

  if (isPending) return <LoadingSpinner className="min-h-[50vh]" />;

  if (isError || !club) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState title={en.clubLanding.notFoundTitle} />
      </div>
    );
  }

  const isMember = Boolean(user && user.id === club.ownerId);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const description = club.about
    ? club.about.replace(/<[^>]+>/g, '').slice(0, 160)
    : (club.tagline ?? '');

  return (
    <div className="auth-neon pb-20 md:pb-8">
      <Helmet>
        <title>{`${club.name} — ${club.tagline ?? ''} | Social Circle`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={club.name} />
        <meta property="og:description" content={description} />
        {club.bannerUrl && <meta property="og:image" content={club.bannerUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: club.name,
            url,
            logo: club.logoUrl,
            description,
          })}
        </script>
      </Helmet>

      <ClubHero club={club} />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
          {club.about && (
            <ClubAboutSection
              about={club.about}
              mission={club.mission}
              codeOfConduct={club.codeOfConduct}
            />
          )}
          <ClubHighlightsStrip highlights={club.highlights} />
          <ClubGalleryPreview images={club.galleryImages} />
          <ClubEventsStrip clubId={club.id} />
          <ClubMembersPreview memberCount={club.memberCount} />
          <ClubFaqAccordion faqs={club.faqs} />
        </div>

        <div className="order-1 space-y-6 lg:order-2">
          <div className="lg:sticky lg:top-20 lg:space-y-6">
            <ClubDetailsCard club={club} isMember={isMember} />
            <ClubShareBar clubName={club.name} url={url} />
          </div>
        </div>
      </div>

      <ClubStickyMobileBar club={club} isMember={isMember} />
    </div>
  );
}
