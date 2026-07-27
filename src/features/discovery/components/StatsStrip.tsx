import { Users, Building2, CalendarCheck, Trophy } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';

const INLINE_STATS = [
  { value: en.marketing.statsClubsValue, label: en.marketing.statsClubsLabel },
  { value: en.marketing.statsMembersValue, label: en.marketing.statsMembersLabel },
  { value: en.marketing.statsEventsValue, label: en.marketing.statsEventsLabel },
] as const;

const BANNER_STATS = [
  { icon: Users, value: en.marketing.statsMembersValue, label: en.marketing.statsMembersLabel },
  { icon: Building2, value: en.marketing.statsClubsValue, label: en.marketing.statsClubsLabel },
  {
    icon: CalendarCheck,
    value: en.marketing.statsEventsValue,
    label: en.marketing.statsEventsLabel,
  },
  { icon: Trophy, value: en.marketing.statsHappyValue, label: en.marketing.statsHappyLabel },
] as const;

interface StatsStripProps {
  variant?: 'inline' | 'banner';
}

export function StatsStrip({ variant = 'inline' }: StatsStripProps) {
  if (variant === 'banner') {
    return (
      <section
        className="rounded-2xl px-6 py-8 sm:px-10 sm:py-10"
        style={{ backgroundColor: 'var(--color-primary-900)' }}
      >
        <RevealGroup className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
          {BANNER_STATS.map((stat) => (
            <RevealItem key={stat.label} className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                <stat.icon className="size-5 text-white" aria-hidden="true" />
              </span>
              <span>
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    );
  }

  return (
    <RevealGroup className="grid grid-cols-3 gap-4 rounded-2xl border border-border bg-surface px-4 py-8 text-center">
      {INLINE_STATS.map((stat) => (
        <RevealItem key={stat.label}>
          <p className="gradient-text text-3xl font-bold sm:text-4xl">{stat.value}</p>
          <p className="mt-1 text-xs text-text-secondary sm:text-sm">{stat.label}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
