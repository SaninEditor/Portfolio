import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/Reveal';

export default function NotFoundPage() {
  return (
    <>
      <Seo page="404" />
      <div className="notfound wrap">
        <p className="label" style={{ marginBottom: 'var(--sp-5)' }}>
          Error 404 — dead frame
        </p>
        <Reveal>
          <p className="code">404</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p>
            This page was cut from the final edit. Head back to the start — the good stuff is on
            the work page.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Link to="/" className="btn">
            <span className="btn-fill" aria-hidden="true" />
            Back home
          </Link>
        </Reveal>
      </div>
    </>
  );
}
