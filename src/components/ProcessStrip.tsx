import { FadeIn } from './Reveal';

/**
 * Small editorial pipeline strip — RAW → … → FINAL.
 * Rendered only when a project declares its real process in data.
 * Typographic, no cards, no fake stats.
 */
export function ProcessStrip({ steps }: { steps: string[] }) {
  return (
    <FadeIn className="proc-strip">
      <span className="ps-lab">Raw → Final</span>
      <ol className="ps-steps">
        {steps.map((s, i) => (
          <li key={i} className="ps-step">
            <span className="ps-name">{s}</span>
            {i < steps.length - 1 && (
              <span className="ps-arrow" aria-hidden="true">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </FadeIn>
  );
}
