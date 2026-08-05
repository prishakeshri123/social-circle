import { Link, useNavigate } from 'react-router-dom';
import { Users2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { CONTINUE_COMMUNITIES_CARD_LIMIT } from '@/shared/constants/app.constants';
import { formatDate } from '@/shared/utils/formatDate';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useMyUpcomingEvents } from '@/features/events/hooks/useMyUpcomingEvents';
import { useMyRecentAlbums } from '@/features/albums/hooks/useMyRecentAlbums';

export function ContinueYourCommunities() {
  const navigate = useNavigate();
  const myClubsQuery = useMyClubs();
  const conversationsQuery = useConversations();
  const upcomingEventsQuery = useMyUpcomingEvents(50);
  const recentAlbums = useMyRecentAlbums(20);

  const myClubs = myClubsQuery.data ?? [];

  const signals = myClubs.map((club) => {
    const unread = (conversationsQuery.data ?? [])
      .filter((c) => c.kind === 'group' && c.clubId === club.id)
      .reduce((sum, c) => sum + c.unreadCount, 0);

    const nextEvent = [...upcomingEventsQuery.data]
      .filter((e) => e.clubId === club.id)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];

    const recentAlbum = recentAlbums.data.find((a) => a.club.id === club.id);

    return { club, unread, nextEvent, recentAlbum };
  });

  type Signal = (typeof signals)[number];
  type CardType = 'chat' | 'event' | 'album' | 'default';

  function renderCard(signal: Signal, type: CardType) {
    const { club, unread, nextEvent, recentAlbum } = signal;

    if (type === 'chat') {
      return {
        club,
        subtitleLine1: en.home.unreadMessagesCount(unread),
        subtitleLine2: nextEvent
          ? en.home.nextMeetupLabel(formatDate(nextEvent.startAt, 'EEE, MMM d'))
          : en.discovery.membersCount(club.memberCount),
        ctaLabel: en.home.openChatCta,
        ctaTo: ROUTES.clubChat(club.slug),
      };
    }
    if (type === 'event' && nextEvent) {
      return {
        club,
        subtitleLine1: nextEvent.title,
        subtitleLine2: en.events.goingCount(nextEvent.rsvpCounts.going),
        ctaLabel: en.home.viewEventCta,
        ctaTo: ROUTES.clubEventDetail(club.slug, nextEvent.id),
      };
    }
    if (type === 'album' && recentAlbum) {
      return {
        club,
        subtitleLine1: en.home.newAlbumAdded,
        subtitleLine2: en.discovery.membersCount(club.memberCount),
        ctaLabel: en.home.openCta,
        ctaTo: ROUTES.clubAlbums(club.slug),
      };
    }
    return {
      club,
      subtitleLine1: en.discovery.membersCount(club.memberCount),
      subtitleLine2: '',
      ctaLabel: en.home.openCta,
      ctaTo: ROUTES.clubDashboard(club.slug),
    };
  }

  // Prefer one card of each kind (chat / event / album) so the row reads as
  // varied at a glance, then fill any remaining slots with what's left.
  const used = new Set<string>();
  const selected: { signal: Signal; type: CardType }[] = [];

  const byUnread = signals.filter((s) => s.unread > 0).sort((a, b) => b.unread - a.unread);
  if (byUnread[0]) {
    selected.push({ signal: byUnread[0], type: 'chat' });
    used.add(byUnread[0].club.id);
  }

  const byEvent = signals
    .filter((s) => s.nextEvent && !used.has(s.club.id))
    .sort(
      (a, b) => new Date(a.nextEvent!.startAt).getTime() - new Date(b.nextEvent!.startAt).getTime(),
    );
  if (byEvent[0]) {
    selected.push({ signal: byEvent[0], type: 'event' });
    used.add(byEvent[0].club.id);
  }

  const byAlbum = signals
    .filter((s) => s.recentAlbum && !used.has(s.club.id))
    .sort(
      (a, b) =>
        new Date(b.recentAlbum!.album.createdAt).getTime() -
        new Date(a.recentAlbum!.album.createdAt).getTime(),
    );
  if (byAlbum[0]) {
    selected.push({ signal: byAlbum[0], type: 'album' });
    used.add(byAlbum[0].club.id);
  }

  for (const signal of signals) {
    if (selected.length >= CONTINUE_COMMUNITIES_CARD_LIMIT) break;
    if (used.has(signal.club.id)) continue;
    const type: CardType =
      signal.unread > 0
        ? 'chat'
        : signal.nextEvent
          ? 'event'
          : signal.recentAlbum
            ? 'album'
            : 'default';
    selected.push({ signal, type });
    used.add(signal.club.id);
  }

  const cards = selected
    .slice(0, CONTINUE_COMMUNITIES_CARD_LIMIT)
    .map(({ signal, type }) => renderCard(signal, type));

  return (
    <section aria-labelledby="continue-communities-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="continue-communities-heading" className="text-lg font-semibold text-text-primary">
          {en.home.continueCommunitiesTitle}
        </h2>
        <Link
          to={ROUTES.myClubs}
          className="text-sm font-medium text-primary-600 transition-colors duration-fast hover:text-primary-700"
        >
          {en.home.seeAllCta}
        </Link>
      </div>

      {cards.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users2}
            title={en.empty.noClubsJoined}
            ctaLabel={en.empty.noClubsJoinedCta}
            onCtaClick={() => navigate(ROUTES.search)}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ club, subtitleLine1, subtitleLine2, ctaLabel, ctaTo }) => (
            <Card key={club.id} className="overflow-hidden p-0">
              <div className="relative aspect-[16/9] w-full bg-surface">
                {club.bannerUrl && (
                  <img
                    src={club.bannerUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                )}
                <Avatar className="absolute -bottom-4 left-4 size-9 border-2 border-surface-raised">
                  <AvatarImage src={club.logoUrl} alt="" />
                  <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1 p-4 pt-6">
                <h3 className="truncate text-sm font-semibold text-text-primary">{club.name}</h3>
                <p className="truncate text-xs text-text-secondary">{subtitleLine1}</p>
                {subtitleLine2 && (
                  <p className="truncate text-xs text-text-muted">{subtitleLine2}</p>
                )}
                <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                  <Link to={ctaTo}>{ctaLabel}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
