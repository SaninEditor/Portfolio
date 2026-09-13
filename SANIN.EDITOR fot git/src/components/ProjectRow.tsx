import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Project } from '../data/projects';
import { MediaFrame } from './MediaFrame';

interface ProjectRowProps {
  project: Project;
  /** Optional extra meta on the right (defaults to category). */
  meta?: string;
}

/**
 * Editorial index row — number, big title, meta — with a floating
 * frame preview that follows the cursor on desktop. Links to the
 * case-study page.
 */
export function ProjectRow({ project, meta }: ProjectRowProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [flip, setFlip] = useState(false);

  const onMove = (e: ReactPointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== 'mouse') return;
    setPos({ x: e.clientX, y: e.clientY });
    setFlip(e.clientX > window.innerWidth - 430);
  };

  return (
    <li
      className="row"
      data-cursor="view"
      onPointerMove={onMove}
      onPointerLeave={() => setPos(null)}
    >
      <span className="r-idx" aria-hidden="true">
        {project.index}
      </span>

      <h3 className="r-title">{project.title}</h3>

      <span className="r-meta">
        <span className="label label--dim">{meta ?? project.category}</span>
        {project.client && (
          <span className="label" style={{ color: 'var(--ink-faint)' }}>
            {project.client}
          </span>
        )}
      </span>

      <Link
        className="stretch-link"
        to={`/work/${project.id}`}
        aria-label={`Open case study — ${project.title}`}
      />

      {pos && (
        <div
          className={`row-ghost ${flip ? 'is-flip' : ''} is-on`}
          style={{ left: pos.x, top: pos.y }}
          aria-hidden="true"
        >
          <MediaFrame media={project.cover} project={project} />
        </div>
      )}
    </li>
  );
}
