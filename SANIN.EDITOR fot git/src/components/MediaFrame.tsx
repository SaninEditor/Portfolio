import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Media, Project } from '../data/projects';

/* ————————————————————————————————————————————————
   Lazy video loading — connection-aware.
   Videos only start downloading when their frame nears the
   viewport. On slow connections (save-data / 2G) the preload
   margin shrinks so nothing speculative is fetched.
   Images use native loading="lazy" and need none of this.
   ———————————————————————————————————————————————— */

interface NetworkConnection {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, cb: () => void) => void;
  removeEventListener?: (type: string, cb: () => void) => void;
}

function useSlowConnection() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkConnection }).connection;
    if (!conn) return;
    const update = () =>
      setSlow(Boolean(conn.saveData) || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g');
    update();
    conn.addEventListener?.('change', update);
    return () => conn.removeEventListener?.('change', update);
  }, []);
  return slow;
}

/** Becomes true once the element approaches the viewport. */
function useNearView<T extends HTMLElement>(slow: boolean) {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      // Fast links: start fetching well before the frame arrives.
      // Slow links: fetch only when it's genuinely about to be seen.
      { rootMargin: slow ? '150px 0px' : '600px 0px' },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near, slow]);
  return { ref, near };
}

/* ————————————————————————————————————————————————
   Placeholder poster system.
   Real media drops straight in: set `src` and the
   placeholder below is never rendered again.
   ———————————————————————————————————————————————— */

const TONES = [
  'linear-gradient(155deg, #191919 0%, #0a0a0a 46%, #141414 100%)',
  'linear-gradient(200deg, #101010 0%, #1c1c1c 55%, #080808 100%)',
  'linear-gradient(130deg, #151515 0%, #0d0d0d 38%, #1a1a1a 100%)',
  'linear-gradient(170deg, #0d0d0d 0%, #161616 48%, #0b0b0b 100%)',
  'linear-gradient(215deg, #1b1b1b 0%, #0e0e0e 40%, #131313 100%)',
];

const toneFor = (id: string) => {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return TONES[n % TONES.length];
};

function ratioLabel(ratio: string) {
  return ratio.replace(/\s+/g, '').replace('/', ':');
}

function isPortrait(ratio: string) {
  const [a, b] = ratio.split('/').map((v) => parseFloat(v));
  return b > a;
}

interface PlaceholderProps {
  project: Project;
  ratio: string;
}

function PlaceholderFrame({ project, ratio }: PlaceholderProps) {
  const video = project.kind === 'video';
  const centered = project.kind === 'design' && !isPortrait(ratio);

  const align = centered ? 'ph--bc' : 'ph--bl';

  return (
    <div
      className={`ph ${align}`}
      style={{ background: toneFor(project.id) } as CSSProperties}
      role="img"
      aria-label={`${project.title} — placeholder frame. Swap in the real media via src/data/projects.ts.`}
    >
      <span className="ph-idx" aria-hidden="true">
        {project.index}
      </span>

      <div className="ph-top" aria-hidden="true">
        <span className={video ? 'rec' : ''}>{video ? 'Rec' : 'Poster'}</span>
        <span>{ratioLabel(ratio)}</span>
      </div>

      {video && <span className="ph-sheen" aria-hidden="true" />}

      <div className="ph-body">
        <p className="ph-kicker">{project.category}</p>
        <p className={centered ? 'ph-title--serif' : 'ph-title'}>{project.title}</p>
        {project.tags.length > 0 && (
          <p className="ph-sub" aria-hidden="true">
            {project.tags.slice(0, 3).join('  ·  ')}
          </p>
        )}
      </div>
    </div>
  );
}

/* ————————————————————————————————————————————————
   MediaFrame — real asset or placeholder
   ———————————————————————————————————————————————— */

interface MediaFrameProps {
  media: Media;
  project: Project;
  className?: string;
  /** Disable the 1px frame border (for full-bleed compositions). */
  borderless?: boolean;
  /** Extra style (e.g. overrides for full-bleed). */
  style?: CSSProperties;
}

export function MediaFrame({ media, project, className, borderless, style }: MediaFrameProps) {
  // Buffering shimmer: visible while the real media loads in.
  // Videos fire 'playing' once frames actually render; images fire 'load'.
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(() => Boolean(media.src));
  const slow = useSlowConnection();
  const { ref: lazyRef, near } = useNearView<HTMLDivElement>(slow);
  const hasSrc = Boolean(media.src) && !failed;
  const showImage = media.kind === 'image' && hasSrc;
  // The video src is only attached once the frame is near the viewport.
  const showVideo = media.kind === 'video' && hasSrc;
  const streamVideo = showVideo && near;
  const cls = ['frame', loading ? 'is-loading' : '', borderless ? '' : 'frame--media', className ?? '']
    .filter(Boolean)
    .join(' ');

  const inner = (() => {
    if (showImage) {
      return (
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoading(false)}
          onError={() => {
            setFailed(true);
            setLoading(false);
          }}
        />
      );
    }
    if (showVideo) {
      return (
        <video
          src={streamVideo ? media.src : undefined}
          poster={media.poster}
          muted
          loop
          autoPlay
          playsInline
          preload={streamVideo ? 'auto' : 'none'}
          aria-label={media.alt}
          onLoadedData={() => setLoading(false)}
          onWaiting={() => setLoading(true)}
          onPlaying={() => setLoading(false)}
          onError={() => {
            setFailed(true);
            setLoading(false);
          }}
        />
      );
    }
    return <PlaceholderFrame project={project} ratio={media.ratio} />;
  })();

  return (
    <div ref={lazyRef} className={cls} style={{ aspectRatio: media.ratio, ...style }}>
      {inner}
      {/* progressive-loading shimmer — swept away when the media lands.
          Doubles as the pre-fetch state for lazily-gated videos. */}
      {loading && <span className="frame-shimmer" aria-hidden="true" />}
    </div>
  );
}
