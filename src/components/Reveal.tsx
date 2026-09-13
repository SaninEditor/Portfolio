import { useRef, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'motion/react';
import {
  EASE,
  EASE_SOFT,
  DUR,
  REVEAL_Y,
  CLIP_MEDIA,
  CLIP_FULL,
  SPRING,
  viewport,
  mediaViewport,
} from '../lib/anim';
import { useMotionPreference } from '../hooks/useMotionPreference';

/* ------------------------------------------------------------
   Scroll-linked easing springs — text reveals track the
   scrollbar but with a touch of weight, so they read as
   physical rather than glued to the wheel.
   ------------------------------------------------------------ */
const TEXT_SPRING = { stiffness: 140, damping: 28, mass: 0.35 } as const;

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before animating (for staggering). */
  delay?: number;
  /** Pixels travelled from below. */
  y?: number;
  className?: string;
}

/**
 * Scroll-linked body reveal — the paragraph *develops* as it travels
 * up the lower viewport (rise + fade), and reverses if you scroll
 * back. Progress-mapped, not a one-shot trigger.
 */
export function Reveal({ children, y = REVEAL_Y, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.96', 'start 0.7'],
  });
  const smooth = useSpring(scrollYProgress, TEXT_SPRING);
  const ty = useTransform(smooth, [0, 1], [y, 0]);
  const o = useTransform(smooth, [0, 1], [0, 1]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} style={{ y: ty, opacity: o }}>
      {children}
    </motion.div>
  );
}

/** Fade only (for elements already positioned by layout). */
export function FadeIn({ children, delay = 0, className }: RevealProps) {
  const reduced = useMotionPreference();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewport}
      transition={{ duration: DUR.slow, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Cinematic media reveal — the frame unclips (inset mask opens),
 * the inner media settles from a slight scale, and a soft blur
 * resolves to sharp. The signature "image enters like a cut" motion.
 * Disabled under reduced motion (renders plain).
 */
export function MediaReveal({
  children,
  delay = 0,
  className,
  mode = 'view',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** 'view' fires on scroll-into-view; 'mount' fires immediately (opening shots). */
  mode?: 'view' | 'mount';
}) {
  const reduced = useMotionPreference();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={`mreveal ${className ?? ''}`.trim()}
      initial={{ clipPath: CLIP_MEDIA, opacity: 0 }}
      {...(mode === 'mount'
        ? { animate: { clipPath: CLIP_FULL, opacity: 1 } }
        : { whileInView: { clipPath: CLIP_FULL, opacity: 1 }, viewport: mediaViewport })}
      transition={{ duration: DUR.settle, ease: EASE_SOFT, delay }}
    >
      <motion.div
        className="mreveal-inner"
        initial={{ scale: 1.06, filter: 'blur(10px)' }}
        {...(mode === 'mount'
          ? { animate: { scale: 1, filter: 'blur(0px)' } }
          : { whileInView: { scale: 1, filter: 'blur(0px)' }, viewport: mediaViewport })}
        transition={{ duration: DUR.settle, ease: EASE_SOFT, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  /** Movement range as a fraction, e.g. 0.12 = ±6% around center. */
  amount?: number;
  className?: string;
}

/**
 * Very subtle scroll parallax — the element drifts vertically a few
 * percent as it crosses the viewport. Spring-smoothed, GPU-only
 * (transform), disabled under reduced motion.
 */
export function Parallax({ children, amount = 0.1, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, SPRING);
  const y = useTransform(smooth, [0, 1], [`${amount * 100}%`, `${-amount * 100}%`]);

  if (reduced) return <div ref={ref} className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/**
 * Masked line reveal — now SCROLL-DRIVEN and word-staggered.
 *
 * A string of text is split into words; each word rises out of the
 * overflow mask on its own slice of the scroll range, so the title
 * *assembles* as the visitor scrolls and dissolves back when they
 * scroll away. Non-string children reveal as a single masked block.
 */
export function Masked({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useMotionPreference();
  const maskRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: maskRef,
    offset: ['start 0.98', 'start 0.6'],
  });
  const smooth = useSpring(scrollYProgress, TEXT_SPRING);

  // Release the mask once fully revealed so descenders can never crop.
  useMotionValueEvent(smooth, 'change', (v) => {
    if (v >= 0.99) maskRef.current?.classList.add('is-revealed');
    else maskRef.current?.classList.remove('is-revealed');
  });

  if (reduced) return <span className={`mline ${className ?? ''}`.trim()}>{children}</span>;

  if (typeof children === 'string') {
    const words = children.split(/\s+/);
    return (
      <span
        className={`mline ${className ?? ''}`.trim()}
        ref={maskRef}
      >
        {words.map((w, i) => (
          <MaskedWord
            key={`${w}-${i}`}
            progress={smooth}
            range={[Math.min((i / words.length) * 0.7, 0.7), Math.min((i / words.length) * 0.7 + 0.42, 1)]}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </MaskedWord>
        ))}
      </span>
    );
  }

  return (
    <span className={`mline ${className ?? ''}`.trim()} ref={maskRef}>
      <MaskedWord progress={smooth} range={[0, 1]}>
        {children}
      </MaskedWord>
    </span>
  );
}

/** One word (or block) of a masked reveal, mapped to a slice of scroll. */
function MaskedWord({
  children,
  progress,
  range,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const y = useTransform(progress, range, ['118%', '0%']);
  const o = useTransform(
    progress,
    [range[0], range[0] + (range[1] - range[0]) * 0.6],
    [0, 1],
  );
  return <motion.span style={{ y: y as unknown as MotionValue<string>, opacity: o }}>{children}</motion.span>;
}


