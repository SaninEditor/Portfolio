import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'motion/react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { motionOverrideActive } from '../lib/motionOverride';

/* ============================================================
   SCROLL VELOCITY — one shared rAF reader of window scroll
   speed, exposed as a spring-smoothed MotionValue normalised
   to 0 (rest) → 1 (fast). MotionValues flow without React
   re-renders, so this is safe to feed straight into styles.

   Used sparingly: only elements that genuinely benefit from
   momentum react to it (the marquee skew, the scroll cue).
   ============================================================ */

let rafId = 0;
let refCount = 0;
let lastY = 0;
let lastT = 0;
let pxPerSec = 0;

const subs = new Set<(v: number) => void>();

function loop(t: number) {
  const y = window.scrollY;
  const dt = lastT ? Math.max((t - lastT) / 1000, 1 / 240) : 1 / 60;
  const raw = Math.abs((y - lastY) / dt);
  // Smooth toward the raw reading — momentum without jitter.
  pxPerSec += (raw - pxPerSec) * 0.1;
  lastY = y;
  lastT = t;
  const normalised = Math.min(pxPerSec / 2400, 1);
  subs.forEach((fn) => fn(normalised));
  rafId = requestAnimationFrame(loop);
}

function subscribe(fn: (v: number) => void) {
  subs.add(fn);
  refCount++;
  if (refCount === 1) {
    lastY = window.scrollY;
    lastT = 0;
    pxPerSec = 0;
    rafId = requestAnimationFrame(loop);
  }
  return () => {
    subs.delete(fn);
    refCount--;
    if (refCount === 0) cancelAnimationFrame(rafId);
  };
}

/**
 * A spring-smoothed MotionValue: 0 at rest → ~1 at fast scroll.
 * Disabled (always 0) under reduced motion.
 */
export function useScrollVelocityValue(): MotionValue<number> {
  const mv = useMotionValue(0);
  const smooth = useSpring(mv, { stiffness: 120, damping: 26, mass: 0.5 });
  const reduced = usePrefersReducedMotion();
  const forced = motionOverrideActive();
  const reducedRef = useRef(reduced && !forced);
  reducedRef.current = reduced && !forced;

  useEffect(() => {
    return subscribe((v) => {
      mv.set(reducedRef.current ? 0 : v);
    });
  }, [mv]);

  return smooth;
}
