type Tone = 'ok' | 'neutral' | 'warn' | 'danger' | 'accent';

/** The colour each known status reads in. The word is always shown, so a status is never told by colour alone. */
const TONES: Readonly<Record<string, Tone>> = {
  Planned: 'ok',
  Draft: 'warn',
  Enabled: 'ok',
  Disabled: 'danger',
  Administrator: 'accent',
  Traveler: 'neutral',
  succeeded: 'ok',
  pending: 'warn',
  failed: 'danger',
};

/** A status, such as Draft or Planned, shown as a label. */
export function StatusBadge({ label }: { readonly label: string }) {
  return <span className={`badge badge-${TONES[label] ?? 'neutral'}`}>{label}</span>;
}
