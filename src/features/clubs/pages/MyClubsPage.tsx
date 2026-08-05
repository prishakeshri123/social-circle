import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { MY_CLUBS_EVENTS_SCAN_LIMIT } from '@/shared/constants/app.constants';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useEventsFeed } from '@/features/events/hooks/useEventsFeed';
import { MyClubCard } from '@/features/clubs/components/MyClubCard';
import { MyClubCardSkeleton } from '@/features/clubs/components/MyClubCardSkeleton';
import { ClubsYouMightLikeSection } from '@/features/clubs/components/ClubsYouMightLikeSection';

export function MyClubsPage() {
  const navigate = useNavigate();

  const myClubsQuery = useMyClubs();
  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();
  const eventsQuery = useEventsFeed({ limit: MY_CLUBS_EVENTS_SCAN_LIMIT });

  const myClubs = useMemo(() => myClubsQuery.data ?? [], [myClubsQuery.data]);

  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  const unreadByClub = useMemo(() => {
    const map = new Map<string, number>();
    for (const conversation of conversationsQuery.data ?? []) {
      if (conversation.kind !== 'group' || !conversation.clubId) continue;
      map.set(conversation.clubId, (map.get(conversation.clubId) ?? 0) + conversation.unreadCount);
    }
    return map;
  }, [conversationsQuery.data]);

  const eventsByClub = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of eventsQuery.data?.data ?? []) {
      map.set(event.clubId, (map.get(event.clubId) ?? 0) + 1);
    }
    return map;
  }, [eventsQuery.data]);

  return (
    <div className="flex items-start">
      <Helmet>
        <title>{en.myClubs.title} | Social Circle</title>
      </Helmet>

      <Sidebar
        unreadChatsCount={unreadChatsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 md:flex"
      />

      <div className="min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{en.myClubs.title}</h1>
          <p className="mt-1 text-sm text-text-secondary">{en.myClubs.subtitle}</p>
        </div>

        {myClubsQuery.isPending && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <MyClubCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!myClubsQuery.isPending && myClubs.length === 0 && (
          <EmptyState
            icon={Search}
            title={en.empty.noClubsJoined}
            ctaLabel={en.empty.noClubsJoinedCta}
            onCtaClick={() => navigate(ROUTES.search)}
          />
        )}

        {!myClubsQuery.isPending && myClubs.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myClubs.map((club) => (
              <MyClubCard
                key={club.id}
                club={club}
                eventsCount={eventsByClub.get(club.id) ?? 0}
                unreadCount={unreadByClub.get(club.id) ?? 0}
              />
            ))}
          </div>
        )}

        <ClubsYouMightLikeSection />
      </div>
    </div>
  );
}
