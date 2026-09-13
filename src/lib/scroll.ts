import type Lenis from 'lenis';
import { SCROLL } from './anim';

/**
 * Module-level Lenis singleton so any component (nav, footer,
 * scroll-manager) can drive smooth scrolling without prop drilling.
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
  // Dev-only handle so preview tooling can drive the smooth scroller.
  if (import.meta.env.DEV) {
    (window as unknown as { __lenis?: Lenis | null }).__lenis = instance;
  }
}

export function getLenis() {
  return lenis;
}

export function scrollTop(immediate = false) {
  if (lenis) {
    lenis.scrollTo(0, { immediate, force: true });
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
  }
}

/** Anchor navigation — one shared feel, configured in SCROLL.anchor. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, SCROLL.anchor);
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
