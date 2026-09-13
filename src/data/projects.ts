/* ============================================================
   PROJECTS — reusable work data system
   ------------------------------------------------------------
   HOW TO ADD / REPLACE WORK
   1. Drop media into /public/media/  (or host it and paste a URL).
   2. For a video  → { kind: 'video', src: '/media/your-cut.mp4', poster: '...' , ratio: '16 / 9' }
      For an image  → { kind: 'image', src: '/media/your-poster.jpg', ratio: '4 / 5' }
   3. If `src` is empty the site renders an art-directed placeholder
      frame (never a broken grey box) — swap it whenever the real
      asset is ready.
   4. Copy a whole object below to add an entirely new project.
   MEDIA SLOTS — every project below has its file names reserved.
   Drop the real asset at public/media/<name> and it renders
   automatically; until then the art-directed placeholder shows.
   (Videos: .mp4 · Images: .jpg)
   ============================================================ */

export interface Media {
  kind: 'video' | 'image';
  /** Real asset — local path under /public or an absolute URL. */
  src?: string;
  /** Poster frame shown before a video plays. */
  poster?: string;
  /** CSS aspect ratio, e.g. '16 / 9', '4 / 5', '9 / 16', '3 / 2'. */
  ratio: string;
  /** Alt text (accessibility). */
  alt: string;
  /** Optional mono caption shown under the frame. */
  caption?: string;
}

export interface Project {
  /** URL slug — /work/:id */
  id: string;
  /** Editorial number shown in lists. */
  index: string;
  title: string;
  /** 'Video Editing' | 'Graphic Design' */
  category: string;
  /** Drives placeholder treatment (video frames vs printed posters). */
  kind: 'video' | 'design';
  /** One-liner for lists, rows and cards. */
  deck: string;
  /** Fine print tags shown on the case-study header. */
  tags: string[];
  /** Leave undefined when the client is not public. */
  client?: string;
  /** Leave undefined when the year is not set. */
  year?: string;
  /** Your role on the project. */
  role: string;
  /** Software used — leave empty to hide. */
  tools: string[];
  /**
   * Optional editing pipeline, raw → final. Only for projects where
   * the real process is known — leave undefined otherwise. Rendered
   * as a small typographic strip on the case-study page.
   */
  process?: string[];
  /** Case-study body paragraphs (text in [brackets] is template copy to replace). */
  description: string[];
  /** Serif pull-quote on the case-study page (optional). */
  pull?: string;
  /** Featured on the homepage composition. */
  featured: boolean;
  /** Primary frame — used on the homepage, work index and case hero. */
  cover: Media;
  /** Supporting figures on the case-study page. */
  figs: Media[];
}

export const projects: Project[] = [
  {
    id: 'football-challenge-videos',
    index: '01',
    title: 'Football Challenge Videos',
    category: 'Video Editing',
    kind: 'video',
    deck: 'Challenge edits cut for pace — rhythm, sound and energy that make the moment land.',
    tags: ['Pace & rhythm', 'Sound design', 'Short-form'],
    role: 'Editor',
    tools: [],
    process: ['Footage log', 'Cut to the beat', 'Sound design', 'Final delivery'],
    featured: true,
    description: [
      'Football challenge videos are my core video work right now. The format is simple — people doing difficult things with a ball — and the edit’s job is to make each attempt feel inevitable: setup, attempt, reaction, rewatch. Most of the work is pacing, sound and knowing what to leave on the cutting-room floor.',
      '[Project notes — replace with the real brief: platform and format, channel, episode goals, turnaround and what the client cared about most.]',
      'The repeatable part is the system: footage logged for the beat, music cut to the action, sound design that sells the impact. The non-repeatable part is judgement — when to hold a shot a frame longer, when to cut earlier. That judgement is the service.',
    ],
    pull: 'Sound is half the picture. Literally.',
    cover: {
      kind: 'video',
      src: '/media/football-challenge-01-cover.mp4',
      ratio: '16 / 9',
      alt: 'Football challenge video — cover frame',
      caption: 'S.01 — Challenge edit',
    },
    figs: [
      {
        kind: 'video',
        src: '/media/football-challenge-01-timeline.mp4',
        ratio: '4 / 3',
        alt: 'Football challenge video — editing timeline frame',
        caption: 'Cut to the beat — structure pass',
      },
      {
        kind: 'video',
        src: '/media/football-challenge-01-vertical.mp4',
        ratio: '9 / 16',
        alt: 'Football challenge video — vertical frame',
        caption: 'Vertical cut — final delivery',
      },
    ],
  },
  {
    id: 'cinematic-hyrox-vlog',
    index: '02',
    title: 'Cinematic Hyrox Vlog',
    category: 'Video Editing',
    kind: 'video',
    deck: 'A race-day vlog cut like a film — arc, pacing and atmosphere before any gimmick.',
    tags: ['Story arc', 'Music', 'Grade'],
    role: 'Editor',
    tools: [],
    process: ['Story arc', 'Pacing pass', 'Music & grade', 'Final delivery'],
    featured: true,
    description: [
      'A longer-form vlog cut with film instincts — footage from a Hyrox race day shaped into a story with an arc. Where the challenge edits are built to punch, this one breathes: establishing moments, the quiet before the start, a build toward the finish line.',
      '[Project notes — replace with the real brief: whose race, what the video needed to do, runtime and where it lives.]',
      'The edit follows the athlete’s day rather than forcing a template onto it. Restraint is the tool — letting the finish speak without stacking effects on top of it.',
    ],
    pull: 'Let the quiet before the start do its work.',
    cover: {
      kind: 'video',
      src: '/media/cinematic-hyrox-02-cover.mp4',
      ratio: '16 / 9',
      alt: 'Cinematic Hyrox vlog — cover frame',
      caption: 'S.02 — Cinematic vlog',
    },
    figs: [
      {
        kind: 'video',
        src: '/media/cinematic-hyrox-02-widescreen.mp4',
        ratio: '21 / 9',
        alt: 'Cinematic Hyrox vlog — widescreen frame',
        caption: 'Establishing pass — location & atmosphere',
      },
      {
        kind: 'video',
        src: '/media/cinematic-hyrox-02-portrait.mp4',
        ratio: '4 / 5',
        alt: 'Cinematic Hyrox vlog — portrait frame',
        caption: 'The build — mid-race sequence',
      },
    ],
  },
  {
    id: 'small-vlogs',
    index: '03',
    title: 'Small Vlogs',
    category: 'Video Editing',
    kind: 'video',
    deck: 'Compact vlogs with clean structure — quick, watchable and true to the moment.',
    tags: ['Structure', 'Dialogue cuts', 'Sound'],
    role: 'Editor',
    tools: [],
    process: ['Structure pass', 'Dialogue cut', 'Sound cleanup'],
    featured: false,
    description: [
      'Small, honest vlogs — the kinds of edits that disappear behind the person talking. Structure is the star: a clear open, natural pacing, sound cleaned up, nothing showing off.',
      '[Project notes — replace with the real brief: whose channel, cadence of videos, length and style references.]',
      'When the edit is invisible the person becomes more watchable. That is the whole trick, and it is harder than it looks.',
    ],
    cover: {
      kind: 'video',
      src: '/media/small-vlogs-03-cover.mp4',
      ratio: '16 / 9',
      alt: 'Small vlog — cover frame',
      caption: 'S.03 — Vlog edit',
    },
    figs: [
      {
        kind: 'video',
        src: '/media/small-vlogs-03-portrait.mp4',
        ratio: '4 / 5',
        alt: 'Small vlog — portrait frame',
        caption: 'Talking-head pass — clean & tight',
      },
      {
        kind: 'video',
        src: '/media/small-vlogs-03-broll.mp4',
        ratio: '16 / 9',
        alt: 'Small vlog — b-roll frame',
        caption: 'B-roll structure — supporting the story',
      },
    ],
  },
  {
    id: 'sfc-graphic-design',
    index: '04',
    title: 'SFC Graphic Design',
    category: 'Graphic Design',
    kind: 'design',
    deck: 'Restaurant campaign posters — typography, appetite and hierarchy on one surface.',
    tags: ['Poster', 'Campaign', 'Typography'],
    client: 'SFC',
    role: 'Graphic Designer',
    tools: [],
    featured: true,
    description: [
      'Campaign posters for a restaurant — the brief in one sentence: make people hungry before they read a word. Typography carries the tone, the food imagery sells the craving and hierarchy guides the eye from name to dish to detail.',
      '[Project notes — replace with the real brief: the restaurant, the dishes, the campaign and where the posters ran (in-store, social, print).]',
      'Food design is appetite engineering. Type needs taste — the right weight, spacing and restraint so the plate stays the hero.',
    ],
    pull: 'Appetite first, information second.',
    cover: {
      kind: 'image',
      src: '/media/sfc-posters-04-cover.jpg',
      ratio: '4 / 5',
      alt: 'SFC restaurant campaign poster',
      caption: 'D.01 — Campaign poster',
    },
    figs: [
      {
        kind: 'image',
        src: '/media/sfc-posters-04-variant.jpg',
        ratio: '4 / 5',
        alt: 'SFC restaurant poster — secondary frame',
        caption: 'Poster variant — dish-led layout',
      },
      {
        kind: 'image',
        src: '/media/sfc-posters-04-insitu.jpg',
        ratio: '3 / 2',
        alt: 'SFC restaurant poster — in situ on wall',
        caption: 'In-situ — poster on wall',
      },
    ],
  },
  {
    id: 'phonecare-graphic-design',
    index: '05',
    title: 'PhoneCare Graphic Design',
    category: 'Graphic Design',
    kind: 'design',
    deck: 'Product promo posters — structure that sells without shouting.',
    tags: ['Poster', 'Product', 'Layout'],
    client: 'PhoneCare',
    role: 'Graphic Designer',
    tools: [],
    featured: false,
    description: [
      'Promotional posters for a phone-accessories brand — selling clarity. The design work is making a product and its price feel premium without decoration: grid, type scale and one strong visual doing the persuasion.',
      '[Project notes — replace with the real brief: the products, the promotions and where the posters were used.]',
      'Promo design is a promise made visible. If the layout has to explain itself, it is already failing.',
    ],
    cover: {
      kind: 'image',
      src: '/media/phonecare-posters-05-cover.jpg',
      ratio: '4 / 5',
      alt: 'PhoneCare promotional poster',
      caption: 'D.02 — Promo poster',
    },
    figs: [
      {
        kind: 'image',
        src: '/media/phonecare-posters-05-variant.jpg',
        ratio: '4 / 5',
        alt: 'PhoneCare poster — secondary frame',
        caption: 'Poster variant — price-led layout',
      },
      {
        kind: 'image',
        src: '/media/phonecare-posters-05-range.jpg',
        ratio: '3 / 2',
        alt: 'PhoneCare posters — campaign range spread',
        caption: 'Range spread — campaign set',
      },
    ],
  },
  {
    id: 'thumbnail-design',
    index: '06',
    title: 'Thumbnail Design',
    category: 'Graphic Design',
    kind: 'design',
    deck: 'Thumbnails built to earn the click — bold enough to read at postage-stamp size.',
    tags: ['Thumbnail', 'Legibility', 'Small set'],
    role: 'Graphic Designer',
    tools: [],
    featured: false,
    description: [
      'Thumbnails — the smallest poster in the world. Everything is legibility: a face, an action, a handful of words and contrast that survives a 240-pixel glance.',
      'The current set is small and growing as videos ship. No fake examples here — [drop in the real thumbnail frames when they are ready].',
      'Good thumbnails are not designed to be beautiful on their own; they are designed to be unmissable inside a grid of other people’s videos.',
    ],
    cover: {
      kind: 'image',
      src: '/media/thumbnails-06-cover.jpg',
      ratio: '16 / 9',
      alt: 'Thumbnail design — set frame',
      caption: 'D.03 — Thumbnail set',
    },
    figs: [
      {
        kind: 'image',
        src: '/media/thumbnails-06-single.jpg',
        ratio: '16 / 9',
        alt: 'Thumbnail design — single thumbnail',
        caption: 'Single — bold & readable small',
      },
      {
        kind: 'image',
        src: '/media/thumbnails-06-alternative.jpg',
        ratio: '16 / 9',
        alt: 'Thumbnail design — alternative composition',
        caption: 'Alternative — composition study',
      },
    ],
  },
];

/* — selectors — */

export const featuredProjects = projects.filter((p) => p.featured);

export const workByCategory = (cat: string) =>
  projects.filter((p) => p.category === cat);

export const projectById = (id: string) => projects.find((p) => p.id === id);

export const projectIndex = (id: string) =>
  projects.findIndex((p) => p.id === id);

export const nextProject = (id: string) => {
  const i = projectIndex(id);
  return projects[(i + 1) % projects.length];
};

/** True when a project has no real media yet — used to show a hint. */
export const hasRealMedia = (p: Project) =>
  Boolean(p.cover.src) || p.figs.some((f) => f.src);
