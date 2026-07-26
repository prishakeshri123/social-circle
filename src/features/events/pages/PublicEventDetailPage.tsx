import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Users, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate, formatTime } from '@/shared/utils/formatDate';
import { sanitizeHtml } from '@/shared/utils/sanitize';
import { toast } from '@/shared/components/ui/Toast';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import { useEvent } from '@/features/events/hooks/useEvent';
import { useEventRsvp } from '@/features/events/hooks/useEventRsvp';

export function PublicEventDetailPage() {
  const { eventId = '' } = useParams<{ slug: string; eventId: string }>();
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const { data: event, isPending, isError } = useEvent(eventId);
  const rsvpMutation = useEventRsvp(eventId);

  if (isPending) return <LoadingSpinner className="min-h-[50vh]" />;

  if (isError || !event) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState title={en.events.notFoundTitle} />
      </div>
    );
  }

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const description = event.description.replace(/<[^>]+>/g, '').slice(0, 155);
  const isPaid = event.ticketType === 'paid';
  const alreadyGoing = event.currentUserRsvp === 'going';
  const spotsLeft =
    typeof event.capacity === 'number'
      ? Math.max(0, event.capacity - event.rsvpCounts.going)
      : null;

  function handleCta() {
    requireAuth(isPaid ? 'buy' : 'rsvp', () => {
      if (!event) return;
      if (isPaid) {
        navigate(ROUTES.checkout(event.id));
        return;
      }
      rsvpMutation.mutate('going', {
        onSuccess: () => toast.success(en.events.rsvpSuccess),
        onError: (error) => toast.error(getApiErrorMessage(error)),
      });
    });
  }

  return (
    <div className="pb-20 md:pb-8">
      <Helmet>
        <title>{`${event.title} — ${event.club.name} | Social Circle`}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={description} />
        {event.coverImageUrl && <meta property="og:image" content={event.coverImageUrl} />}
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.title,
            startDate: event.startAt,
            endDate: event.endAt,
            eventAttendanceMode:
              event.locationType === 'virtual'
                ? 'https://schema.org/OnlineEventAttendanceMode'
                : 'https://schema.org/OfflineEventAttendanceMode',
            location:
              event.locationType === 'virtual'
                ? { '@type': 'VirtualLocation', url }
                : { '@type': 'Place', name: event.physicalAddress, address: event.physicalAddress },
            image: event.coverImageUrl,
            description,
            offers: {
              '@type': 'Offer',
              price: event.ticketType === 'paid' ? event.ticketPrice : 0,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url,
            },
          })}
        </script>
      </Helmet>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface sm:aspect-[21/9] sm:max-h-[40vh]">
        {event.coverImageUrl && (
          <img src={event.coverImageUrl} alt="" className="size-full object-cover" />
        )}
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isPaid ? 'warning' : 'success'}>
              {isPaid ? formatCurrency(event.ticketPrice ?? 0) : en.events.freeLabel}
            </Badge>
            <Badge variant="outline">{en.events.upcomingBadge}</Badge>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">{event.title}</h1>

          <Link
            to={ROUTES.clubLanding(event.club.slug)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary-600"
          >
            <Avatar className="size-6">
              <AvatarImage src={event.club.logoUrl} alt="" />
              <AvatarFallback>{event.club.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {en.events.organisedBy} {event.club.name}
          </Link>
        </div>

        <div className="space-y-1 rounded-md border border-border p-4 text-sm text-text-primary">
          <p className="font-medium">
            {formatDate(event.startAt, 'EEEE, d MMM yyyy')} · {formatTime(event.startAt)} (
            {event.timezone})
          </p>
          <div className="flex items-center gap-1.5 text-text-secondary">
            {event.locationType === 'virtual' ? (
              <>
                <Video className="size-4" aria-hidden="true" />
                <span>{en.events.virtualEventLabel}</span>
              </>
            ) : (
              <>
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                <span>{event.physicalAddress}</span>
              </>
            )}
          </div>
        </div>

        <div
          className="rich-text text-sm text-text-secondary"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }}
        />

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-text-primary">
              {isPaid ? formatCurrency(event.ticketPrice ?? 0) : en.events.freeLabel}
            </p>
            {spotsLeft !== null && (
              <p className="flex items-center gap-1 text-xs text-text-muted">
                <Users className="size-3.5" aria-hidden="true" />
                {en.events.spotsLeft(spotsLeft)}
              </p>
            )}
          </div>

          {alreadyGoing ? (
            <Button asChild>
              <Link to={ROUTES.clubEventDetail(event.club.slug, event.id)}>
                {en.events.viewInDashboardCta}
              </Link>
            </Button>
          ) : (
            <Button onClick={handleCta} disabled={rsvpMutation.isPending}>
              {isPaid
                ? en.events.getTicketsCta(formatCurrency(event.ticketPrice ?? 0))
                : en.events.rsvpCta}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
