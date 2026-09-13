# CUT/FORM — Video Editor + Graphic Designer portfolio

A dark, cinematic, editorial portfolio for a freelance **Video Editor + Graphic Designer**.
Built from scratch with React + TypeScript + Vite. Monochrome by design — the work is the color.

```
React 19 · TypeScript · Vite · react-router · Motion (Framer) · Lenis
```

## Quickstart

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build → dist/
npm run preview  # serve the production build locally
```

## Making it yours — replace the placeholders

Everything personal lives in ONE file:

**`src/data/site.ts`** — studio name/wordmark, email, Instagram, footer note.

```ts
name: 'CUT/FORM',            // ← your name or studio name
email: 'hello@example.com',  // ← your real email
instagram: { handle: '@yourhandle', url: 'https://www.instagram.com/' },
```

Then **`index.html`** for the static `<title>`, meta description and Open Graph tags.

## Adding real work (media system)

1. Put files in **`public/media/`** (or host them and paste absolute URLs).
2. Open **`src/data/projects.ts`** — it is the single source of truth.
3. Point any `Media` object at your asset:

```ts
cover: {
  kind: 'video',              // 'video' | 'image'
  src: '/media/football-edit.mp4',
  poster: '/media/football-edit-poster.jpg',
  ratio: '16 / 9',           // CSS aspect ratio
  alt: 'Football challenge edit — cover',
},
```

That's it. Frames without a `src` render **art-directed placeholder posters**
(never broken grey boxes), and the in-page "media note" disappears automatically
once a real asset is set. Case-study body copy in `[square brackets]` is template
text waiting for the real brief — replace it when you write the project up.

Adding a whole new project = copy one object in `projects.ts`, change the `id`.
Pages, listings, archive grouping and next-project navigation all follow the data.

## Content honesty

No invented clients, awards, stats or testimonials exist anywhere in the code.
Motion Graphics is listed as a **service only** (no fake reel) — the site says so out loud.

## Structure

```
src/
  data/        site identity, projects, services & process copy
  components/  navbar, footer, cursor, smooth-scroll, media frames, rows…
  sections/    homepage sections + final CTA
  pages/       Home, Work, case study, Services, About, Contact, 404
  hooks/       reduced-motion / fine-pointer detection
  lib/         animation constants, Lenis helpers
  styles/      tokens → base → layout → components → sections → pages
public/        favicon, robots, /media/ (your files)
```

### Design system
- **Type:** Geist (sans) + Instrument Serif (editorial accents) + Geist Mono (metadata).
- **Color:** strictly monochrome black / off-white / greys (`src/styles/tokens.css`).
- **Motion:** every animation value lives in `src/lib/anim.ts` — the single
  source of truth. It defines the two easing curves (`EASE`, `EASE_SOFT`), the
  duration scale (`DUR`), stagger timing (`STAGGER` / `stagger()`), reveal
  distances (`REVEAL_Y`), media clip insets (`CLIP_MEDIA`), viewport thresholds
  (`viewport`, `mediaViewport`), parallax springs (`SPRING`), smooth-scroll feel
  (`SCROLL`), page-transition timing (`PAGE`) and the hero opening sequence
  (`HERO_SEQ`), plus ready-made transitions (`fadeUp`, `lineUp`, `maskUp`,
  `mediaSettle`, `pageTransition`).
- **Reusable primitives** in `src/components/Reveal.tsx`: `Reveal` (fade/rise),
  `Masked` (masked line reveal for display type), `FadeIn`, `MediaReveal`
  (clip + scale + blur "cut" entrance, scroll- or mount-triggered) and
  `Parallax` (spring-smoothed, transform-only drift).
- **Smooth scroll:** Lenis, tuned in `SCROLL` — weighted cubic ease-out,
  native momentum preserved on touch, anchor glides via `scrollToId`.
  Motion's `useScroll` reads the same window position, so scroll-driven
  animation stays in sync (one driver, no competing rAF loops).
- **Reduced motion:** `SmoothScroll`, `Cursor`, `Reveal`, `Masked`, `FadeIn`,
  `MediaReveal`, `Parallax` and the Hero sequence all check
  `prefers-reduced-motion` and render settled/visible states — content is
  never hidden behind animation.
- **Media:** lazy images, `preload="metadata"` videos, no multi-video autoplay stacks.

## Deploying

Clean URLs require SPA history fallback — on Vercel/Netlify this is automatic; on
static hosts add a rewrite of all paths to `index.html`. Then update the meta tags,
favicon (`public/favicon.svg`) and consider a real `og:image`.
