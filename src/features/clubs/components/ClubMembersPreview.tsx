import { Avatar, AvatarFallback } from '@/shared/components/ui/Avatar';
import { en } from '@/shared/constants/locales/en';
import { MEMBERS_PREVIEW_COUNT } from '@/shared/constants/app.constants';

interface ClubMembersPreviewProps {
  memberCount: number;
}

// No member directory API yet (lands with the Members tab in Phase 4), so the
// preview renders placeholder avatars sized to the club's real member count.
export function ClubMembersPreview({ memberCount }: ClubMembersPreviewProps) {
  if (memberCount === 0) return null;

  const previewCount = Math.min(memberCount, MEMBERS_PREVIEW_COUNT);
  const remaining = memberCount - previewCount;

  return (
    <section
      aria-labelledby="club-members-heading"
      className="space-y-3 rounded-2xl border border-border bg-surface p-6"
    >
      <h2 id="club-members-heading" className="text-lg font-semibold text-text-primary">
        {en.clubLanding.membersTitle}
      </h2>
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {Array.from({ length: previewCount }).map((_, index) => (
            <Avatar key={index} className="border-2 border-surface">
              <AvatarFallback>{String.fromCharCode(65 + (index % 26))}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        {remaining > 0 && (
          <span className="ml-3 text-sm text-text-secondary">
            {en.clubLanding.othersLabel(remaining)}
          </span>
        )}
      </div>
    </section>
  );
}
