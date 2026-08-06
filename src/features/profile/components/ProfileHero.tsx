import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, Pencil, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { CATEGORIES } from '@/shared/constants/categories';
import { formatDate } from '@/shared/utils/formatDate';
import type { User } from '@/types/user.types';

interface ProfileHeroProps {
  user: User;
  isOwnProfile: boolean;
}

export function ProfileHero({ user, isOwnProfile }: ProfileHeroProps) {
  const interestLabels = user.interests
    .map((slug) => CATEGORIES.find((c) => c.slug === slug)?.label ?? slug)
    .slice(0, 8);

  return (
    <Card className="overflow-hidden">
      <div
        className="relative h-36 w-full bg-cover bg-center sm:h-48"
        style={{
          backgroundImage: user.coverPhotoUrl
            ? `url(${user.coverPhotoUrl})`
            : 'var(--gradient-brand)',
        }}
      >
        {isOwnProfile && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute right-4 top-4 shadow-sm"
            asChild
          >
            <Link to={ROUTES.profileEdit}>
              <Pencil className="size-3.5" aria-hidden="true" />
              {en.nav.editProfile}
            </Link>
          </Button>
        )}
      </div>

      <div className="px-5 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col items-start gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <Avatar className="size-24 ring-4 ring-surface-raised shadow-md sm:size-28">
            <AvatarImage src={user.avatarUrl} alt="" />
            <AvatarFallback className="text-2xl">{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>

          {!isOwnProfile && (
            <Button asChild className="shrink-0">
              <Link to={ROUTES.messageThread(user.id)}>
                <MessageCircle className="size-4" aria-hidden="true" />
                {en.members.sendMessage}
              </Link>
            </Button>
          )}
        </div>

        <div className="mt-4">
          <h1 className="text-xl font-bold text-text-primary sm:text-2xl">{user.fullName}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {user.bio || <span className="italic text-text-muted">{en.profile.noBio}</span>}
          </p>
        </div>

        {interestLabels.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {interestLabels.map((label) => (
              <Badge key={label} variant="secondary">
                {label}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4 text-text-muted" aria-hidden="true" />
            {en.members.memberSince(formatDate(user.joinedAt, 'MMMM yyyy'))}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4 text-text-muted" aria-hidden="true" />
            <span className="font-semibold text-text-primary">{user.clubsJoined}</span>
            {en.profile.clubsJoinedLabel}
          </span>
        </div>
      </div>
    </Card>
  );
}
