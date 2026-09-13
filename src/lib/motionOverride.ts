/**
 * Dev motion default: in development the full motion system is ON by
 * default — including in environments that force `prefers-reduced-motion`
 * (e.g. the Freebuff preview webview) — so the site is always authored
 * and reviewed as it really moves. Opt out with `?motion=off`.
 *
 * In production builds this always returns false: real users who prefer
 * reduced motion get the full accessible fallback, as they should.
 */
export function motionOverrideActive(): boolean {
  if (!import.meta.env.DEV) return false;
  try {
    return new URLSearchParams(window.location.search).get('motion') !== 'off';
  } catch {
    return false;
  }
}
