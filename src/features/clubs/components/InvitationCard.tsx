import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { formatRelativeTime } from '@/shared/utils/formatDate';
import type { ClubInvitationWithClub } from '@/types/club.types';

interface InvitationCardProps {
  invitation: ClubInvitationWithClub;
  onAccept: (invitationId: string) => void;
  onDecline: (invitationId: string) => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
}

export function InvitationCard({
  invitation,
  onAccept,
  onDecline,
  isAccepting = false,
  isDeclining = false,
}: InvitationCardProps) {
  const isBusy = isAccepting || isDeclining;

  return (
    <Card className="group flex flex-col overflow-hidden p-0 transition-all duration-fast hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="h-1 w-full gradient-bg" aria-hidden="true" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <Link
          to={ROUTES.clubLanding(invitation.club.slug)}
          className="flex min-w-0 items-center gap-3"
        >
          <Avatar className="size-12 shrink-0 ring-2 ring-white shadow-sm">
            <AvatarImage src={invitation.club.logoUrl} alt="" />
            <AvatarFallback className="text-base font-semibold">
              {invitation.club.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold text-text-primary transition-colors duration-fast group-hover:text-primary-600">
              {invitation.club.name}
            </p>
            <p className="text-xs text-text-muted">{formatRelativeTime(invitation.createdAt)}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2.5 rounded-lg bg-surface px-3 py-2.5">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={invitation.invitedBy.avatarUrl} alt="" />
            <AvatarFallback className="text-xs">
              {invitation.invitedBy.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p className="min-w-0 truncate text-sm text-text-secondary">
            {en.invitations.invitedYouToJoin(invitation.invitedBy.fullName)}
          </p>
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isBusy}
            onClick={() => onDecline(invitation.id)}
            aria-label={`${en.invitations.declineCta} ${invitation.club.name}`}
          >
            {en.invitations.declineCta}
          </Button>
          <Button
            className="flex-1"
            disabled={isBusy}
            onClick={() => onAccept(invitation.id)}
            aria-label={`${en.invitations.acceptCta} ${invitation.club.name}`}
          >
            {en.invitations.acceptCta}
          </Button>
        </div>
      </div>
    </Card>
  );
}
