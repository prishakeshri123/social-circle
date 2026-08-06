import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { UserPlus } from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Card } from '@/shared/components/ui/Card';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useAcceptInvitation } from '@/features/clubs/hooks/useAcceptInvitation';
import { useDeclineInvitation } from '@/features/clubs/hooks/useDeclineInvitation';
import { InvitationCard } from '@/features/clubs/components/InvitationCard';
import { InvitationCardSkeleton } from '@/features/clubs/components/InvitationCardSkeleton';

export function InvitationsPage() {
  const navigate = useNavigate();

  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();
  const acceptMutation = useAcceptInvitation();
  const declineMutation = useDeclineInvitation();

  const invitations = invitationsQuery.data ?? [];
  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitations.length;

  return (
    <div className="flex items-start">
      <Helmet>
        <title>{en.invitations.title} | Social Circle</title>
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
            <h1 className="text-2xl font-bold text-text-primary">{en.invitations.title}</h1>
            {pendingInvitationsCount > 0 && (
              <span className="inline-flex h-5 items-center gap-1 rounded-full bg-primary-100 px-2 text-xs font-semibold text-primary-700">
                <UserPlus className="size-3" aria-hidden="true" />
                {en.invitations.pendingCount(pendingInvitationsCount)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-text-secondary">{en.invitations.subtitle}</p>
        </div>

        {invitationsQuery.isPending && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <InvitationCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!invitationsQuery.isPending && invitations.length === 0 && (
          <Card>
            <EmptyState
              icon={UserPlus}
              title={en.empty.noInvitations}
              ctaLabel={en.empty.noInvitationsCta}
              onCtaClick={() => navigate(ROUTES.clubs)}
            />
          </Card>
        )}

        {!invitationsQuery.isPending && invitations.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in">
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={(id) => acceptMutation.mutate(id)}
                onDecline={(id) => declineMutation.mutate(id)}
                isAccepting={acceptMutation.isPending && acceptMutation.variables === invitation.id}
                isDeclining={
                  declineMutation.isPending && declineMutation.variables === invitation.id
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
