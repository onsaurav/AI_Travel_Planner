import { describe, expect, test } from 'vitest';
import { deskNextJob } from '../../src/web/pages/desk-job';

describe('the next desk job on a Trip', () => {
  // @covers REQ-TRV-112@v1
  test('tells a Draft Trip to generate a day-by-day Plan', () => {
    expect(deskNextJob('Draft')).toBe('Next: generate a day-by-day Plan for this Trip.');
  });

  // @covers REQ-TRV-112@v1
  test('tells a Planned Trip to adjust the itinerary or print it', () => {
    expect(deskNextJob('Planned')).toBe(
      'Next: adjust the itinerary in Chat, or print it for the Traveler.',
    );
  });
});
