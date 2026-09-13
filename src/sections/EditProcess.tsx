import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, type MotionValue } from 'motion/react';
import { EASE, DUR } from '../lib/anim';
import { useMotionPreference } from '../hooks/useMotionPreference';

/* ============================================================
   THE EDIT — pinned process sequence
   RAW → CUT → SOUND → COLOR → FINAL

   A sticky stage holds a typographic "timeline" while the
   active step drives a full-width progress bar and crossfade
   words. Scroll position IS the playhead. On mobile it
   degrades to a vertical list with reveal-on-scroll.
   ============================================================ */

const STEPS = [
  { index: '01', title: 'RAW', note: 'Footage log, selects, the honest mess before order.' },
  { index: '02', title: 'CUT', note: 'Structure and rhythm — the story takes its shape.' },
  { index: '03', title: 'SOUND', note: 'Music, impact, air. Half the picture, felt first.' },
  { index: '04', title: 'COLOR', note: 'Grade and finish — the tone that makes it a film.' },
  { index: '05', title: 'FINAL', note: 'Delivery. Mastered, checked, where you need it.' },
] as const;

export default function EditProcess() {
  return (
    <section className="edit-section" aria-label="Editing process" data-tint="deep">
      <div className="wrap">
        <div className="sec-head">
          <p className="label idx">
            <span className="n">( 02 )</span> — The Edit
          </p>
          <p className="note">Scroll is the playhead — the process plays as you move.</p>
        </div>
      </div>
      <div className="edit-desktop">
        <DesktopSequence />
      </div>
      <div className="edit-mobile-wrap">
        <MobileList />
      </div>
    </section>
  );
}

/* ————————— desktop: pinned sequence ————————— */

function DesktopSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });

  // 5 steps across the scroll distance; each step owns an equal band.
  return (
    <div className="edit-stage-outer" ref={ref}>
      <div className="edit-stage">
        {/* big background word — crossfades between step names */}
        <div className="edit-ghosts" aria-hidden="true">
          {STEPS.map((s, i) => (
            <GhostWord key={s.title} word={s.title} p={p} band={[i / 5, (i + 1) / 5]} />
          ))}
        </div>

        <div className="wrap edit-rows">
          {STEPS.map((s, i) => (
            <StepRow key={s.title} step={s} p={p} band={[i / 5, (i + 1) / 5]} reduced={!!reduced} />
          ))}
        </div>

        {/* the playhead — a timeline bar across the whole stage */}
        <Playbar p={p} />
      </div>
    </div>
  );
}

function GhostWord({ word, p, band }: { word: string; p: MotionValue<number>; band: [number, number] }) {
  const [a, b] = band;
  // Each ghost word is fully visible inside its own band.
  const opacity = useTransform(p, [a - 0.18, a + 0.05, b - 0.05, b + 0.18], [0, 1, 1, 0]);
  const y = useTransform(p, [a - 0.18, b + 0.18], ['6%', '-6%']);
  return (
    <motion.span className="edit-ghost" style={{ opacity, y }}>
      {word}
    </motion.span>
  );
}

function StepRow({
  step,
  p,
  band,
  reduced,
}: {
  step: (typeof STEPS)[number];
  p: MotionValue<number>;
  band: [number, number];
  reduced: boolean;
}) {
  const [a, b] = band;
  const opacity = useTransform(p, [a - 0.12, a + 0.08, b - 0.02, b + 0.14], [0.28, 1, 1, 0.28]);
  const x = useTransform(p, [a - 0.12, a + 0.08], ['0%', '2.5%']);
  const markerO = useTransform(p, [a - 0.1, a + 0.06, b - 0.02, b + 0.12], [0, 1, 1, 0]);

  return (
    <motion.div className="edit-row" style={reduced ? undefined : { opacity, x }}>
      <span className="edit-idx label">{step.index}</span>
      <h3 className="edit-title">{step.title}</h3>
      <p className="edit-note">{step.note}</p>
      <motion.span className="edit-marker" style={{ opacity: markerO }} aria-hidden="true">
        ▸
      </motion.span>
    </motion.div>
  );
}

function Playbar({ p }: { p: MotionValue<number> }) {
  const scaleX = useTransform(p, [0, 1], [0, 1]);
  return (
    <div className="edit-playbar" aria-hidden="true">
      <div className="edit-playbar-track" />
      <motion.div className="edit-playbar-fill" style={{ scaleX }} />
    </div>
  );
}

/* ————————— mobile: simple vertical list, reveal on scroll ————————— */

function MobileList() {
  return (
    <div className="edit-mobile">
      {STEPS.map((s, i) => (
        <motion.div
          key={s.title}
          className="edit-mrow"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: DUR.mid, ease: EASE, delay: i * 0.05 }}
        >
          <span className="edit-idx label">{s.index}</span>
          <h3 className="edit-title">{s.title}</h3>
          <p className="edit-note">{s.note}</p>
        </motion.div>
      ))}
    </div>
  );
}
