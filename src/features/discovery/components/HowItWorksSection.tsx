import { en } from '@/shared/constants/locales/en';
import { RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';

export function HowItWorksSection() {
  return (
    <section className="space-y-10 py-8">
      <h2 className="text-center text-2xl font-semibold text-text-primary sm:text-3xl">
        {en.marketing.howItWorksTitle}
      </h2>

      <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {en.marketing.howItWorksSteps.map((step, index) => (
          <RevealItem key={step.title} className="relative space-y-3 text-center">
            <div
              className="mx-auto flex size-12 items-center justify-center rounded-2xl text-base font-semibold text-text-inverse shadow-[0_8px_24px_-8px_var(--color-glow-primary)]"
              style={{ background: 'var(--gradient-brand)' }}
            >
              {index + 1}
            </div>
            <h3 className="text-sm font-semibold text-text-primary">{step.title}</h3>
            <p className="text-sm text-text-secondary">{step.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
