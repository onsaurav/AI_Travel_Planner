export const DESK_STEPS = [
  { id: 'trip', label: 'Trip', does: 'Name, Destination and dates' },
  { id: 'itinerary', label: 'Itinerary', does: 'Generate the day-by-day Plan' },
  { id: 'adjust', label: 'Adjust', does: 'Chat to change a Day' },
  { id: 'handover', label: 'Hand over', does: 'Print or share with the Traveler' },
] as const;

export type DeskStepId = (typeof DESK_STEPS)[number]['id'];
export type DeskStepState = 'done' | 'current' | 'todo';

/** Where a tour desk is on this Trip: Trip is always done once the page is open. */
export function deskStepState(status: 'Draft' | 'Planned', id: DeskStepId): DeskStepState {
  if (id === 'trip') return 'done';
  if (id === 'itinerary') return status === 'Draft' ? 'current' : 'done';
  if (id === 'adjust') return status === 'Draft' ? 'todo' : 'current';
  return 'todo';
}
