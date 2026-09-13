/* ============================================================
   SITE — global profile / contact settings
   ------------------------------------------------------------
   ⚠ PLACEHOLDER CONTENT — replace every value below with your
   real name, brand, email and links before going live.
   This is the only file you need to touch for identity/contact.
   ============================================================ */

export const site = {
  /** Wordmark shown in the header & footer. Use your name or studio name. */
  name: 'CUT/FORM',

  /** Short descriptor under the wordmark / in meta tags. */
  descriptor: 'Video · Design',

  role: 'Video Editor + Graphic Designer',

  /** One-line positioning used in <title> and hero meta. */
  positioning: 'Video editing & graphic design for creators, brands and businesses.',

  /**
   * Contact email. 'example.com' is the RFC-reserved placeholder
   * domain — swap for your real address (e.g. hello@yourname.com).
   */
  email: 'hello@example.com',

  instagram: {
    /** Public label, e.g. '@yourname' */
    handle: '@yourhandle',
    /** Profile URL */
    url: 'https://www.instagram.com/',
  },

  /**
   * Showreel video — the hero's opening shot. Drop a file at
   * `public/media/showreel.mp4` (H.264 MP4 recommended) and it
   * plays in the hero frame automatically. While the file is
   * absent, the hero falls back to its placeholder frame.
   * Optional: set poster to an image at `public/media/showreel.jpg`.
   */
  showreel: {
    src: '/media/showreel.mp4',
    poster: '/media/showreel.jpg',
  },

  /** Footer line. */
  footerNote:
    'Independent creative practice — video editing and graphic design, cut and composed in one place.',

  /** Comma list used by the header <title>. */
  title: (page?: string) =>
    page
      ? `${page} — ${site.name}`
      : `${site.name} — Video Editor + Graphic Designer`,
} as const;

export const nav = [
  { to: '/work', label: 'Works' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
] as const;
