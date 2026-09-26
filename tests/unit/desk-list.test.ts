import { createElement } from 'react';
import { describe, expect, test } from 'vitest';
import { TripFilters } from '../../src/web/components/TripFilters';
import { TripTable } from '../../src/web/components/TripTable';
import { deskListNext } from '../../src/web/pages/desk-list-next';
import { EMPTY_FILTER_FORM } from '../../src/web/pages/trip-list-state';
import { A_TRIP, markupOf, shownIn } from '../support/out-of-scope';

const FILTER_LABELS = [
  'Country',
  'Destination',
  'Travel style',
  'Currency',
  'Minimum budget',
  'Maximum budget',
  'Minimum Days',
  'Maximum Days',
] as const;

const filters = markupOf(
  createElement(TripFilters, {
    form: EMPTY_FILTER_FORM,
    searchText: '',
    options: {
      countries: ['Japan'],
      destinations: [{ id: 'destination-1', label: 'Kyoto, Japan' }],
    },
    onSearchText: () => undefined,
    onChange: () => undefined,
    onClear: () => undefined,
  }),
);

describe('Your Trips as a desk list', () => {
  // @covers REQ-TRV-119@v1
  test('keeps Search and filter Trips, Search Trips, and a Filters group with every filter', () => {
    expect(filters).toContain('role="search"');
    expect(filters).toContain('aria-label="Search and filter Trips"');
    expect(shownIn(filters)).toContain('Search Trips');
    expect(filters).toContain('role="group"');
    expect(filters).toContain('aria-label="Filters"');
    expect(filters).not.toContain('<fieldset');
    for (const label of FILTER_LABELS) {
      expect(shownIn(filters)).toContain(label);
    }
  });

  // @covers REQ-TRV-119@v1
  test('lists a Trip in a table', () => {
    const markup = markupOf(createElement(TripTable, { trips: [A_TRIP] }));

    expect(markup).toContain('<table');
    expect(shownIn(markup)).toContain('Kyoto Family Holiday');
  });

  // @covers REQ-TRV-120@v1
  test('names Generate Plan on a Draft Trip and Adjust on a Planned Trip', () => {
    expect(deskListNext('Draft')).toBe('Generate Plan');
    expect(deskListNext('Planned')).toBe('Adjust');

    const draft = markupOf(createElement(TripTable, { trips: [{ ...A_TRIP, status: 'Draft' }] }));
    const planned = markupOf(createElement(TripTable, { trips: [A_TRIP] }));

    expect(shownIn(draft)).toContain('Generate Plan');
    expect(shownIn(planned)).toContain('Adjust');
  });
});
