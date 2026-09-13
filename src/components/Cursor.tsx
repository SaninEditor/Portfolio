import { useEffect, useRef, useState } from 'react';
import { useFinePointer } from '../hooks/useFinePointer';
import { useMotionPreference } from '../hooks/useMotionPreference';

/**
 * Custom cursor — two layers:
 *  · crisp 6px dot (mix-blend difference)
 *  · 46px ring     (grows over interactive elements)
 * Active only on fine pointers, disabled under reduced motion.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useMotionPreference();
  const enabled = fine && !reduced;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const downRef = useRef(false);

  const [state, setState] = useState<{ hover: boolean; label: boolean; down: boolean; text: string }>({
    hover: false,
    label: false,
    down: false,
    text: 'View',
  });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add('cr-on');

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const dot = { x: pos.x, y: pos.y };
    const ring = { x: pos.x, y: pos.y };
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && Boolean(t.closest('a, button, [role="button"], [data-cursor], input, textarea, select'));

    const onOver = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;
      const raw = el?.getAttribute('data-cursor') || '';
      const label = raw === 'view' || raw === 'next' || raw === 'play' ? raw : '';
      const interactive = isInteractive(e.target);
      setState((s) => ({
        ...s,
        hover: interactive,
        label: Boolean(label && interactive),
        text: label ? label.charAt(0).toUpperCase() + label.slice(1) : 'View',
      }));
    };

    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget && isInteractive(e.relatedTarget)) return;
      setState((s) => ({ ...s, hover: false, label: false }));
    };

    const onDown = () => {
      downRef.current = true;
      setState((s) => ({ ...s, down: true }));
    };
    const onUp = () => {
      downRef.current = false;
      setState((s) => ({ ...s, down: false }));
    };

    // Re-check hover state when elements mount under a stationary cursor
    // (e.g. after route changes) is intentionally skipped — movement retriggers.

    const loop = () => {
      dot.x += (pos.x - dot.x) * 0.55;
      dot.y += (pos.y - dot.y) * 0.55;
      ring.x += (pos.x - ring.x) * 0.22;
      ring.y += (pos.y - ring.y) * 0.22;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) scale(${downRef.current ? 0.5 : 1})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) scale(${downRef.current ? 0.8 : 1})`;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mouseout', onOut, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('cr-on');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const cls = [
    'cr-ring',
    state.hover ? 'is-hover' : '',
    state.label ? 'is-label' : '',
    state.down ? 'is-down' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div ref={ringRef} className={cls} aria-hidden="true">
        <span className="cr-txt">{state.text}</span>
      </div>
      <div ref={dotRef} className="cr-dot" aria-hidden="true" />
    </>
  );
}
