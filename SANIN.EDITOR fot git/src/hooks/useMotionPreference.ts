import { useReducedMotion } from 'motion/react';
import { motionOverrideActive } from '../lib/motionOverride';

/**
 * True when the user prefers reduced motion AND the dev-only
 * ?motion=force override is not active. Use this everywhere the
 * scrolltelling sections gate their animation styles — the raw
 * useReducedMotion would otherwise be pinned to the OS setting,
 * which the preview webview forces to "reduce".
 */
export function useMotionPreference(): boolean {
  const reduced = useReducedMotion();
  return !!reduced && !motionOverrideActive();
}
