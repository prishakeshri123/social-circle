import { en } from '@/shared/constants/locales/en';
import { RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';

const STATS = [
  { value: en.marketing.statsClubsValue, label: en.marketing.statsClubsLabel },
  { value: en.marketing.statsMembersValue, label: en.marketing.statsMembersLabel },
  { value: en.marketing.statsEventsValue, label: en.marketing.statsEventsLabel },
] as const;

export function StatsStrip() {
  return (
    <RevealGroup className="grid grid-cols-3 gap-4 rounded-2xl border border-border bg-surface px-4 py-8 text-center">
      {STATS.map((stat) => (
        <RevealItem key={stat.label}>
          <p className="gradient-text text-3xl font-bold sm:text-4xl">{stat.value}</p>
          <p className="mt-1 text-xs text-text-secondary sm:text-sm">{stat.label}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
