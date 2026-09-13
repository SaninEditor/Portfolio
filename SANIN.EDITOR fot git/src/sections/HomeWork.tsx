import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from 'motion/react';
import { featuredProjects, type Project } from '../data/projects';
import { MediaFrame } from '../components/MediaFrame';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { SPRING } from '../lib/anim';

/* ============================================================
   SELECTED WORK — THE SEQUENCE
   Two acts, one pause:

   ACT I   — the pinned expansion: one frame pinned in the
             viewport, growing from a small cell into a
             full-bleed letterboxed shot while the slate
             (title / role / tags) changes beside it.
   PAUSE   — a static typographic moment. No animation. The
             composition breathes before the index.
   ACT II  — the index (link to the full archive).
   ============================================================ */

export default function HomeWork() {
  const [feat] = featuredProjects;

  return (
    <section className="section work-seq" id="work" data-tint="cool">
      <div className="wrap">
        <div className="sec-head">
          <p className="label idx">
            <span className="n">( 01 )</span> — Selected Work
          </p>
          <p className="note">A short, curated edit — played in sequence.</p>
        </div>
      </div>

      {/* ————— ACT I — pinned expansion ————— */}
      {feat && <PinnedAct project={feat} />}

      {/* ————— PAUSE — static statement, deliberately motionless ————— */}
      <div className="work-pause">
        <p className="label label--dim pause-kicker">— intermission</p>
        <p className="pause-line">
          Every cut is a decision.
          <br />
          <span className="serif-i">Every frame earns its place.</span>
        </p>
      </div>

      {/* ————— ACT III — the index ————— */}
      <div className="wrap">
        <div className="sw-more">
          <Link to="/work" className="link-chip" data-cursor="view">
            <span className="chip">
              <span className="arr" aria-hidden="true">
                ↗
              </span>
            </span>
            Full archive — six projects
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————————————————————————
   ACT I — the pinned expansion.
   ———————————————————————————————————————————————— */

const SLATE_LINES = [
  { k: 'Format', v: 'Challenge edits — short form' },
  { k: 'Cut for', v: 'Pace · rhythm · sound' },
  { k: 'Role', v: 'Editor' },
] as const;

function PinnedAct({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, SPRING);

  // The frame starts docked right (the slate owns the left column).
  // The expansion stays modest — the card grows to a confident
  // feature size, never to full-bleed. No sideways drift.
  const width = useTransform(p, [0.05, 0.95], ['58%', '84%']);
  // Slate typography dissolves as the expanding frame covers it —
  // faded out before the frame reaches the slate's column.
  const slateO = useTransform(p, [0.18, 0.45], [1, 0]);
  const slateY = useTransform(p, [0.18, 0.45], ['0%', '-14%']);
  // Media scale — a breath of zoom inside the expanding frame.
  const mediaScale = useTransform(p, [0, 1], [1.12, 1]);
  // A letterbox bar pair closes in slightly at the peak of the shot.
  const barH = useTransform(p, [0.05, 0.95], ['0%', '3.5%']);
  // Depth layer — a giant ghost index drifting behind the frame at
  // its own rate (slower than the frame: reads as atmosphere).
  const ghostX = useTransform(p, [0, 1], ['6%', '-10%']);
  const ghostO = useTransform(p, [0, 0.35, 0.85, 1], [0, 0.55, 0.55, 0.12]);
  // Viewfinder meta dissolves early in the expansion — it would ride
  // under the fixed nav once the frame approaches full-bleed.
  const metaO = useTransform(p, [0.15, 0.45], [1, 0]);

  return (
    <div className="pin-act" ref={ref}>
      <div className="pin-stage">
        {/* background layer — atmosphere behind the shot */}
        <motion.span className="pin-ghost" style={reduced ? undefined : { x: ghostX, opacity: ghostO }} aria-hidden="true">
          {project.index}
        </motion.span>
        <motion.div className="pin-frame" style={{ width }}>
          <motion.div
            className="pin-meta label label--dim"
            style={{ opacity: metaO }}
            aria-hidden="true"
          >
            <span className="rec-live">Featured cut</span>
            <span>{project.cover.ratio.replace(' / ', ':')}</span>
          </motion.div>
          <div className="pin-frame-inner">
            <motion.div className="pin-media pin-media--clean" style={reduced ? undefined : { scale: mediaScale }}>
              <MediaFrame media={project.cover} project={project} />
            </motion.div>
            <motion.div className="pin-bar pin-bar--t" style={{ height: barH }} aria-hidden="true" />
            <motion.div className="pin-bar pin-bar--b" style={{ height: barH }} aria-hidden="true" />
            <Link
              className="pin-link"
              to={`/work/${project.id}`}
              aria-label={`Open case study — ${project.title}`}
              data-cursor={project.kind === 'video' ? 'play' : 'view'}
            />
          </div>
        </motion.div>

        {/* slate — the typographic layer beside the frame */}
        <motion.div className="pin-slate" style={reduced ? undefined : { opacity: slateO, y: slateY }}>
          <p className="label label--hi pin-s-idx">S.01 — Featured</p>
          <h3 className="pin-s-title">{project.title}</h3>
          <dl className="pin-s-list">
            {SLATE_LINES.map((l) => (
              <div className="pin-s-row" key={l.k}>
                <dt className="label label--dim">{l.k}</dt>
                <dd>{l.v}</dd>
              </div>
            ))}
          </dl>
          <p className="pin-s-deck">{project.deck}</p>
        </motion.div>

        {/* scroll progress — like a timeline playhead */}
        <Playhead progress={p} />
      </div>
    </div>
  );
}

/** Thin timeline playhead tracking the act's scroll progress. */
function Playhead({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  return (
    <div className="pin-playhead" aria-hidden="true">
      <motion.div className="pin-playhead-fill" style={{ scaleX }} />
    </div>
  );
}


