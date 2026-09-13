import type { Transition } from 'motion/react';

/* ============================================================
   MOTION SYSTEM — the single source of truth.
   Every animation on the site pulls from here so the whole
   site moves like it was timed by the same hand.

   Layers:
   · EASE / EASE_SOFT   — the two curves of the site
   · DUR                — duration scale
   · STAGGER            — list/line timing
   · REVEAL / CLIP      — entrance distances + media masks
   · SPRING             — physical (parallax) motion
   · SCROLL             — smooth-scroll feel + anchors
   · PAGE               — route transitions
   · HERO_SEQ           — the opening sequence
   · fadeUp/lineUp/…    — ready-made transitions
   ============================================================ */

/** Signature ease — cinematic, no bouncy overshoot. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Slightly softer ease for long media moves / page transitions. */
export const EASE_SOFT: [number, number, number, number] = [0.25, 0.8, 0.2, 1];

/** Duration scale (seconds). */
export const DUR = {
  fast: 0.45,
  mid: 0.75,
  slow: 1.1,
  settle: 1.5,
} as const;

/** Stagger step for lists / rows / lines. Small — reads as one gesture. */
export const STAGGER = 0.07;

/** Stagger helper: index → delay. Lives here (not in a component file)
    so this module stays import-safe for Fast Refresh. */
export const stagger = (i: number, step: number = STAGGER) => i * step;

/* ------------------------------------------------------------
   ENTRANCE GEOMETRY
   ------------------------------------------------------------ */

/** Default rise distance for text/element reveals (px). */
export const REVEAL_Y = 28;

/** Hero media clip inset — starts slightly cropped, opens to full. */
export const CLIP_MEDIA = 'inset(8% 5% 8% 5%)';
export const CLIP_FULL = 'inset(0% 0% 0% 0%)';

/* ------------------------------------------------------------
   VIEWPORT THRESHOLDS (IntersectionObserver via Motion)
   ------------------------------------------------------------ */

export const viewport = { once: true, margin: '-9% 0px -9% 0px' } as const;

/** Media sits lower in the viewport before revealing — more cinematic. */
export const mediaViewport = { once: true, margin: '-6% 0px -12% 0px' } as const;

/* ------------------------------------------------------------
   SPRINGS (scroll-driven physical motion)
   ------------------------------------------------------------ */

/** Parallax spring — slow, heavy, damped. Felt, not noticed. */
export const SPRING = { stiffness: 60, damping: 20, mass: 0.4 } as const;

/* ------------------------------------------------------------
   SMOOTH SCROLL (Lenis)
   ------------------------------------------------------------ */

export const SCROLL = {
  /**
   * Physics: exponential (lerp) smoothing, not duration-based easing.
   * `lerp` is the fraction of remaining distance covered per frame —
   * lower = more inertia. 0.085 gives a clear accelerate → momentum →
   * smooth deceleration → settle arc that is unmistakably not native,
   * while staying responsive (no floaty lag behind the wheel).
   */
  lerp: 0.085,
  wheelMultiplier: 1,
  /** Touch keeps native momentum; Lenis only drives wheel/trackpad. */
  touchMultiplier: 1.6,
  syncTouch: false,
  /** Anchor navigation: nav-height offset + a considered glide. */
  anchor: { offset: -84, duration: 1.4 },
} as const;

/* ------------------------------------------------------------
   PAGE TRANSITIONS (route changes)
   ------------------------------------------------------------ */

export const PAGE = {
  enter: { opacity: 0, y: 18 },
  enterTo: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.55, ease: EASE },
} as const;

/* ------------------------------------------------------------
   HERO OPENING SEQUENCE — the film starts here.
   Times are absolute (seconds from mount); each element lands
   just before the previous one finishes. Usable immediately.
   ------------------------------------------------------------ */

export const HERO_SEQ = {
  overline: { delay: 0.15, duration: DUR.mid },
  lede: { delay: 0.5, duration: 0.9 },
  ctas: { delay: 0.62, duration: 0.9 },
  tags: { delay: 0.85, duration: DUR.slow },
  media: { delay: 0.5, duration: DUR.settle + 0.1 },
  /** Media settle from a slight scale + blur — the "first shot". */
  mediaScale: 1.08,
  mediaBlur: 12,
} as const;

/* ------------------------------------------------------------
   READY-MADE TRANSITIONS
   ------------------------------------------------------------ */

export const fadeUp: Transition = {
  duration: DUR.mid,
  ease: EASE,
};

export const lineUp: Transition = {
  duration: DUR.slow,
  ease: EASE,
};

/** Masked line reveal — the standard for display typography. */
export const maskUp: Transition = {
  duration: DUR.slow,
  ease: EASE,
};

/** Cinematic media settle — clip opens while the frame drifts into place. */
export const mediaSettle: Transition = {
  duration: DUR.settle,
  ease: EASE_SOFT,
};

/** Page transition — fast and cinematic. */
export const pageTransition: Transition = PAGE.transition;
