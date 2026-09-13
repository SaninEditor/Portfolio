import { projectById } from '../data/projects';
import { principles } from '../data/services';
import { Seo } from '../components/Seo';
import { MediaCard } from '../components/MediaCard';
import { Reveal, Masked, MediaReveal } from '../components/Reveal';

const FRAGMENTS = ['sfc-graphic-design', 'thumbnail-design'];

export default function AboutPage() {
  const frags = FRAGMENTS.map((id) => projectById(id)).filter(Boolean);

  return (
    <>
      <Seo page="About" />

      <header className="mast wrap">
        <p className="label kicker">( 02 ) — About</p>
        <h1>
          <Masked>One practice,</Masked>
          <br />
          <Masked>
            <span className="it">two disciplines.</span>
          </Masked>
        </h1>
        <Reveal delay={0.12}>
          <p className="sub">
            Video editing and graphic design feed each other: an edit is timing, a poster is
            spacing, and both are decisions about where the eye goes — and when.
          </p>
        </Reveal>
      </header>

      {/* Statement + visual fragments */}
      <section className="wrap">
        <div className="ab-lock">
          <div className="main">
            <Reveal>
              <p>
                I work across <strong>video editing</strong> and <strong>graphic design</strong>{' '}
                because the thinking is the same in both. Cutting a scene and laying out a poster
                are both acts of editing: choosing what stays, what goes and what the audience
                feels first.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                Right now that means <span className="it">football challenge edits</span> and{' '}
                <span className="it">vlogs</span> on one side, and{' '}
                <span className="it">restaurant and product campaigns</span> on the other — with
                motion design growing in as a third capability.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p>
                I care about the details people feel but don't always see: pacing, sound,
                typography, composition and silence. Most of the craft is restraint — knowing what
                not to add.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <p>
                No invented credentials on this site. When there's a number or a client to show,
                it's real, and when the portfolio is still filling up, it says so.
              </p>
            </Reveal>
          </div>

          <div className="side">
            {frags.map((p, i) =>
              p ? (
                <MediaReveal key={p.id} delay={0.1 + i * 0.12} className="fr">
                  <MediaCard project={p} label="Fragment" />
                </MediaReveal>
              ) : null
            )}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section section--tight" style={{ background: 'var(--bg-2)' }}>
        <div className="wrap">
          <div className="sec-head">
            <p className="label idx">
              <span className="n">( A )</span> — Principles
            </p>
            <p className="note">How the work gets made.</p>
          </div>

          <Reveal>
            <div className="principles">
              {principles.map((pr) => (
                <div className="pr-row" key={pr.index}>
                  <span className="pr-idx">{pr.index}</span>
                  <h3>{pr.title}</h3>
                  <p>{pr.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Current focus */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="sec-head">
            <p className="label idx">
              <span className="n">( B )</span> — Right Now
            </p>
            <p className="note">Where the effort actually goes.</p>
          </div>

          <Reveal>
            <div className="now-list">
              <div className="now-item">
                <span className="what">Football challenge videos — regular edits</span>
                <span className="kind">Video</span>
              </div>
              <div className="now-item">
                <span className="what">Cinematic &amp; small vlogs</span>
                <span className="kind">Video</span>
              </div>
              <div className="now-item">
                <span className="what">Restaurant &amp; product campaigns — SFC, PhoneCare</span>
                <span className="kind">Design</span>
              </div>
              <div className="now-item">
                <span className="what">Motion samples — building the reel</span>
                <span className="kind">Service</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
