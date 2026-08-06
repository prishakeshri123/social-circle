import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Card } from '@/shared/components/ui/Card';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { staggerChildren } from '@/shared/utils/animations';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useSavedClubs } from '@/features/clubs/hooks/useSavedClubs';
import { useUnsaveClub } from '@/features/clubs/hooks/useUnsaveClub';
import { SavedClubCard } from '@/features/clubs/components/SavedClubCard';
import { SavedClubCardSkeleton } from '@/features/clubs/components/SavedClubCardSkeleton';
import { ClubsYouMightLikeSection } from '@/features/clubs/components/ClubsYouMightLikeSection';

export function SavedClubsPage() {
  const navigate = useNavigate();

  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();
  const savedClubsQuery = useSavedClubs();
  const unsaveMutation = useUnsaveClub();

  const savedClubs = savedClubsQuery.data ?? [];
  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  return (
    <div className="flex items-start">
      <Helmet>
        <title>{en.savedClubs.title} | Social Circle</title>
      </Helmet>

      <Sidebar
        unreadChatsCount={unreadChatsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 md:flex"
      />

      <div className="min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              {en.savedClubs.title}
            </h1>
            {savedClubs.length > 0 && (
              <span className="inline-flex h-5 items-center gap-1 rounded-full bg-primary-100 px-2 text-xs font-semibold text-primary-700">
                <Bookmark className="size-3" aria-hidden="true" />
                {en.savedClubs.savedCount(savedClubs.length)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-text-secondary">{en.savedClubs.subtitle}</p>
        </div>

        {savedClubsQuery.isPending && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SavedClubCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!savedClubsQuery.isPending && savedClubs.length === 0 && (
          <Card>
            <EmptyState
              icon={Bookmark}
              title={en.empty.noSavedClubs}
              ctaLabel={en.empty.noSavedClubsCta}
              onCtaClick={() => navigate(ROUTES.search)}
            />
          </Card>
        )}

        {!savedClubsQuery.isPending && savedClubs.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {savedClubs.map((club) => (
                <SavedClubCard
                  key={club.id}
                  club={club}
                  onUnsave={(clubId) => unsaveMutation.mutate(clubId)}
                  isUnsaving={unsaveMutation.isPending && unsaveMutation.variables === club.id}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <ClubsYouMightLikeSection />
      </div>
    </div>
  );
}
