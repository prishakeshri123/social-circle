import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Search, Users } from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/shared/hooks/useAuth';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { useUser } from '@/features/profile/hooks/useUser';
import { ProfileHero } from '@/features/profile/components/ProfileHero';
import { ProfileClubCard } from '@/features/profile/components/ProfileClubCard';

type ProfileTab = 'clubs' | 'activity';

export function ProfilePage() {
  const { userId = '' } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState<ProfileTab>('clubs');

  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();
  const profileQuery = useUser(userId);
  const isOwnProfile = currentUser?.id === userId;
  const myClubsQuery = useMyClubs();

  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  const clubs = isOwnProfile ? (myClubsQuery.data ?? []) : [];
  const clubsLoading = isOwnProfile && myClubsQuery.isPending;

  return (
    <div className="flex items-start">
      <Helmet>
        <title>
          {profileQuery.data ? `${profileQuery.data.fullName} | Social Circle` : en.profile.title}
        </title>
      </Helmet>

      <Sidebar
        unreadChatsCount={unreadChatsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 md:flex"
      />

      <div className="min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {profileQuery.isPending && (
          <Card className="overflow-hidden">
            <Skeleton className="h-36 w-full rounded-none sm:h-48" />
            <div className="space-y-3 px-6 pb-6 pt-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </Card>
        )}

        {profileQuery.isError && (
          <Card>
            <EmptyState
              icon={Users}
              title={en.profile.notFoundTitle}
              ctaLabel={en.actions.goHome}
              onCtaClick={() => navigate(ROUTES.home)}
            />
          </Card>
        )}

        {profileQuery.data && (
          <>
            <ProfileHero user={profileQuery.data} isOwnProfile={isOwnProfile} />

            <Tabs value={tab} onValueChange={(v) => setTab(v as ProfileTab)}>
              <TabsList className="w-full justify-start sm:w-fit">
                <TabsTrigger value="clubs">
                  <Users className="size-4" aria-hidden="true" />
                  {en.profile.tabClubs}
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Clock className="size-4" aria-hidden="true" />
                  {en.profile.tabActivity}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {tab === 'clubs' && (
              <>
                {clubsLoading && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                  </div>
                )}

                {!clubsLoading && isOwnProfile && clubs.length === 0 && (
                  <Card>
                    <EmptyState
                      icon={Search}
                      title={en.profile.clubsEmptyOwn}
                      ctaLabel={en.profile.clubsEmptyOwnCta}
                      onCtaClick={() => navigate(ROUTES.search)}
                    />
                  </Card>
                )}

                {!clubsLoading && !isOwnProfile && (
                  <Card>
                    <EmptyState icon={Users} title={en.profile.clubsEmptyOther} />
                  </Card>
                )}

                {!clubsLoading && isOwnProfile && clubs.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {clubs.map((club) => (
                      <ProfileClubCard key={club.id} club={club} />
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === 'activity' && (
              <Card>
                <EmptyState icon={Clock} title={en.profile.activityComingSoon} />
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
