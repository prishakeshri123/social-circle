import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';

const iconMap = Icons as unknown as Record<string, LucideIcon>;

export function FeaturesSection() {
  return (
    <section className="space-y-10 py-6 text-center">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
          {en.marketing.featuresEyebrow}
        </p>
        <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
          {en.marketing.featuresTitle}
        </h2>
      </div>

      <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
        {en.marketing.features.map((feature) => {
          const Icon = iconMap[feature.icon] ?? Icons.Circle;
          return (
            <RevealItem key={feature.title} className="space-y-3">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-text-primary">{feature.title}</h3>
              <p className="mx-auto max-w-xs text-sm text-text-secondary">{feature.body}</p>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
