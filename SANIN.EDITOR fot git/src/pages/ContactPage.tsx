import { site } from '../data/site';
import { Seo } from '../components/Seo';
import { Reveal, Masked } from '../components/Reveal';

export default function ContactPage() {
  return (
    <>
      <Seo page="Contact" />

      <header className="mast wrap" style={{ paddingBottom: 'clamp(24px,4vh,48px)' }}>
        <p className="label kicker">( 04 ) — Contact</p>
      </header>

      <section className="contact-big wrap">
        <h2>
          <Masked>Have a project</Masked>
          <br />
          <Masked>
            <span className="it">in mind?</span>
          </Masked>
        </h2>

        <div className="contact-links">
          <Reveal delay={0.08}>
            <a className="contact-link" href={`mailto:${site.email}`} data-cursor="view">
              <span className="k">Email</span>
              <span className="v">{site.email}</span>
              <span className="a" aria-hidden="true">
                ↗
              </span>
            </a>
          </Reveal>
          <Reveal delay={0.16}>
            <a
              className="contact-link"
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
            >
              <span className="k">Instagram</span>
              <span className="v">{site.instagram.handle}</span>
              <span className="a" aria-hidden="true">
                ↗
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <p className="contact-note">
            A short brief is all it takes — <span className="it">what you're making</span>, when
            you need it and anything worth referencing. I'll reply with first thoughts on the
            approach.
          </p>
        </Reveal>
      </section>
    </>
  );
}
