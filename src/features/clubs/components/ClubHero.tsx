import { useState } from 'react';
import { Globe, Lock, Mail, MoreVertical, Share2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';
import { CATEGORIES } from '@/shared/constants/categories';
import { en } from '@/shared/constants/locales/en';
import { toast } from '@/shared/components/ui/Toast';
import type { Club } from '@/types/club.types';

const PRIVACY_LABEL: Record<Club['privacy'], string> = {
  public: en.clubLanding.publicPill,
  private: en.clubLanding.privatePill,
  invite_only: en.clubLanding.inviteOnlyPill,
};

const PRIVACY_ICON: Record<Club['privacy'], typeof Globe> = {
  public: Globe,
  private: Lock,
  invite_only: Mail,
};

interface ClubHeroProps {
  club: Club;
}

export function ClubHero({ club }: ClubHeroProps) {
  const [reported, setReported] = useState(false);
  const categoryLabel = CATEGORIES.find((c) => c.slug === club.category)?.label ?? club.category;
  const PrivacyIcon = PRIVACY_ICON[club.privacy];
  const foundedYear = new Date(club.createdAt).getFullYear().toString();

  function handleShare() {
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => toast.success(en.success.linkCopied));
  }

  function handleReport() {
    setReported(true);
    toast.success(en.actions.report);
  }

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface sm:aspect-[21/9]">
        {club.bannerUrl && (
          <img
            src={club.bannerUrl}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

        <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleShare}
            aria-label={en.actions.share}
            className="border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
          >
            <Share2 className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="More options"
                className="border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleReport} disabled={reported}>
                {en.actions.report}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8">
          <div className="mx-auto max-w-6xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {club.type === 'free' ? en.payment.freeLabel : en.payment.paidLabel}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <PrivacyIcon className="size-3.5" aria-hidden="true" />
                {PRIVACY_LABEL[club.privacy]}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {categoryLabel}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {club.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="-mt-10 flex items-end justify-between gap-3 sm:-mt-12">
          <Avatar className="size-20 border-4 border-background bg-surface-raised sm:size-24">
            <AvatarImage src={club.logoUrl} alt="" />
            <AvatarFallback className="text-2xl">{club.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <span className="mb-2 rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
            {en.clubLanding.foundedLabel(foundedYear)}
          </span>
        </div>

        <div className="space-y-3 py-4">
          {club.tagline && (
            <p className="text-base text-text-secondary sm:text-lg">{club.tagline}</p>
          )}

          {club.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {club.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface px-2.5 py-1 text-xs text-text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
