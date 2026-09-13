import { Link } from 'react-router-dom';
import { services } from '../data/services';
import { Reveal } from '../components/Reveal';

export default function HomeServices() {
  return (
    <section className="sv section" id="services">
      <div className="wrap">
        <div className="sec-head">
          <p className="label idx">
            <span className="n">( 02 )</span> — What I Do
          </p>
          <p className="note">Three capabilities. Two are the core of my practice.</p>
        </div>

        <Reveal>
          <div className="sv-rows">
            {services.map((s) => (
              <Link
                key={s.id}
                to="/services"
                className="sv-row"
                data-cursor="view"
                aria-label={`Services — ${s.title}`}
              >
                <span className="s-idx" aria-hidden="true">
                  {s.index}
                </span>
                <span className="s-main">
                  <span className="s-title">
                    <span className="s-name">{s.title}</span>
                    <span className="tag">{s.tag}</span>
                  </span>
                  <span className="label label--dim s-note">{s.deck}</span>
                </span>
                <span className="label s-go" style={{ justifySelf: 'end' }} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Reveal>

        <p className="label label--dim" style={{ marginTop: 'var(--sp-5)' }}>
          Every service, detailed on the <Link className="u-link" to="/services" style={{ color: 'var(--ink-2)' }}>services page</Link>.
        </p>
      </div>
    </section>
  );
}
