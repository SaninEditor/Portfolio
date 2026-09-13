import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { projectById } from '../data/projects';
import { scrollToId } from '../lib/scroll';
import { MediaFrame } from '../components/MediaFrame';
import { ShowreelModal } from '../components/ShowreelModal';
import { Timecode } from '../components/Timecode';
import { EASE_SOFT, HERO_SEQ } from '../lib/anim';
import { useScrollVelocityValue } from '../hooks/useScrollVelocity';

/**
 * True when a real showreel file is served at site.showreel.src.
 * (Guards against dev-server 404s and SPA fallbacks returning HTML.)
 */
function useShowreelAvailable() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(site.showreel.src, { method: 'HEAD' })
      .then((res) => {
        if (!alive) return;
        const type = res.headers.get('content-type') ?? '';
        setAvailable(res.ok && (type.startsWith('video/') || type === 'application/octet-stream'));
      })
      .catch(() => alive && setAvailable(false));
    return () => {
      alive = false;
    };
  }, []);
  return available;
}

const HERO_PROJECT = 'football-challenge-videos';

/**
 * THE OPENING SHOT — acts, in order:
 *   1. slate     : role overline + descriptor fades in (like a clapper slate)
 *   2. title     : headline rises out of masks — line by line
 *   3. lede      : supporting info + actions appear
 *   4. sheet     : media contact-sheet reveals, letterboxed
 *   5. the shot  : as the visitor scrolls, the sheet expands into a
 *                  full-bleed letterboxed frame — the film begins.
 * The scroll phase is scroll-linked (not time-based) so it plays
 * at the visitor's own pace, forwards and backwards.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // — the shot: the frame holds its composition (no sideways drift).
  // Scrolling plays it like a showreel: a slow push-in, letterbox
  // bars closing to widescreen, and a gentle fade at the end.
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const barH = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '7%']);
  const shotOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, reduced ? 1 : 0.25]);
  const headY = useTransform(scrollYProgress, [0, 0.5], ['0%', reduced ? '0%' : '-12%']);
  const headO = useTransform(scrollYProgress, [0, 0.45], [1, reduced ? 1 : 0]);

  // Static data — guaranteed present, so the non-null assertion is safe.
  const project = projectById(HERO_PROJECT)!;

  // The showreel: a real video at public/media/showreel.mp4 takes
  // over the hero frame; until it exists, the project placeholder plays.
  const showreelMedia = {
    ...project.cover,
    kind: 'video' as const,
    src: site.showreel.src,
    poster: site.showreel.poster,
    alt: `${site.name} showreel — selected cuts`,
  };

  // Scroll cue breathes with scroll momentum — a controlled velocity read.
  const vel = useScrollVelocityValue();
  const cueX = useTransform(vel, [0, 1], [0, -10]);
  const cueO = useTransform(vel, [0, 0.5, 1], [0.75, 1, 0.4]);

  // Full-screen screening — opens from the frame's play affordance.
  const [reelOpen, setReelOpen] = useState(false);
  const reelAvailable = useShowreelAvailable();

  return (
    <section className="hero" ref={ref} id="top">
      <div className="wrap">
        {/* 1 — slate */}
        <motion.div
          className="hero-overline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: HERO_SEQ.overline.duration, delay: HERO_SEQ.overline.delay }}
        >
          <span className="label h-ov">{site.role} — Freelance</span>
          <span className="label label--dim" style={{ display: 'inline-flex', gap: '2em' }}>
            <span>Video</span>
            <span>Design</span>
            <span>Motion</span>
          </span>
        </motion.div>

        {/* 2 — title: masked lines rise one after the other */}
        <motion.h1 className="hero-title" style={{ y: headY, opacity: headO }}>
          <span className="hl">
            <span className="hero-l1">Edits that move.</span>
          </span>
          <span className="hl">
            <span className="hero-l2">
              <span className="serif-i">Design that holds.</span>
            </span>
          </span>
        </motion.h1>

        {/* 3 — lede + actions */}
        <div className="hero-grid grid-12">
          <div className="hero-copy">
            <motion.p
              className="hero-lede"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: HERO_SEQ.lede.duration, ease: EASE_SOFT, delay: HERO_SEQ.lede.delay }}
            >
              I'm a <strong>video editor</strong> and <strong>graphic designer</strong>. Raw
              footage becomes stories; ideas become visuals — for creators, brands and businesses
              that care how they're seen.
            </motion.p>

            <motion.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: HERO_SEQ.ctas.duration, ease: EASE_SOFT, delay: HERO_SEQ.ctas.delay }}
            >
              <button className="btn" onClick={() => scrollToId('work')}>
                <span className="btn-fill" aria-hidden="true" />
                Play the sequence
              </button>
              <Link to="/services" className="btn btn--ghost">
                What I do <span aria-hidden="true">→</span>
              </Link>
            </motion.div>

            <motion.div
              className="hero-tags"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: HERO_SEQ.tags.duration, delay: HERO_SEQ.tags.delay }}
            >
              <span>Video editing</span>
              <span>Graphic design</span>
              <span>Motion graphics</span>
            </motion.div>
          </div>
        </div>

        {/* 5 — the showreel: framed reel with letterbox bars that close
            to widescreen and a slow push-in as the visitor scrolls.
            On load it plays the projector intro: slit of light →
            shutter opens → exposure settles → chrome lands. */}
        <motion.div className="hero-shot" style={{ opacity: shotOpacity }}>
          <MediaRevealMount delay={HERO_SEQ.media.delay}>
            <div className="hero-shot-frame">
              <motion.div
                className="hero-reel-top label label--dim"
                aria-hidden="true"
                initial={reduced ? false : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE_SOFT, delay: HERO_SEQ.media.delay + 1.7 }}
              >
                <span>Showreel</span>
                {reelAvailable ? (
                  <button className="reel-play label" onClick={() => setReelOpen(true)}>
                    <span className="rec-dot" aria-hidden="true" /> Play reel
                  </button>
                ) : (
                  <span>Selected cuts</span>
                )}
              </motion.div>
              <motion.div
                className="hero-shot-drift"
                style={reduced ? undefined : { scale: mediaScale }}
              >
                <motion.div
                  initial={reduced ? false : { scale: 1.06, x: '-1.2%', y: '0.6%' }}
                  animate={reduced ? undefined : { scale: 1.12, x: '1.2%', y: '-0.6%' }}
                  transition={reduced ? undefined : { duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
                >
                  <MediaFrame media={showreelMedia} project={project} />
                </motion.div>
              </motion.div>
              <motion.div className="hero-bar hero-bar--t" style={{ height: barH }} aria-hidden="true" />
              <motion.div className="hero-bar hero-bar--b" style={{ height: barH }} aria-hidden="true" />
              {/* running timecode — the loop is alive even before scrolling */}
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE_SOFT, delay: HERO_SEQ.media.delay + 1.9 }}
              >
                <Timecode label="REEL — SELECTED CUTS" />
              </motion.div>
            </div>
          </MediaRevealMount>
        </motion.div>
      </div>

      <ShowreelModal open={reelOpen} onClose={() => setReelOpen(false)} />

      <div className="hero-foot wrap">
        <motion.span
          className="hero-scroll"
          style={reduced ? undefined : { x: cueX, opacity: cueO }}
        >
          <span className="line" aria-hidden="true" />
          Scroll to play
        </motion.span>
        <span className="hero-now">
          <span className="rec-dot" aria-hidden="true" />
          Now in the timeline — football challenge edits
        </span>
        <span className="hero-foot-mid">Editing &amp; design, in one place</span>
        <span>↓</span>
      </div>
    </section>
  );
}

/**
 * Local mount-mode media reveal — the PROJECTOR INTRO.
 *
 * Act 1 (0 – 0.28)  a hairline slit of light: the frame exists only
 *                   as a thin horizontal strip, underexposed.
 * Act 2 (0.28 – 1)  the shutter opens vertically — the slit wipes
 *                   up/down to the full frame.
 * Act 3 (0 – 1)     exposure settles: brightness rises, blur and a
 *                   slight over-scale resolve to sharp.
 * The reel chrome (header + timecode) lands after the frame is open.
 */
function MediaRevealMount({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduced = useMotionPreference();
  if (reduced) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ clipPath: 'inset(49.6% 2% 49.6% 2%)', opacity: 0 }}
      animate={{
        clipPath: [
          'inset(49.6% 2% 49.6% 2%)',
          'inset(49.4% 0% 49.4% 0%)',
          'inset(0% 0% 0% 0%)',
        ],
        opacity: [0, 1, 1],
      }}
      transition={{
        duration: 1.9,
        delay,
        ease: EASE_SOFT,
        times: [0, 0.28, 1],
      }}
    >
      <motion.div
        initial={{ scale: 1.07, filter: 'brightness(0.45) blur(14px)' }}
        animate={{ scale: 1, filter: 'brightness(1) blur(0px)' }}
        transition={{ duration: 1.9, delay, ease: EASE_SOFT }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
