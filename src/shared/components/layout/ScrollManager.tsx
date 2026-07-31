import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SCROLL_TO_HASH_RETRY_MS,
  SCROLL_TO_HASH_TIMEOUT_MS,
} from '@/shared/constants/app.constants';

// Handles in-app navigation scroll behavior: every route change snaps back to
// the header first, then (if the link carried a #hash, e.g. footer -> FAQs)
// smoothly glides down to that section once it has mounted.
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: pathnameChanged ? 'auto' : 'smooth' });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const targetId = hash.slice(1);
    const startedAt = Date.now();
    let frameId: number;

    const tryScrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (Date.now() - startedAt < SCROLL_TO_HASH_TIMEOUT_MS) {
        frameId = window.requestAnimationFrame(tryScrollToTarget);
      }
    };

    const timer = window.setTimeout(tryScrollToTarget, SCROLL_TO_HASH_RETRY_MS);
    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname, hash]);

  return null;
}
