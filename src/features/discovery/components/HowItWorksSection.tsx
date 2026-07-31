import { en } from '@/shared/constants/locales/en';
import { RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';
import { getIcon } from '@/shared/utils/iconRegistry';

export function HowItWorksSection() {
  return (
    <section className="space-y-10 py-8">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          {en.marketing.howItWorksStepsEyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">
          {en.marketing.howItWorksTitle}
        </h2>
      </div>

      <div className="relative">
        <div
          className="absolute inset-x-0 top-6 hidden border-t border-dashed border-border sm:block"
          aria-hidden="true"
        />
        <RevealGroup className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {en.marketing.howItWorksSteps.map((step, index) => {
            const Icon = getIcon(step.icon);
            return (
              <RevealItem key={step.title} className="flex flex-col items-center gap-2 text-center">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-text-inverse shadow-[0_8px_24px_-8px_var(--color-glow-primary)] ring-4 ring-surface"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                  {en.marketing.howItWorksStepLabel(index + 1)}
                </p>
                <h3 className="text-sm font-semibold text-text-primary">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.body}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
