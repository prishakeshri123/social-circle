import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { useHorizontalScroll } from '@/shared/hooks/useHorizontalScroll';
import { cn } from '@/shared/utils/cn';

interface HorizontalCarouselProps {
  children: ReactNode;
  ariaLabel: string;
  /** Extra classes for the scrollable track (e.g. the fade-out mask). */
  className?: string;
}

export const ARROW_BUTTON_CLASS =
  'absolute top-1/2 z-raised flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-primary-500 bg-surface-raised text-primary-600 shadow-card transition-colors duration-fast hover:bg-primary-600 hover:text-white';

/** Horizontal scroll strip with left/right arrow buttons — the left one only
 * appears once the strip has actually been scrolled away from its start. */
export function HorizontalCarousel({ children, ariaLabel, className }: HorizontalCarouselProps) {
  const { ref, canScrollLeft, canScrollRight, scrollByDirection } =
    useHorizontalScroll<HTMLDivElement>();

  return (
    <div className="relative">
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
        aria-label={ariaLabel}
        className={cn('no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2', className)}
      >
        {children}
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
  );
}
