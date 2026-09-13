/**
 * VIEWPORT-BOTTOM BLUR VEIL — a frosted shade fixed to the bottom
 * edge of the screen (not the page). Content scrolling beneath it
 * dissolves into a soft focus falloff, like a lens breathing at
 * the frame's lower edge. Purely decorative.
 */
export default function BottomVeil() {
  return <div className="bottom-veil" aria-hidden="true" />;
}
