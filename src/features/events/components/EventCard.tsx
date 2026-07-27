import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Video } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate, formatTime } from '@/shared/utils/formatDate';
import type { EventWithClub } from '@/types/event.types';

interface EventCardProps {
  event: EventWithClub;
}

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();
  const detailUrl = ROUTES.eventDetail(event.club.slug, event.id);

  // The RSVP/Buy auth gate lives on the event detail page itself — from a
  // card, "RSVP →" is just a view affordance, same as "View Club →" on ClubCard.
  function handleRsvp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    navigate(detailUrl);
  }

  return (
    <Card className="relative overflow-hidden p-0 transition-shadow duration-fast hover:shadow-card-hover">
      <Link to={detailUrl} className="absolute inset-0 z-10" aria-label={event.title} />

      <div className="relative z-0 aspect-video w-full bg-surface">
        {event.coverImageUrl && (
          <img src={event.coverImageUrl} alt="" className="size-full object-cover" />
        )}
      </div>

      <div className="relative z-10 space-y-2 p-4">
        <p className="text-xs font-medium text-text-secondary">
          {formatDate(event.startAt, 'dd MMM')} · {event.club.name}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold text-text-primary">{event.title}</h3>

        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          {event.locationType === 'virtual' ? (
            <>
              <Video className="size-3.5" aria-hidden="true" />
              <span>{en.events.virtualEventLabel}</span>
            </>
          ) : (
            <>
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{event.physicalAddress}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{formatTime(event.startAt)}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Badge variant={event.ticketType === 'free' ? 'success' : 'warning'}>
            {event.ticketType === 'free'
              ? en.events.freeLabel
              : formatCurrency(event.ticketPrice ?? 0)}
          </Badge>
          <Button size="sm" onClick={handleRsvp} className="relative z-20">
            {en.events.rsvpCta}
          </Button>
        </div>
      </div>
    </Card>
  );
}
