import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';

export default function HomeAbout() {
  return (
    <section className="section" id="about" data-tint="lift">
      <div className="wrap">
        <div className="sec-head">
          <p className="label idx">
            <span className="n">( 04 )</span> — About
          </p>
          <p className="note">No bio theatre — just how I work.</p>
        </div>

        <div className="ab-wrap">
          <div className="ab-quote">
            <Reveal>
              <p>
                “Editing is writing with time.
                <br />
                Design is writing with space.”
              </p>
              <span className="who">— The practice</span>
            </Reveal>
          </div>

          <div className="ab-copy">
            <Reveal delay={0.1}>
              <p>
                I'm a freelance <strong>video editor</strong> and <strong>graphic designer</strong> —
                one practice, two disciplines. I work with creators, brands and businesses that want
                their content to look considered, not just produced.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p>
                I care about the details people feel but don't always see: pacing, sound,
                typography, composition, and knowing when to leave something out. Most of the
                craft is restraint.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <p className="more">
                <Link to="/about" className="link-action">
                  More about the practice
                  <span className="arr" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
