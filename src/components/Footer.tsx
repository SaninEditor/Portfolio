import { Link } from 'react-router-dom';
import { site, nav } from '../data/site';
import { scrollTop } from '../lib/scroll';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="ft-main wrap">
        <div className="ft-grid">
          <div className="ft-brand">
            <Link to="/" className="nav-logo" aria-label={`${site.name} — home`}>
              {site.name}
              <span className="slash">/</span>
              <span className="tag">{site.descriptor}</span>
            </Link>
            <p className="lead">{site.footerNote}</p>
          </div>

          <div>
            <p className="ft-h">Index</p>
            <nav className="ft-nav" aria-label="Footer">
              {nav.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="ft-h">Elsewhere</p>
            <nav className="ft-nav" aria-label="Social">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.instagram.url} target="_blank" rel="noreferrer">
                Instagram — {site.instagram.handle}
              </a>
            </nav>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="ft-bottom">
          <span>
            © {year} {site.name}
          </span>
          <span>Video editing · Graphic design · Motion</span>
          <button className="ft-toplink" onClick={() => scrollTop()} aria-label="Back to top">
            Top
            <span className="up" aria-hidden="true">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
