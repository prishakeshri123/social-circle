import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellOff,
  BarChart3,
  ChevronRight,
  Download,
  FileText,
  LogOut,
  MoreHorizontal,
  Paperclip,
  Pin,
  Search,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/utils/cn';
import { formatFileSize } from '@/shared/utils/formatFileSize';
import { CategoryIconBadge } from '@/features/clubs/components/CategoryIconBadge';
import { MediaLightbox } from '@/features/chat/components/MediaLightbox';
import type { ChatMessage } from '@/types/chat.types';
import type { MyClub } from '@/types/club.types';

interface GroupInfoPanelProps {
  club: MyClub;
  channelSubtitle: string;
  memberCount: number;
  messages: ChatMessage[];
  pinnedCount: number;
  notificationsMuted: boolean;
  onToggleNotifications: () => void;
  onInvite: () => void;
  onOpenSearch: () => void;
  onCreatePoll: () => void;
  onExit: () => void;
  className?: string;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  danger,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-sm transition-colors duration-fast hover:bg-surface',
        danger ? 'text-error-500' : 'text-text-primary',
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1 font-medium">{label}</span>
      {value && <span className="text-text-secondary">{value}</span>}
      {!danger && <ChevronRight className="size-4 shrink-0 text-text-muted" aria-hidden="true" />}
    </button>
  );
}

export function GroupInfoPanel({
  club,
  channelSubtitle,
  memberCount,
  messages,
  pinnedCount,
  notificationsMuted,
  onToggleNotifications,
  onInvite,
  onOpenSearch,
  onCreatePoll,
  onExit,
  className,
}: GroupInfoPanelProps) {
  const navigate = useNavigate();
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | undefined>(undefined);

  const mediaMessages = messages.filter((m) => !m.deleted && m.type === 'image' && m.mediaUrl);
  const fileMessages = messages.filter((m) => !m.deleted && m.type === 'document');
  const mediaCount = mediaMessages.length + fileMessages.length;

  return (
    <div
      className={cn(
        'hidden w-full shrink-0 flex-col overflow-hidden border-l border-border bg-surface-raised lg:flex lg:w-80',
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="relative aspect-[3/1] w-full bg-surface">
          {club.bannerUrl && (
            <img
              src={club.bannerUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          )}
        </div>

        <div className="space-y-5 px-5 pb-5 text-center">
          <div className="-mt-10 flex flex-col items-center gap-2">
            <CategoryIconBadge category={club.category} className="size-20" />
            <div>
              <h2 className="text-lg font-bold text-text-primary">{club.name}</h2>
              <p className="text-sm text-text-secondary">{channelSubtitle}</p>
            </div>
          </div>

          {club.about && (
            <div className="space-y-1 text-left">
              <p className={cn('text-sm text-text-secondary', !aboutExpanded && 'line-clamp-3')}>
                {club.about}
              </p>
              <button
                type="button"
                onClick={() => setAboutExpanded((v) => !v)}
                className="text-sm font-medium text-primary-600 hover:underline"
              >
                {aboutExpanded ? en.clubLanding.readLess : en.clubLanding.readMore}
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-2xl"
              onClick={onInvite}
              aria-label={en.hub.inviteMembersCta}
              title={en.hub.inviteMembersCta}
            >
              <UserPlus className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-2xl"
              onClick={onOpenSearch}
              aria-label={en.hub.searchToggleTooltip}
              title={en.hub.searchToggleTooltip}
            >
              <Search className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-2xl"
              onClick={() => setMediaOpen((v) => !v)}
              aria-label={en.hub.mediaLinksFilesLabel}
              title={en.hub.mediaLinksFilesLabel}
            >
              <Paperclip className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-2xl"
              onClick={onCreatePoll}
              aria-label={en.chat.pollQuestion}
              title={en.chat.pollQuestion}
            >
              <BarChart3 className="size-4" aria-hidden="true" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11 rounded-2xl"
                  aria-label={en.hub.moreOptionsTooltip}
                  title={en.hub.moreOptionsTooltip}
                >
                  <MoreHorizontal className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onToggleNotifications}>
                  {notificationsMuted ? en.hub.unmuteNotificationsCta : en.hub.muteNotificationsCta}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-error-500" onClick={onExit}>
                  {en.hub.exitGroupCta}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-0.5 border-t border-border pt-2 text-left">
            <InfoRow
              icon={Paperclip}
              label={en.hub.mediaLinksFilesLabel}
              value={String(mediaCount)}
              onClick={() => setMediaOpen((v) => !v)}
            />
            {mediaOpen && mediaMessages.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5 px-2 pb-2">
                {mediaMessages.slice(0, 9).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setLightboxUrl(m.mediaUrl)}
                    className="aspect-square overflow-hidden rounded-lg"
                  >
                    <img
                      src={m.mediaThumbnailUrl ?? m.mediaUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            {mediaOpen && fileMessages.length > 0 && (
              <div className="space-y-1 px-2 pb-2">
                <p className="pt-1 text-xs font-semibold text-text-muted">
                  {en.chat.documentsHeading}
                </p>
                {fileMessages.map((m) => {
                  const hasRealFile = Boolean(m.mediaUrl) && m.mediaUrl !== '#';
                  return (
                    <a
                      key={m.id}
                      href={hasRealFile ? m.mediaUrl : undefined}
                      download={hasRealFile}
                      target={hasRealFile ? '_blank' : undefined}
                      rel={hasRealFile ? 'noreferrer' : undefined}
                      onClick={(e) => {
                        if (!hasRealFile) e.preventDefault();
                      }}
                      className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs"
                    >
                      <FileText className="size-4 shrink-0 text-error-500" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">{m.text}</span>
                      <span className="shrink-0 text-text-muted">
                        {formatFileSize(m.mediaSize ?? 0)}
                      </span>
                      <Download className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            )}
            {mediaOpen && mediaCount === 0 && (
              <p className="px-2 pb-2 text-xs text-text-muted">{en.hub.noMediaYet}</p>
            )}

            <InfoRow
              icon={Pin}
              label={en.hub.pinnedMessagesLabel}
              value={String(pinnedCount)}
              onClick={onOpenSearch}
            />

            <InfoRow
              icon={notificationsMuted ? BellOff : Bell}
              label={en.nav.notifications}
              value={
                notificationsMuted ? en.hub.notificationsMutedLabel : en.hub.notificationsAllLabel
              }
              onClick={onToggleNotifications}
            />

            <InfoRow
              icon={Users}
              label={en.hub.membersLabel}
              value={String(memberCount)}
              onClick={() => navigate(ROUTES.clubMembers(club.slug))}
            />

            <InfoRow icon={UserPlus} label={en.hub.inviteMembersCta} onClick={onInvite} />

            <InfoRow icon={LogOut} label={en.hub.exitGroupCta} danger onClick={onExit} />
          </div>
        </div>
      </div>

      <MediaLightbox
        open={Boolean(lightboxUrl)}
        onOpenChange={(open) => !open && setLightboxUrl(undefined)}
        mediaUrl={lightboxUrl}
        mediaType="image"
      />
    </div>
  );
}
