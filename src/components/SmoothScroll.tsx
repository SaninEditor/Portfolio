import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis } from '../lib/scroll';
import { SCROLL } from '../lib/anim';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { motionOverrideActive } from '../lib/motionOverride';

/**
 * Premium smooth scrolling. Skipped for users who prefer reduced motion
 * (native scrolling takes over) — except in dev, where motion is always
 * on so the site is authored as it really moves (opt out: ?motion=off).
 *
 * Physics live in `SCROLL` (lib/anim.ts): lerp-based exponential smoothing
 * gives a real accelerate → momentum → decelerate → settle arc, and the
 * single rAF loop here is the only scroll driver on the page. Motion's
 * `useScroll` reads the same window position, so scroll-driven animation
 * stays perfectly in sync.
 */
export default function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  const forced = motionOverrideActive();

  useEffect(() => {
    if (reduced && !forced) return;

    // Dev motion default: Lenis also consults prefers-reduced-motion
    // internally and disables its own smoothing when it matches. In a forced
    // reduced-motion environment (preview webview), shim the query so the
    // real scroll physics can be exercised. Restored on cleanup.
    let restoreMatchMedia: (() => void) | null = null;
    if (forced && typeof window.matchMedia === 'function') {
      const real = window.matchMedia.bind(window);
      const stub = (query: string): MediaQueryList => {
        const mql = real(query);
        if (query.includes('prefers-reduced-motion')) {
          return {
            media: query,
            matches: false,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
          } as unknown as MediaQueryList;
        }
        return mql;
      };
      window.matchMedia = stub as typeof window.matchMedia;
      restoreMatchMedia = () => {
        window.matchMedia = real as typeof window.matchMedia;
      };
    }

    const lenis = new Lenis({
      // Exponential smoothing — the inertia engine.
      lerp: SCROLL.lerp,
      wheelMultiplier: SCROLL.wheelMultiplier,
      // Native momentum on touch — Lenis only drives wheel/trackpad.
      touchMultiplier: SCROLL.touchMultiplier,
      syncTouch: false,
    });

    setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenis(null);
      restoreMatchMedia?.();
    };
  }, [reduced, forced]);

  return null;
}
