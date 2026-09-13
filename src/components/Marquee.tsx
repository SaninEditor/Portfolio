import { memo } from 'react';
import { motion, useTransform } from 'motion/react';
import { useScrollVelocityValue } from '../hooks/useScrollVelocity';
import { useFinePointer } from '../hooks/useFinePointer';

const DEFAULT_ITEMS = ['Video Editing', 'Graphic Design', 'Motion Graphics', 'Visual Storytelling'];

interface MarqueeProps {
  items?: string[];
  className?: string;
}

/**
 * Cinematic divider ticker with scroll-velocity response: the track
 * skews subtly with momentum, like a frame dragged through a cut.
 * The CSS loop handles the constant drift; velocity only adds a
 * controlled skew transform. Disabled on touch + reduced motion.
 */
export const Marquee = memo(function Marquee({
  items = DEFAULT_ITEMS,
  className,
}: MarqueeProps) {
  const vel = useScrollVelocityValue();
  const fine = useFinePointer();
  const skew = useTransform(vel, [0, 1], [0, -7]);
  const stretch = useTransform(vel, [0, 1], [1, 1.045]);

  const seq = [...items, ...items];
  const active = fine ? { skewX: skew, scaleX: stretch } : undefined;

  return (
    <div className={`mq ${className ?? ''}`.trim()} aria-hidden="true">
      <motion.div className="mq-track" style={active}>
        {seq.map((item, i) => (
          <span className="mq-item" key={`${item}-${i}`}>
            {item}
            <span className="mq-sep" aria-hidden="true" />
          </span>
        ))}
      </motion.div>
    </div>
  );
});
