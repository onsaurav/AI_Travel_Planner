/** The one next action a tour desk should take on this Trip (REQ-TRV-112). */
export function deskNextJob(status: 'Draft' | 'Planned'): string {
  return status === 'Draft'
    ? 'Next: generate a day-by-day Plan for this Trip.'
    : 'Next: adjust the itinerary in Chat, or print it for the Traveler.';
}
