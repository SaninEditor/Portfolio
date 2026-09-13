import { site } from '../data/site';
import { Reveal, Masked } from '../components/Reveal';

/**
 * Big closing statement — one strong CTA plus contact channels.
 * Used on every page except /contact (which has its own).
 */
export default function FinalCta() {
  return (
    <section className="section cta-final" id="contact">
      <div className="wrap">
        <div className="cta-grid">
          <div className="cta-l">
            <p className="label" style={{ marginBottom: 'var(--sp-6)' }}>
              ( 05 ) — Have a project in mind?
            </p>
            <h2>
              <Masked>Let's make</Masked>
              <br />
              <Masked>
                <span className="it">it move.</span>
              </Masked>
            </h2>

            <div className="cta-mail">
              <Reveal delay={0.1}>
                <a className="btn" href={`mailto:${site.email}?subject=New%20project`}>
                  <span className="btn-fill" aria-hidden="true" />
                  Let's work
                </a>
              </Reveal>
              <Reveal delay={0.18}>
                <a className="addr u-link" href={`mailto:${site.email}`}>
                  <u>{site.email}</u>
                </a>
              </Reveal>
            </div>
          </div>

          <div className="cta-r">
            <Reveal delay={0.15}>
              <p>
                Tell me what you're making — the format, the deadline, the feeling you're after. A
                short message is enough to start.
              </p>
              <div className="cta-socials">
                <a href={site.instagram.url} target="_blank" rel="noreferrer">
                  Instagram ↗
                </a>
                <a href={`mailto:${site.email}`}>Email ↗</a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
