import { Link } from 'react-router-dom';
import type { Media, Project } from '../data/projects';
import { MediaFrame } from './MediaFrame';

interface MediaCardProps {
  project: Project;
  media?: Media;
  className?: string;
  /** Override ratio for a specific composition slot. */
  ratio?: string;
  /** Small label shown top-left of the hover overlay. */
  label?: string;
}

/**
 * A frame that links into a case study. On desktop the caption
 * (title + category) fades up over the media on hover.
 */
export function MediaCard({
  project,
  media,
  className,
  ratio,
  label = 'Case study',
}: MediaCardProps) {
  const m = media ?? project.cover;
  const frame = ratio ? { ...m, ratio } : m;

  return (
    <Link
      className={`media-card zoom-hover ${className ?? ''}`.trim()}
      to={`/work/${project.id}`}
      data-cursor={project.kind === 'video' ? 'play' : 'view'}
      aria-label={`Open case study — ${project.title}`}
    >
      <MediaFrame media={frame} project={project} />

      <span className="mcap" aria-hidden="true">
        <span className="label label--hi">{label}</span>
        <span className="t">
          {project.title}
          <span className="go" style={{ fontSize: '0.6em', color: 'var(--ink-mid)' }}>
            {' '}
            ↗
          </span>
        </span>
      </span>
    </Link>
  );
}
