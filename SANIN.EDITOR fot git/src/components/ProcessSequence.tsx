import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { SPRING } from '../lib/anim';

/**
 * THE PIPELINE — a scroll-driven process sequence for case studies.
 * Scroll position is the playhead: a vertical timeline advances
 * through RAW → … → FINAL, and each step "develops" (opacity +
 * a marker) as the playhead crosses it. Static under reduced motion.
 */
export function ProcessSequence({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    // The element is short, so this pair gives the playhead a long,
    // deliberate travel: starts as the strip enters, ends well past it.
    offset: ['start 0.95', 'end 0.25'],
  });
  const p = useSpring(scrollYProgress, SPRING);

  return (
    <div className="proc-seq" ref={ref}>
      <div className="ps-head">
        <span className="label label--dim">The pipeline</span>
        <span className="label label--dim">Scroll = playhead</span>
      </div>
      <div className="ps-body">
        <div className="ps-rail" aria-hidden="true">
          <motion.div className="ps-rail-fill" style={{ scaleY: p }} />
        </div>
        <ol className="ps-list">
          {steps.map((s, i) => (
            <Step key={`${s}-${i}`} name={s} index={i} total={steps.length} p={p} reduced={reduced} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function Step({
  name,
  index,
  total,
  p,
  reduced,
}: {
  name: string;
  index: number;
  total: number;
  p: MotionValue<number>;
  reduced: boolean;
}) {
  const at = index / total;
  const past = (index + 0.85) / total;
  const opacity = useTransform(p, [at, past], reduced ? [1, 1] : [0.25, 1]);
  const x = useTransform(p, [at, past], reduced ? ['0%', '0%'] : ['0%', '2%']);

  return (
    <motion.li className="ps-step" style={{ opacity, x }}>
      <span className="ps-dot" aria-hidden="true" />
      <span className="ps-idx label label--dim">{String(index + 1).padStart(2, '0')}</span>
      <span className="ps-name">{name}</span>
    </motion.li>
  );
}
