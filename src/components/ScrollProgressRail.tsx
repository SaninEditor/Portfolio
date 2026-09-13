import { motion, useScroll, useSpring } from 'motion/react';

/**
 * THE PLAYHEAD — a hairline progress rail fixed at the right edge
 * during a case study. Scroll position is timeline position.
 */
export function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <div className="rail" aria-hidden="true">
      <motion.div className="rail-fill" style={{ scaleY: scaleX }} />
    </div>
  );
}
