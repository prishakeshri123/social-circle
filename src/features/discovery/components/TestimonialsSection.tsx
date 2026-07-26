import { Quote } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';

export function TestimonialsSection() {
  return (
    <section className="space-y-8 py-8">
      <h2 className="text-center text-2xl font-semibold text-text-primary sm:text-3xl">
        {en.marketing.testimonialsTitle}
      </h2>
      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {en.marketing.testimonials.map((testimonial) => (
          <RevealItem
            key={testimonial.name}
            className="space-y-3 rounded-2xl border border-border bg-surface p-6 transition-transform duration-normal hover:-translate-y-1"
          >
            <Quote className="size-5 text-primary-600" aria-hidden="true" />
            <p className="text-sm text-text-secondary">{testimonial.quote}</p>
            <div>
              <p className="text-sm font-semibold text-text-primary">{testimonial.name}</p>
              <p className="text-xs text-text-muted">{testimonial.role}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
