import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { services } from '../data/services';
import { workByCategory, type Project } from '../data/projects';
import { Link } from 'react-router-dom';
import { EASE, EASE_SOFT, DUR, stagger } from '../lib/anim';
import { MediaFrame } from '../components/MediaFrame';
import { useFinePointer } from '../hooks/useFinePointer';

/* ============================================================
   EXPERTISE — THE CAPABILITY SEQUENCE
   01 Video Editing (core — the strongest presentation)
   02 Graphic Design
   03 Motion Graphics (honest: service today, reel in progress)

   The active capability controls the fragment frames floating
   beside the typography. Auto-advances like a sequence until
   the visitor takes over. Motion Graphics gets NO portfolio
   frames — its fragment is a typographic "reel building" note.
   ============================================================ */

export default function HomeExpertise() {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState(false);
  const reduced = useMotionPreference();
  const fine = useFinePointer();

  const seqRef = useRef<HTMLElement>(null);
  // The sequence only runs while the section is actually on screen.
  // (Without this, the timer cycles from page mount while the section
  // is far below the fold — so a swap fires right as the visitor
  // arrives and the fragment cards visibly jump on entry.)
  const inView = useInView(seqRef, { margin: '-12% 0px -12% 0px' });

  // Synchronous interaction guard: set inside the handlers BEFORE
  // React re-renders, so a pending auto-advance tick can never fire
  // after the visitor has taken over (that race caused a visible
  // double-swap — a quick jump right after hovering).
  const visitedRef = useRef(false);
  const takeOver = (i?: number) => {
    visitedRef.current = true;
    setVisited(true);
    if (i !== undefined) setActive(i);
  };

  // Auto-advance like a running sequence — only while in view, and
  // with a FRESH countdown each time the section enters, so the first
  // swap always happens a full cycle after arrival, never on entry.
  useEffect(() => {
    if (!inView || visited || reduced) return;
    const t = setInterval(() => {
      if (visitedRef.current) return; // race guard
      setActive((a) => (a + 1) % services.length);
    }, 4200);
    return () => clearInterval(t);
  }, [inView, visited, reduced]);

  const current = services[active];
  const related: Project[] = current?.related ? workByCategory(current.related).slice(0, 3) : [];

  return (
    <section
      ref={seqRef}
      className="section ex-seq"
      id="services"
      data-tint="warm"
      onMouseEnter={() => takeOver()}
      onFocus={() => takeOver()}
      onPointerDown={() => takeOver()}
    >
      {/* fragment layer — changes with the active capability */}
      {fine && !reduced && (
        <div className="ex-frags" aria-hidden="true">
          <AnimatePresence mode="popLayout">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                className={`ex-frag ex-frag--${i + 1}`}
                initial={{ opacity: 0, scale: 0.92, rotate: i % 2 ? 1.4 : -1.4 }}
                animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 1 : -1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: DUR.slow, ease: EASE_SOFT }}
              >
                <MediaFrame media={p.cover} project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
          {active === 2 && (
            <motion.div
              className="ex-frag ex-frag--reel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.mid, ease: EASE }}
            >
              <span className="label">Reel building —</span>
              <span className="label">real samples ship soon</span>
            </motion.div>
          )}
        </div>
      )}

      <div className="wrap ex-wrap">
        <div className="sec-head">
          <p className="label idx">
            <span className="n">( 03 )</span> — What I Do
          </p>
          <p className="note">Three capabilities. Two are the core of the practice.</p>
        </div>

        <div className="ex-rows" role="list">
          {services.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.id}
                role="listitem"
                className={`ex-row ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => takeOver(i)}
                onFocus={() => takeOver(i)}
                onClick={() => takeOver(i)}
                aria-pressed={isActive}
              >
                <span className="ex-idx label">{s.index}</span>
                <span className="ex-name">{s.title}</span>
                <span className="ex-tag tag-chip">{s.tag}</span>
                <span className="ex-arr" aria-hidden="true">
                  →
                </span>
              </button>
            );
          })}
        </div>

        {/* statement — dissolves between capabilities.
            Crossfade in place (popLayout, no y-travel): the detail
            block must keep a constant height during the swap, or the
            section resizes and the floating fragment cards visibly
            teleport. */}
        <div className="ex-detail" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.slow, ease: EASE_SOFT }}
              >
                <p className="ex-statement">
                  {current.statement}
                </p>
                <div className="ex-meta">
                  <span className="ex-includes">
                    {current.includes.slice(0, 4).map((inc, i) => (
                      <motion.span
                        key={inc}
                        className="label label--dim"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 + stagger(i, 0.06), duration: DUR.mid }}
                      >
                        {inc}
                      </motion.span>
                    ))}
                  </span>
                  <Link to="/services" className="u-link ex-link label">
                    In detail ↗
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
