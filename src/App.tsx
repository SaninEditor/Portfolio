import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import AmbientGradients from './components/AmbientGradients';
import BottomVeil from './components/BottomVeil';
import SmoothScroll from './components/SmoothScroll';
import FinalCta from './sections/FinalCta';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import ProjectPage from './pages/ProjectPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import { scrollToId, scrollTop } from './lib/scroll';
import { PAGE } from './lib/anim';
import { motionOverrideActive } from './lib/motionOverride';

/** Page transition shell + scroll management per route. */
function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { pathname, hash } = location;

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const t = setTimeout(() => scrollToId(id), 80);
      return () => clearTimeout(t);
    }
    scrollTop(true);
  }, [pathname, hash]);

  return (
    <motion.main
      id="main"
      initial={PAGE.enter}
      animate={PAGE.enterTo}
      exit={PAGE.exit}
      transition={PAGE.transition}
    >
      {children}
    </motion.main>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Shell>
              <HomePage />
            </Shell>
          }
        />
        <Route
          path="/work"
          element={
            <Shell>
              <WorkPage />
            </Shell>
          }
        />
        <Route
          path="/work/:id"
          element={
            <Shell>
              <ProjectPage />
            </Shell>
          }
        />
        <Route
          path="/services"
          element={
            <Shell>
              <ServicesPage />
            </Shell>
          }
        />
        <Route
          path="/about"
          element={
            <Shell>
              <AboutPage />
            </Shell>
          }
        />
        <Route
          path="/contact"
          element={
            <Shell>
              <ContactPage />
            </Shell>
          }
        />
        <Route
          path="*"
          element={
            <Shell>
              <NotFoundPage />
            </Shell>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const location = useLocation();
  const forceMotion = motionOverrideActive();
  // Mirror the dev motion-override onto <html> so the reduced-motion
  // CSS collapses are bypassed while authoring (the preview webview
  // forces prefers-reduced-motion at the OS level). Opt out with
  // ?motion=off; production always respects the user's real setting.
  useEffect(() => {
    document.documentElement.classList.toggle('motion-forced', forceMotion);
    return () => document.documentElement.classList.remove('motion-forced');
  }, [forceMotion]);
  const { pathname } = location;
  const showCta =
    pathname === '/' ||
    pathname === '/work' ||
    pathname === '/services' ||
    pathname === '/about' ||
    (pathname.startsWith('/work/') && pathname !== '/work');

  return (
    <MotionConfig reducedMotion={forceMotion ? 'never' : 'user'}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <AmbientGradients />
      <BottomVeil />
      <Cursor />
      <Navbar />
      <AnimatedRoutes />
      {showCta && <FinalCta />}
      <Footer />
    </MotionConfig>
  );
}
