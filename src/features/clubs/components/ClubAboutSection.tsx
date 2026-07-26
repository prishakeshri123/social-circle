import { useState } from 'react';
import { Target } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { sanitizeHtml } from '@/shared/utils/sanitize';
import { cn } from '@/shared/utils/cn';

interface ClubAboutSectionProps {
  about: string;
  mission?: string;
  codeOfConduct?: string;
}

export function ClubAboutSection({ about, mission, codeOfConduct }: ClubAboutSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      aria-labelledby="club-about-heading"
      className="space-y-4 rounded-2xl border border-border bg-surface p-6"
    >
      <div className="space-y-2">
        <h2 id="club-about-heading" className="text-lg font-semibold text-text-primary">
          {en.clubLanding.aboutTitle}
        </h2>
        <div
          className={cn('rich-text', !expanded && 'line-clamp-4')}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(about) }}
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          {expanded ? en.clubLanding.readLess : en.clubLanding.readMore}
        </button>
      </div>

      {mission && (
        <div className="flex gap-3 rounded-xl bg-surface-raised p-4">
          <Target className="size-5 shrink-0 text-primary-600" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
              {en.clubLanding.missionTitle}
            </p>
            <p className="text-sm text-text-secondary">{mission}</p>
          </div>
        </div>
      )}

      {codeOfConduct && (
        <div className="space-y-1.5 border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-text-primary">
            {en.clubLanding.guidelinesTitle}
          </h3>
          <p className="text-sm text-text-secondary">{codeOfConduct}</p>
        </div>
      )}
    </section>
  );
}
