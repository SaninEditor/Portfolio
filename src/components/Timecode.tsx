import { useEffect, useRef } from 'react';
import { motionOverrideActive } from '../lib/motionOverride';

/**
 * RUNNING TIMECODE — a live SMPTE-style counter (HH:MM:SS:FF at 24fps)
 * that ticks via rAF, independent of React state. The rec dot pulses in
 * sync. This gives the hero its "subtle loop": the shot is always alive
 * even before the visitor scrolls. Respects reduced motion (renders a
 * static frame and no pulse).
 */
export function Timecode({ label }: { label?: string }) {
  const frameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !motionOverrideActive()) {
      el.textContent = '00:00:00:00';
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = (t - start) / 1000;
      const total = Math.floor(elapsed * 24);
      const f = total % 24;
      const s = Math.floor(total / 24) % 60;
      const m = Math.floor(total / (24 * 60)) % 60;
      const h = Math.floor(total / (24 * 3600)) % 24;
      const pad = (n: number) => String(n).padStart(2, '0');
      el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="hero-tc" aria-hidden="true">
      <span className="tc-rec">●</span>
      <span className="tc-val" ref={frameRef}>
        00:00:00:00
      </span>
      {label && <span className="tc-lab">{label}</span>}
    </div>
  );
}
