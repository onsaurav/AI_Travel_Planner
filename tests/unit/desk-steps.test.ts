import { describe, expect, test } from 'vitest';
import { DESK_STEPS, deskStepState } from '../../src/web/pages/desk-steps';

describe('the four desk steps on a Trip', () => {
  // @covers REQ-TRV-118@v1
  test('are Trip, Itinerary, Adjust and Hand over', () => {
    expect(DESK_STEPS.map((step) => step.label)).toEqual([
      'Trip',
      'Itinerary',
      'Adjust',
      'Hand over',
    ]);
  });

  // @covers REQ-TRV-118@v1
  test('put a Draft Trip on Itinerary, and a Planned Trip on Adjust', () => {
    expect(deskStepState('Draft', 'itinerary')).toBe('current');
    expect(deskStepState('Draft', 'adjust')).toBe('todo');
    expect(deskStepState('Planned', 'itinerary')).toBe('done');
    expect(deskStepState('Planned', 'adjust')).toBe('current');
  });
});
