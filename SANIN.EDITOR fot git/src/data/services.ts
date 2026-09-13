/* ============================================================
   SERVICES + PROCESS
   Honest capabilities list — no invented work or metrics.
   ============================================================ */

export interface Service {
  id: string;
  index: string;
  title: string;
  /** Small pill — signals depth honestly. */
  tag: string;
  /** One sentence, used in the teaser rows. */
  deck: string;
  /** Serif statement, services page. */
  statement: string;
  /** Craft descriptors (not claims about past work). */
  includes: string[];
  /** Filter key used to list related projects. */
  related: string;
  /** Honest footnote shown when relevant. */
  honest?: string;
}

export const services: Service[] = [
  {
    id: 'video-editing',
    index: '01',
    title: 'Video Editing',
    tag: 'Core',
    deck: 'The main thing I do — footage in, story out.',
    statement:
      'I cut raw footage into stories that hold attention — respecting rhythm, pacing and the audience’s time.',
    includes: [
      'Story & structure',
      'Pacing & rhythm',
      'Sound & music',
      'Colour & finish',
      'Captions & simple graphics',
    ],
    related: 'Video Editing',
  },
  {
    id: 'graphic-design',
    index: '02',
    title: 'Graphic Design',
    tag: 'Core',
    deck: 'Posters, campaigns and brand visuals.',
    statement:
      'Images and layouts built with typography, hierarchy and intent — from campaign posters to social creatives.',
    includes: [
      'Campaign & poster design',
      'Social & promo visuals',
      'Brand visual consistency',
      'Print & digital delivery',
    ],
    related: 'Graphic Design',
  },
  {
    id: 'motion-graphics',
    index: '03',
    title: 'Motion Graphics',
    tag: 'Service',
    deck: 'Available now — real motion work is in progress.',
    statement:
      'Motion design as an added layer on top of the edit — kinetic type, titles and animated graphics that lift the cut.',
    includes: [
      'Kinetic typography',
      'Titles & lower thirds',
      'Animated social graphics',
    ],
    related: '',
    honest:
      'Motion is offered as a service today, but I won’t pad the portfolio with invented work — the motion section fills up with real samples as they ship. Happy to share current experiments on request.',
  },
];

export interface ProcessStep {
  index: string;
  title: string;
  note: string;
}

export const process: ProcessStep[] = [
  { index: '01', title: 'Brief', note: 'What you need, who it is for, where it lives.' },
  { index: '02', title: 'Direction', note: 'References, tone and the creative angle.' },
  { index: '03', title: 'Edit / Design', note: 'Cutting, composing, sound and type — the making.' },
  { index: '04', title: 'Refinement', note: 'Details, tweaks and versions until it is right.' },
  { index: '05', title: 'Delivery', note: 'Final files where you need them.' },
];

export const principles = [
  { index: '01', title: 'Less, but better', note: 'Every frame and every element has to earn its place.' },
  { index: '02', title: 'Sound is half the picture', note: 'Edits are felt as much as they are seen.' },
  { index: '03', title: 'Rhythm before effects', note: 'Pace and structure first, polish after.' },
  { index: '04', title: 'Respect the audience', note: 'If it bores me to cut, it will bore them to watch.' },
  { index: '05', title: 'Details are the difference', note: 'Composition, spacing and one consistent typeface.' },
];
