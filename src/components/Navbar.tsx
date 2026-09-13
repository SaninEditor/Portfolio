import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { site, nav } from '../data/site';
import { getLenis, scrollTop } from '../lib/scroll';
import { EASE, DUR, stagger } from '../lib/anim';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu on navigation + return to top when tapping the logo.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link
            className="nav-logo"
            to="/"
            aria-label={`${site.name} — home`}
            onClick={() => {
              if (location.pathname === '/') scrollTop(true);
            }}
          >
            {site.name}
            <span className="slash">/</span>
            <span className="tag">{site.descriptor}</span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn nav-cta" onClick={() => scrollTop(true)}>
              <span className="btn-fill" aria-hidden="true" />
              Let's work
            </Link>
          </nav>

          <button
            className="burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: DUR.fast, ease: EASE }}
          >
            <nav aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DUR.mid, ease: EASE, delay: 0.06 + stagger(i, 0.055) }}
                >
                  <Link className="mm-link" to={item.to}>
                    <span className="n">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mm-foot">
              <Link className="label" to="/contact" style={{ color: 'var(--ink-2)' }}>
                {site.email}
              </Link>
              <a className="label" href={site.instagram.url} target="_blank" rel="noreferrer">
                {site.instagram.handle}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
