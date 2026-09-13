import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useMotionPreference } from '../hooks/useMotionPreference';

/**
 * AmbientGradients — full-site background atmosphere.
 *
 * Three huge, dim radial gradients drift on their own slow loops, are
 * gently pulled toward the cursor (parallax-like, with heavy lag),
 * breathe with an irregular filmic exposure flicker — and now carry
 * a TINT that follows the story: each page (and each tagged section
 * of the long homepage) has its own dominant tint, crossfaded by
 * shifting the relative weight of the three blobs (white lift / cool
 * blue / warm amber).
 *
 * Disabled on touch devices and under reduced motion — the site then
 * shows a single static wash instead.
 */

/* Tint profiles — per-blob opacity weights [white, cool, warm]. */
const TINTS: Record<string, [number, number, number]> = {
  neutral: [1, 1, 1],
  cool: [0.8, 1.7, 0.65], // cinematic blue — work / motion
  warm: [0.9, 0.6, 1.9], // amber craft light — services / expertise
  lift: [1.8, 0.55, 0.65], // white editorial lift — about / contact
  deep: [0.65, 0.9, 0.8], // dimmer, moodier — process / project detail
};

/* Route-level default tints (used when no [data-tint] section dominates). */
const ROUTE_TINT: [RegExp, string][] = [
  [/^\/work\/.+/, 'deep'],
  [/^\/work/, 'cool'],
  [/^\/services/, 'warm'],
  [/^\/about/, 'lift'],
  [/^\/contact/, 'lift'],
];

export default function AmbientGradients() {
  const reduced = useMotionPreference();
  const enabled = !reduced;
  const { pathname } = useLocation();

  const wrapRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: 0.5, y: 0.35 });
  const pos = useRef([
    { x: 0.5, y: 0.35 },
    { x: 0.2, y: 0.7 },
    { x: 0.85, y: 0.6 },
  ]);
  // Current + target tint weights, lerped every frame for a slow
  // crossfade whenever the dominant section (or route) changes.
  const tint = useRef<[number, number, number]>([1, 1, 1]);
  const tintTarget = useRef<[number, number, number]>([1, 1, 1]);

  // Route change → new default tint target (sections may override).
  useEffect(() => {
    const hit = ROUTE_TINT.find(([re]) => re.test(pathname));
    tintTarget.current = [...TINTS[hit ? hit[1] : 'neutral']] as [number, number, number];
  }, [pathname, enabled]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !enabled) return;
    wrap.classList.add('ag-on');

    let rafId = 0;
    let t0 = performance.now();

    // Gentle independent drift paths per blob (period, phase, radius).
    const drift = [
      { px: 26, py: 34, ax: 0.16, ay: 0.12, phase: 0 },
      { px: 38, py: 30, ax: 0.1, ay: 0.16, phase: 2.1 },
      { px: 44, py: 40, ax: 0.14, ay: 0.1, phase: 4.2 },
    ];
    // Filmic exposure flicker — each blob breathes on an unsynced
    // slow noise (two superposed sines beat against each other), so
    // the combined light level never repeats on a metronome. Depth
    // kept subtle: ±~9% around 1 — felt, not noticed.
    const flicker = [
      { p1: 6.7, p2: 10.3, ph1: 0, ph2: 2.4, depth: 0.09 },
      { p1: 8.1, p2: 12.9, ph1: 1.7, ph2: 4.9, depth: 0.08 },
      { p1: 9.4, p2: 14.6, ph1: 3.3, ph2: 0.8, depth: 0.07 },
    ];
    // Cursor follow weights — each blob lags differently (heavy feel).
    const follow = [0.11, 0.07, 0.05];
    // Resting anchors in viewport fractions.
    const anchor = [
      { x: 0.5, y: 0.35 },
      { x: 0.18, y: 0.72 },
      { x: 0.84, y: 0.62 },
    ];

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };

    // — Tint tracking: whichever [data-tint] section owns the viewport
    //   center sets the ambient tint; route defaults apply elsewhere.
    const tintedEls = () => document.querySelectorAll<HTMLElement>('[data-tint]');
    let observed: HTMLElement[] = [];
    let centerEl: HTMLElement | null = null;
    const pickCenter = () => {
      const mid = window.innerHeight / 2;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const el of observed) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = el;
        }
      }
      if (best !== centerEl) {
        centerEl = best;
        if (best && TINTS[best.dataset.tint ?? '']) {
          tintTarget.current = [...TINTS[best.dataset.tint!]] as [number, number, number];
        }
      }
    };
    let pickTimer = 0;
    const schedulePick = () => {
      window.clearTimeout(pickTimer);
      pickTimer = window.setTimeout(pickCenter, 120);
    };
    const syncObserved = () => {
      observed = [...tintedEls()];
      pickCenter();
    };
    // Sections mount with the route — observe both now and on each pick.
    syncObserved();
    const mo = new MutationObserver(syncObserved);
    mo.observe(document.body, { childList: true, subtree: true });

    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Slow tint crossfade (~2.5s to traverse most of the gap).
      for (let i = 0; i < 3; i++) {
        tint.current[i] += (tintTarget.current[i] - tint.current[i]) * 0.022;
      }

      for (let i = 0; i < 3; i++) {
        const el = blobRefs.current[i];
        if (!el) continue;
        const d = drift[i];
        const a = anchor[i];

        // Self drift (Lissajous-ish) + cursor attraction.
        const dx = a.x + Math.sin((t / d.px) * Math.PI * 2 + d.phase) * d.ax
          + (mouse.current.x - a.x) * follow[i] * 3;
        const dy = a.y + Math.cos((t / d.py) * Math.PI * 2 + d.phase) * d.ay
          + (mouse.current.y - a.y) * follow[i] * 3;

        const p = pos.current[i];
        p.x += (dx - p.x) * 0.06; // heavy smoothing — cinematic lag
        p.y += (dy - p.y) * 0.06;

        el.style.transform = `translate3d(${(p.x - 0.5) * w}px, ${(p.y - 0.5) * h}px, 0)`;

        // Exposure breath (drift + flicker + tint share the loop so
        // opacity, position and colour weight update in one paint).
        // The ramp reproduces the 2.4s entrance fade.
        const f = flicker[i];
        const n =
          Math.sin((t / f.p1) * Math.PI * 2 + f.ph1) * 0.62 +
          Math.sin((t / f.p2) * Math.PI * 2 + f.ph2) * 0.38;
        const breath = 1 - f.depth * (n * 0.5 + 0.5);
        const ramp = Math.min(1, t / 2.5);
        el.style.opacity = String(ramp * breath * tint.current[i]);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', schedulePick, { passive: true });
    window.addEventListener('resize', schedulePick, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(pickTimer);
      mo.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', schedulePick);
      window.removeEventListener('resize', schedulePick);
      wrap.classList.remove('ag-on');
    };
  }, [enabled]);

  if (reduced) {
    // Reduced motion: static, non-following wash — still atmospheric.
    return <div className="ag ag-static" aria-hidden="true" />;
  }

  return (
    <div ref={wrapRef} className="ag" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`ag-blob ag-blob-${i + 1}`}
          ref={(el) => {
            blobRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
