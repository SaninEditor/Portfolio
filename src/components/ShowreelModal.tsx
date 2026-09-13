import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { site } from '../data/site';
import { getLenis } from '../lib/scroll';
import { EASE_SOFT } from '../lib/anim';
import { useMotionPreference } from '../hooks/useMotionPreference';

interface ShowreelModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * FULL-SCREEN SHOWREEL — the cinema opens.
 * A dedicated overlay screening of the showreel reel, with sound.
 * Sharp-edged, letterboxed chrome matching the site's mono-label system.
 * ESC / backdrop / CLOSE all exit; page scroll is locked while open.
 */
export function ShowreelModal({ open, onClose }: ShowreelModalProps) {
  const reduced = useMotionPreference();
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock page scroll (Lenis + native) while the screening is on.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open]);

  // Focus the close control on open; ESC and focus return on close.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  // The click on PLAY counts as a user gesture, so sound is allowed.
  // If the browser still refuses, retry muted so the reel plays regardless.
  const startPlayback = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => undefined);
    });
  };

  return createPortal(
    <motion.div
      className="sr"
      role="dialog"
      aria-modal="true"
      aria-label={`${site.name} showreel`}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE_SOFT }}
    >
      <div className="sr-backdrop" onClick={onClose} aria-hidden="true" />

      <motion.div
        className="sr-stage"
        initial={reduced ? false : { opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.6, ease: EASE_SOFT, delay: reduced ? 0 : 0.08 }}
        onAnimationComplete={startPlayback}
      >
        <div className="sr-top">
          <span className="label">
            <span className="rec-dot" aria-hidden="true" /> {site.name} — Showreel
          </span>
          <span className="label label--dim">Selected cuts</span>
          <button ref={closeRef} className="sr-close label" onClick={onClose}>
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="sr-frame">
          <video
            ref={videoRef}
            src={site.showreel.src}
            poster={site.showreel.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={`${site.name} showreel — selected cuts`}
          />
        </div>

        <div className="sr-foot label label--dim">
          <span>{site.role}</span>
          <span>Sound on</span>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
