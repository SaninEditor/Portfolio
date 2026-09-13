# Media — drop your real assets here

Every slot below is already wired into the site. Drop a file with the
exact name and it appears automatically (no code changes needed).
Until a file exists, its frame shows the art-directed placeholder.

## Showreel (hero frame)

- `showreel.mp4` — plays in the hero on load (muted, looping) and in the
  full-screen "Play reel" modal (with sound). H.264 MP4, 16:9 recommended.
- `showreel.jpg` (optional) — poster frame.

## Project slots

### 01 — Football Challenge Videos (video)
- `football-challenge-01-cover.mp4` — 16:9 cover
- `football-challenge-01-timeline.mp4` — 4:3 editing-timeline figure
- `football-challenge-01-vertical.mp4` — 9:16 vertical delivery figure

### 02 — Cinematic Hyrox Vlog (video)
- `cinematic-hyrox-02-cover.mp4` — 16:9 cover
- `cinematic-hyrox-02-widescreen.mp4` — 21:9 establishing figure
- `cinematic-hyrox-02-portrait.mp4` — 4:5 mid-race figure

### 03 — Small Vlogs (video)
- `small-vlogs-03-cover.mp4` — 16:9 cover
- `small-vlogs-03-portrait.mp4` — 4:5 talking-head figure
- `small-vlogs-03-broll.mp4` — 16:9 b-roll figure

### 04 — SFC Graphic Design (image)
- `sfc-posters-04-cover.jpg` — 4:5 campaign poster
- `sfc-posters-04-variant.jpg` — 4:5 dish-led variant
- `sfc-posters-04-insitu.jpg` — 3:2 poster on wall

### 05 — PhoneCare Graphic Design (image)
- `phonecare-posters-05-cover.jpg` — 4:5 promo poster
- `phonecare-posters-05-variant.jpg` — 4:5 price-led variant
- `phonecare-posters-05-range.jpg` — 3:2 campaign range spread

### 06 — Thumbnail Design (image)
- `thumbnails-06-cover.jpg` — 16:9 thumbnail set
- `thumbnails-06-single.jpg` — 16:9 single thumbnail
- `thumbnails-06-alternative.jpg` — 16:9 composition study

## Tips

- Videos: keep covers short (6–15 s), H.264 MP4, no audio track needed
  (they play muted + looped).
- Images: JPG/WebP, reasonably compressed (posters ~1200–1600px on the
  long edge is plenty).
- Names must match exactly — they're wired in `src/data/projects.ts`.
