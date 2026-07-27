import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { Avatar, AvatarFallback } from '@/shared/components/ui/Avatar';
import { ARROW_BUTTON_CLASS } from '@/shared/components/ui/HorizontalCarousel';
import { useHorizontalScroll } from '@/shared/hooks/useHorizontalScroll';
import { cn } from '@/shared/utils/cn';

export function TestimonialsSection() {
  const { ref, canScrollLeft, canScrollRight, scrollByDirection } =
    useHorizontalScroll<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function updateActiveIndex() {
      const firstItem = el?.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el!).columnGap || getComputedStyle(el!).gap || '0');
      const step = (firstItem?.getBoundingClientRect().width ?? el!.clientWidth) + gap;
      setActiveIndex(Math.round(el!.scrollLeft / step));
    }

    updateActiveIndex();
    el.addEventListener('scroll', updateActiveIndex, { passive: true });
    return () => el.removeEventListener('scroll', updateActiveIndex);
  }, [ref]);

  return (
    <section className="space-y-8 py-6 text-center">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
          {en.marketing.testimonialsEyebrow}
        </p>
        <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
          {en.marketing.testimonialsTitle}
        </h2>
      </div>

      <div className="relative">
        <span className="absolute -top-5 left-2 z-raised flex size-11 items-center justify-center rounded-full bg-surface-raised text-primary-600 shadow-modal sm:left-6">
          <Quote className="size-5" aria-hidden="true" />
        </span>

        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByDirection('left')}
            aria-label={en.actions.scrollLeft}
            className={cn(ARROW_BUTTON_CLASS, '-left-3')}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
        )}

        <div
          ref={ref}
          role="group"
          aria-label={en.marketing.testimonialsTitle}
          className="no-scrollbar flex snap-x gap-4 overflow-x-auto pt-4 pb-2"
        >
          {en.marketing.testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="w-72 shrink-0 snap-start space-y-4 rounded-2xl border border-border bg-surface p-6 text-left shadow-card sm:w-80"
            >
              <p className="text-sm text-text-secondary">{testimonial.quote}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-xs text-text-muted">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5" aria-hidden="true">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-warning-500 text-warning-500" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByDirection('right')}
            aria-label={en.actions.scrollRight}
            className={cn(ARROW_BUTTON_CLASS, '-right-3')}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
        {en.marketing.testimonials.map((testimonial, i) => (
          <span
            key={testimonial.name}
            className={cn(
              'size-1.5 rounded-full transition-colors duration-fast',
              i === activeIndex ? 'bg-primary-600' : 'bg-border-strong',
            )}
          />
        ))}
      </div>
    </section>
  );
}
