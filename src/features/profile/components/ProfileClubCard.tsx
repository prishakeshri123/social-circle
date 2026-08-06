import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Card } from '@/shared/components/ui/Card';
import { ROUTES } from '@/shared/constants/routes';
import { CATEGORIES } from '@/shared/constants/categories';
import type { MyClub } from '@/types/club.types';

export function ProfileClubCard({ club }: { club: MyClub }) {
  const categoryLabel = CATEGORIES.find((c) => c.slug === club.category)?.label ?? club.category;

  return (
    <Card className="overflow-hidden transition-shadow duration-fast hover:shadow-lg">
      <Link to={ROUTES.clubLanding(club.slug)} className="flex items-center gap-3 p-4">
        <Avatar className="size-12 shrink-0 ring-2 ring-white shadow-sm">
          <AvatarImage src={club.logoUrl} alt="" />
          <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">{club.name}</p>
          <p className="truncate text-xs text-text-secondary">{categoryLabel}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
            <Users className="size-3" aria-hidden="true" />
            {club.memberCount.toLocaleString()}
          </p>
        </div>
      </Link>
    </Card>
  );
}
