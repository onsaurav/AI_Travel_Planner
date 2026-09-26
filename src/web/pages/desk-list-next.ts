/** The next desk job shown on a Your Trips row (REQ-TRV-120). */
export function deskListNext(status: 'Draft' | 'Planned'): string {
  return status === 'Draft' ? 'Generate Plan' : 'Adjust';
}
