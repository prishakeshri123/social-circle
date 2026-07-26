import { CheckCircle2, Sparkles } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';

interface ClubHighlightsStripProps {
  highlights: string[];
}

export function ClubHighlightsStrip({ highlights }: ClubHighlightsStripProps) {
  if (highlights.length === 0) return null;

  return (
    <section
      aria-labelledby="club-highlights-heading"
      className="space-y-4 rounded-2xl border border-border bg-surface p-6"
    >
      <div
        className="flex size-11 items-center justify-center rounded-xl text-text-inverse"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <Sparkles className="size-5" aria-hidden="true" />
      </div>
      <h2 id="club-highlights-heading" className="text-lg font-semibold text-text-primary">
        {en.clubLanding.highlightsTitle}
      </h2>
      <ul className="space-y-2.5">
        {highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2.5 text-sm text-text-secondary">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary-600" aria-hidden="true" />
            {highlight}
          </li>
        ))}
      </ul>
    </section>
  );
}
