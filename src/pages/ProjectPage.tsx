import { Link, useParams } from 'react-router-dom';
import { motion, useTransform } from 'motion/react';
import type { Media, Project } from '../data/projects';
import { hasRealMedia, nextProject, projectById } from '../data/projects';
import { Seo } from '../components/Seo';
import { MediaFrame } from '../components/MediaFrame';
import { Reveal, FadeIn, Masked, MediaReveal, Parallax } from '../components/Reveal';
import { ScrollProgressRail } from '../components/ScrollProgressRail';
import { useScrollVelocityValue } from '../hooks/useScrollVelocity';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { ProcessSequence } from '../components/ProcessSequence';
import NotFoundPage from './NotFoundPage';

function isPortrait(m: Media) {
  const [a, b] = m.ratio.split('/').map((v) => parseFloat(v));
  return b > a;
}

function FigurePair({ a, b, project }: { a: Media; b: Media; project: Project }) {
  // Wider media goes left, taller right — the pair reads as an editorial spread.
  const wide = !isPortrait(a);
  const left = wide ? a : b;
  const right = wide ? b : a;
  return (
    <div className="fig-pair">
      <MediaReveal className="w">
        <MediaFrame media={left} project={project} />
        {left.caption && (
          <div className="cap">
            <span>{left.caption}</span>
          </div>
        )}
      </MediaReveal>
      <MediaReveal className="t" delay={0.12}>
        <MediaFrame media={right} project={project} />
        {right.caption && (
          <div className="cap">
            <span>{right.caption}</span>
          </div>
        )}
      </MediaReveal>
    </div>
  );
}

export default function ProjectPage() {
  const { id } = useParams();
  const project = id ? projectById(id) : undefined;

  if (!project) return <NotFoundPage />;
  return <CaseStudy project={project} />;
}

function CaseStudy({ project }: { project: Project }) {
  const next = nextProject(project.id);
  const placeholders = !hasRealMedia(project);
  const reduced = useMotionPreference();
  // The closing cut picks up momentum: the next-project media leans
  // into the scroll direction as the visitor races toward it.
  const vel = useScrollVelocityValue();
  const lean = useTransform(vel, [0, 1], [0, -14]);
  const leanO = useTransform(vel, [0, 1], [1, 0.82]);

  return (
    <>
      <Seo page={project.title} description={project.deck} />
      <ScrollProgressRail />

      <article className="case">
        <div className="wrap">
          {/* back */}
          <div className="case-back">
            <Link to="/work">← Work index</Link>
            <span className="label label--dim">
              N° {project.index} — {project.category}
            </span>
          </div>

          {/* header */}
          <header className="case-h">
            <Reveal className="c-meta">
              <dl className="c-meta-list">
                <div className="c-meta-row">
                  <dt>Category</dt>
                  <dd>{project.category}</dd>
                </div>
                {project.client && (
                  <div className="c-meta-row">
                    <dt>Client</dt>
                    <dd>{project.client}</dd>
                  </div>
                )}
                {project.year && (
                  <div className="c-meta-row">
                    <dt>Year</dt>
                    <dd>{project.year}</dd>
                  </div>
                )}
                <div className="c-meta-row">
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </div>
                {project.tools.length > 0 && (
                  <div className="c-meta-row">
                    <dt>Tools</dt>
                    <dd>{project.tools.join(' · ')}</dd>
                  </div>
                )}
              </dl>
            </Reveal>

            <div className="c-title-wrap">
              <h1>
                <Masked>{project.title}</Masked>
              </h1>
            </div>

            <Reveal delay={0.12} className="c-deck-wrap">
              <p className="c-deck">{project.deck}</p>
              {project.tags.length > 0 && (
                <span className="chips" style={{ marginTop: 'var(--sp-5)' }}>
                  {project.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </span>
              )}
            </Reveal>
          </header>

          {/* hero media — cinematic settle + subtle parallax */}
          <div className="c-hero">
            <Parallax amount={0.05}>
              <MediaReveal>
                <MediaFrame media={project.cover} project={project} />
              </MediaReveal>
            </Parallax>
            {project.cover.caption && (
              <div className="cap">
                <span>{project.cover.caption}</span>
                <span className="right">Hero frame</span>
              </div>
            )}
          </div>

          {/* overview */}
          <div className="case-body">
            <div className="cb-lab">
              <span>Overview</span>
            </div>
            <div className="cb-copy">
              {project.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {placeholders && (
                <p className="note">
                  Media note — every frame on this page is an art-directed placeholder. Add real
                  videos and posters to /public/media, then point to them in src/data/projects.ts.
                  This note disappears automatically once a real asset is set.
                </p>
              )}
            </div>
          </div>

          {/* editing pipeline — scroll IS the playhead, steps develop in order */}
          {project.process && project.process.length > 1 && (
            <ProcessSequence steps={project.process} />
          )}

          {project.pull && (
            <div className="case-quote">
              <FadeIn>
                <blockquote>“{project.pull}”</blockquote>
              </FadeIn>
            </div>
          )}

          {/* gallery */}
          {project.figs.length > 0 && (
            <div className="case-figs">
              {project.figs.map((fig, i) => {
                // Odd entries are consumed by the pair rendered above.
                if (i % 2 === 1 && project.figs[i - 1]) return null;
                const mate = project.figs[i + 1];
                if (mate) {
                  return <FigurePair key={i} a={fig} b={mate} project={project} />;
                }
                return (
                  <MediaReveal key={i} className="fig-full">
                    <MediaFrame media={fig} project={project} />
                    {fig.caption && (
                      <div className="cap">
                        <span>{fig.caption}</span>
                      </div>
                    )}
                  </MediaReveal>
                );
              })}
            </div>
          )}

          {/* next project — the sequence continues */}
          <nav className="case-next" aria-label="Next project">
            <div className="n-top">
              <span>Next in the sequence</span>
              <Link to="/work" className="u-link" style={{ color: 'var(--ink-2)' }}>
                Work index ↗
              </Link>
            </div>
            <Link to={`/work/${next.id}`} className="n-main" data-cursor="next">
              <motion.div
                className="n-media"
                style={reduced ? undefined : { x: lean, opacity: leanO }}
              >
                <MediaFrame media={next.cover} project={next} />
              </motion.div>
              <div className="n-info">
                <span className="label label--dim prev" aria-hidden="true">
                  N° {next.index} — {next.category}
                </span>
                <span className="n-title">
                  {next.title}
                  <span className="go" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </div>
            </Link>
          </nav>
        </div>
      </article>
    </>
  );
}
