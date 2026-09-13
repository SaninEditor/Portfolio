import { Link } from 'react-router-dom';
import { workByCategory } from '../data/projects';
import { Seo } from '../components/Seo';
import { ProjectRow } from '../components/ProjectRow';
import { Reveal, Masked } from '../components/Reveal';

const CHAPTERS = [
  { label: 'Video Editing', kicker: 'Moving work' },
  { label: 'Graphic Design', kicker: 'Still work' },
] as const;

export default function WorkPage() {
  return (
    <>
      <Seo page="Work" />

      <header className="mast wrap">
        <p className="label kicker">( 01 ) — Work Archive</p>
        <h1>
          <Masked>The work,</Masked>
          <br />
          <Masked>
            <span className="it">in full.</span>
          </Masked>
        </h1>
        <Reveal delay={0.12}>
          <p className="sub">
            Everything currently live — challenge edits and vlogs on the video side, campaign and
            product posters on the design side. Hover a row to preview the frame.
          </p>
        </Reveal>
      </header>

      <div className="wrap" style={{ paddingBottom: 'clamp(80px,12vh,150px)' }}>
        {CHAPTERS.map((ch, ci) => {
          const items = workByCategory(ch.label);
          if (items.length === 0) return null;
          return (
            <section className="wl-chapter" key={ch.label} aria-label={ch.label}>
              <Reveal>
                <p className="wl-ch-head">
                  ( 0{ci + 1} ) — {ch.kicker}
                  <span className="cnt">
                    {items.length} {items.length === 1 ? 'piece' : 'pieces'}
                  </span>
                </p>
                <ul className="rows">
                  {items.map((p) => (
                    <ProjectRow key={p.id} project={p} />
                  ))}
                </ul>
              </Reveal>
            </section>
          );
        })}

        {/* Honest motion-graphics note */}
        <Reveal>
          <aside className="wl-foot-note" aria-label="Motion graphics">
            <p className="t">Also on offer — motion graphics.</p>
            <p className="d">
              Offered as a service today: kinetic type, titles and animated graphics inside the
              edit. The portfolio fills with real motion samples as they ship — no invented work.
            </p>
            <p className="a">
              <Link to="/services" className="link-chip" data-cursor="view">
                See services
                <span className="chip" aria-hidden="true">
                  <span className="arr">→</span>
                </span>
              </Link>
            </p>
          </aside>
        </Reveal>
      </div>
    </>
  );
}
