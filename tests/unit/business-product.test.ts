import { createElement } from 'react';
import { describe, expect, test } from 'vitest';
import { ADMIN_FUNCTIONS } from '../../src/shared/admin-functions';
import { PLAN_RECOMMENDATION_NOTICE } from '../../src/shared/plan-notice';
import { LoginPage } from '../../src/web/pages/LoginPage';
import { RegisterPage } from '../../src/web/pages/RegisterPage';
import { AdminDashboardPage } from '../../src/web/pages/admin/AdminDashboardPage';
import { PlanDisplay } from '../../src/web/components/PlanDisplay';
import { TripTable } from '../../src/web/components/TripTable';
import { MAP } from '../support/out-of-scope-words';
import { A_FULL_PLAN, A_TRIP, NO_ACTIONS, markupOf, shownIn } from '../support/out-of-scope';

describe('the business product screens', () => {
  // @covers REQ-TRV-106@v1
  test('list a Trip as its own block with name, Destination, dates and status', () => {
    const markup = markupOf(createElement(TripTable, { trips: [A_TRIP] }));

    expect(markup).toContain('<article');
    expect(shownIn(markup)).toContain('Kyoto Family Holiday');
    expect(shownIn(markup)).toContain('Kyoto, Japan');
    expect(shownIn(markup)).toContain('2026-10-10 to 2026-10-17');
    expect(shownIn(markup)).toContain('Planned');
    expect(markup).not.toContain('<table');
  });

  // @covers REQ-TRV-107@v1
  test('show each Day in its own region, with the recommendation notice above the Days', () => {
    const markup = markupOf(createElement(PlanDisplay, { plan: A_FULL_PLAN, actions: NO_ACTIONS }));
    const dayOne = markup.indexOf('aria-label="Day 1, 2026-10-10"');
    const dayTwo = markup.indexOf('aria-label="Day 2, 2026-10-11"');
    const notice = markup.indexOf(PLAN_RECOMMENDATION_NOTICE);

    expect(dayOne).toBeGreaterThan(-1);
    expect(dayTwo).toBeGreaterThan(-1);
    expect(notice).toBeGreaterThan(-1);
    expect(notice).toBeLessThan(dayOne);
    expect(shownIn(markup)).toContain('Plan A morning 1');
  });

  // @covers REQ-TRV-108@v1
  test('name each admin function on the Administrator home', () => {
    const markup = markupOf(createElement(AdminDashboardPage));

    expect(shownIn(markup)).toContain('Admin dashboard');
    for (const adminFunction of ADMIN_FUNCTIONS) {
      expect(shownIn(markup)).toContain(adminFunction.label);
      expect(markup).toContain(`href="${adminFunction.path}"`);
    }
  });

  // @covers REQ-TRV-109@v1
  test('show AI Travel Planner on log in and registration', () => {
    expect(shownIn(markupOf(createElement(LoginPage)))).toContain('AI Travel Planner');
    expect(shownIn(markupOf(createElement(RegisterPage)))).toContain('AI Travel Planner');
  });

  // @covers REQ-TRV-110@v1
  test('offer Print itinerary, and the print view has Day headings and Activity titles and no map', () => {
    const markup = markupOf(createElement(PlanDisplay, { plan: A_FULL_PLAN, actions: NO_ACTIONS }));
    const printView =
      markup.match(/id="print-itinerary"[^>]*>([\s\S]*)<\/div>\s*<\/section>/)?.[1] ?? '';

    expect(shownIn(markup)).toContain('Print itinerary');
    expect(printView).toContain('Day 1, 2026-10-10');
    expect(printView).toContain('Day 2, 2026-10-11');
    expect(printView).toContain('Plan A morning 1');
    expect(printView).not.toMatch(MAP);
  });
});
