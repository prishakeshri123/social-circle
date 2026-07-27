import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CAROUSEL_SCROLL_ANIMATION_MS,
  CAROUSEL_SCROLL_EPSILON_PX,
} from '@/shared/constants/app.constants';

/** Decelerating ease-out — matches the feel of the rest of the app's motion. */
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** Drives a horizontally-scrolling strip's left/right arrow buttons. */
export function useHorizontalScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const animationFrameRef = useRef<number>();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > CAROUSEL_SCROLL_EPSILON_PX);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - CAROUSEL_SCROLL_EPSILON_PX);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scrollByDirection = useCallback((direction: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;

    // Scroll by exactly one item (its rendered width + the flex gap) instead of
    // a fraction of the viewport, so each click steps through the strip one card at a time.
    const firstItem = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || '0');
    const amount = (firstItem?.getBoundingClientRect().width ?? el.clientWidth) + gap;
    const delta = direction === 'left' ? -amount : amount;

    // Animated manually (instead of `scrollBy({ behavior: 'smooth' })`) because Chromium
    // cuts the native smooth-scroll animation short when combined with `scroll-snap-type`,
    // making the strip jump straight to the next card instead of visibly sliding to it.
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const start = el.scrollLeft;
    const target = start + delta;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / CAROUSEL_SCROLL_ANIMATION_MS, 1);
      el.scrollLeft = start + (target - start) * easeOutCubic(progress);
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        animationFrameRef.current = undefined;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  return { ref, canScrollLeft, canScrollRight, scrollByDirection };
}
