import { createElement } from 'react';
import { describe, expect, test } from 'vitest';
import { searchSummary } from '../../src/web/components/search-summary';
import { SearchPanel } from '../../src/web/components/SearchPanel';
import { TripCards } from '../../src/web/components/TripCards';
import { TripFilters } from '../../src/web/components/TripFilters';
import {
  EMPTY_FEEDBACK_FORM,
  feedbackFilterCount,
} from '../../src/web/pages/admin/admin-view-state';
import { activeFilterCount, EMPTY_FILTER_FORM } from '../../src/web/pages/trip-list-state';
import { A_TRIP, markupOf, shownIn } from '../support/out-of-scope';

const tripFilters = markupOf(
  createElement(TripFilters, {
    form: EMPTY_FILTER_FORM,
    searchText: '',
    options: { countries: ['Japan'], destinations: [] },
    onSearchText: () => undefined,
    onChange: () => undefined,
    onClear: () => undefined,
  }),
);

describe('a search panel, which can be hidden', () => {
  // @covers REQ-TRV-119@v1
  test('opens with the Trips search and every filter showing', () => {
    expect(tripFilters).not.toMatch(/class="search-panel-body"[^>]*hidden/);
    expect(tripFilters).toContain('aria-expanded="true"');
    expect(shownIn(tripFilters)).toContain('Hide');
  });

  test('keeps its name as a search landmark and puts its buttons under the fields', () => {
    const markup = markupOf(
      createElement(SearchPanel, {
        label: 'Find Destinations',
        title: 'Find a Destination',
        summary: '“Kyoto”',
        onSubmit: () => undefined,
        actions: createElement('button', { type: 'submit' }, 'Search'),
        children: createElement('input', { 'aria-label': 'Search Destinations' }),
      }),
    );

    expect(markup).toContain('role="search"');
    expect(markup).toContain('aria-label="Find Destinations"');
    expect(shownIn(markup)).toContain('“Kyoto”');
    expect(markup).toMatch(/search-panel-actions"><button type="submit">Search<\/button>/);
  });
});

describe('what a search panel says is in use', () => {
  test.each([
    ['', 0, null],
    ['Tokyo', 0, '“Tokyo”'],
    ['', 1, '1 filter in use'],
    ['  Tokyo ', 3, '“Tokyo” · 3 filters in use'],
  ])('says %j with %i filters as %j', (query, count, summary) => {
    expect(searchSummary(query, count)).toBe(summary);
  });

  test('counts the Trip filters in use, not the search', () => {
    const form = { ...EMPTY_FILTER_FORM, search: 'Tokyo', country: 'Japan', maxDays: '10' };

    expect(activeFilterCount(form)).toBe(2);
  });

  test('counts the feedback filters in use, not the keyword or the sort', () => {
    const form = {
      ...EMPTY_FEEDBACK_FORM,
      keyword: 'late',
      rating: '2',
      from: '2026-01-01',
      sort: 'rating',
      order: 'asc',
    };

    expect(feedbackFilterCount(form)).toBe(2);
  });
});

describe('Your Trips as cards', () => {
  const cards = markupOf(createElement(TripCards, { trips: [A_TRIP] }));

  // @covers REQ-TRV-106@v1
  test('show each Trip as its own block with its name as a link, Destination, dates and status', () => {
    expect(cards).toContain('<article');
    expect(cards).toContain(`href="/trips/${A_TRIP.id}"`);
    expect(shownIn(cards)).toContain(A_TRIP.name);
    expect(shownIn(cards)).toContain('Kyoto, Japan');
    expect(shownIn(cards)).toContain('2026-10-10 to 2026-10-17');
    expect(shownIn(cards)).toContain('Planned');
  });

  // @covers REQ-TRV-120@v1
  test('name the next desk job on each card', () => {
    expect(shownIn(cards)).toContain('Adjust');
  });
});
