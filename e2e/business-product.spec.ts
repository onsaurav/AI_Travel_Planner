import { expect, test } from '@playwright/test';
import { ADMIN_FUNCTIONS } from '../src/shared/admin-functions';
import { PLAN_RECOMMENDATION_NOTICE } from '../src/shared/plan-notice';
import { MAP } from '../tests/support/out-of-scope-words';
import { logInAsAdministrator, uniqueName } from './support/admin-journeys';
import { EVENING, LUNCH, MORNING, aTripWithAPlan } from './support/plan-edit-journeys';
import { setAiScript, TRIP_DAY_COUNT } from './support/plan-journeys';
import {
  aConfirmedTravelerOnTrips,
  aDestinationAddedByAdministrator,
  createTripThroughUi,
} from './support/trip-journeys';

test.afterEach(async () => {
  await setAiScript({ mode: 'ok', dayCount: TRIP_DAY_COUNT });
});

const figureOf = (page: import('@playwright/test').Page, heading: string) =>
  page.locator('dt', { hasText: heading }).locator('xpath=following-sibling::dd[1]');

test.describe('the Traveler workspace', () => {
  // @covers REQ-TRV-106@v1
  test('shows Your Trips, New Trip without scrolling, and a Trip as its own block', async ({
    browser,
  }) => {
    const { name: destination } = await aDestinationAddedByAdministrator(browser, 'Tokyo');
    const page = await aConfirmedTravelerOnTrips(browser, 'workspace');
    const tripName = uniqueName('Tokyo Family Holiday');
    await createTripThroughUi(page, { name: tripName, destinationName: destination });

    await expect(page.getByRole('heading', { name: 'Your Trips' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'New Trip' }).first()).toBeInViewport();
    const card = page.getByRole('row', { name: new RegExp(tripName) });
    await expect(card).toContainText(tripName);
    await expect(card).toContainText(`${destination}, Japan`);
    await expect(card).toContainText(' to ');
    await expect(card).toContainText('Draft');
  });

  // @covers REQ-TRV-106@v1
  test('says there are no Trips yet and offers New Trip', async ({ browser }) => {
    const page = await aConfirmedTravelerOnTrips(browser, 'workspace-empty');

    await expect(page.getByText('You have no Trips yet.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'New Trip' }).first()).toBeVisible();
  });
});

test.describe('the Plan as an itinerary', () => {
  // @covers REQ-TRV-107@v1
  test('shows each Day as its own region, with the recommendation notice above the Days', async ({
    browser,
  }) => {
    const { page } = await aTripWithAPlan(browser, 'itinerary', 2);

    const notice = page.locator('#print-itinerary').getByText(PLAN_RECOMMENDATION_NOTICE);
    const firstDay = page.getByRole('region', { name: /^Day 1,/ });
    await expect(notice).toBeVisible();
    await expect(firstDay).toBeVisible();
    await expect(page.getByRole('region', { name: /^Day 2,/ })).toBeVisible();
    await expect(firstDay.getByRole('button', { name: new RegExp(MORNING) })).toBeVisible();
    const noticeBeforeDay = await page.locator('#print-itinerary').evaluate((root) => {
      const noticeEl = root.querySelector('.plan-notice');
      const dayEl = root.querySelector('[aria-label^="Day 1"]');
      if (!noticeEl || !dayEl) return false;
      return Boolean(noticeEl.compareDocumentPosition(dayEl) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(noticeBeforeDay).toBe(true);
  });
});

test.describe('the Administrator console', () => {
  // @covers REQ-TRV-108@v1
  test('names each admin function and shows metrics on the same page', async ({ page }) => {
    await logInAsAdministrator(page);
    await page.goto('/admin');

    for (const adminFunction of ADMIN_FUNCTIONS) {
      await expect(
        page
          .getByRole('navigation', { name: 'Admin functions' })
          .getByRole('link', { name: adminFunction.label }),
      ).toBeVisible();
    }
    await expect(page.getByRole('heading', { name: 'Usage' })).toBeVisible();
    await expect(figureOf(page, 'Total users')).toBeVisible();
  });

  // @covers REQ-TRV-111@v1
  test('shows Draft Trips and Planned Trips as their own figures', async ({ page, browser }) => {
    const ready = await aTripWithAPlan(browser, 'pipeline-planned');
    const { name: destination } = await aDestinationAddedByAdministrator(browser, 'Osaka');
    await createTripThroughUi(ready.page, {
      name: uniqueName('Draft pipeline'),
      destinationName: destination,
    });
    await logInAsAdministrator(page);
    await page.goto('/admin');

    await expect(figureOf(page, 'Draft Trips')).toHaveText(/^\d+$/);
    await expect(figureOf(page, 'Planned Trips')).toHaveText(/^\d+$/);
    const draft = Number(await figureOf(page, 'Draft Trips').textContent());
    const planned = Number(await figureOf(page, 'Planned Trips').textContent());
    expect(draft).toBeGreaterThanOrEqual(1);
    expect(planned).toBeGreaterThanOrEqual(1);
  });
});

test.describe('sign-in naming the product', () => {
  // @covers REQ-TRV-109@v1
  test('shows AI Travel Planner on log in and registration', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('AI Travel Planner')).toBeVisible();

    await page.goto('/register');
    await expect(page.getByText('AI Travel Planner')).toBeVisible();
  });
});

test.describe('printing an itinerary', () => {
  // @covers REQ-TRV-110@v1
  test('offers Print itinerary, and the print view has Day headings and Activity titles and no map', async ({
    browser,
  }) => {
    const { page } = await aTripWithAPlan(browser, 'print-itinerary', 2);
    await expect(page.getByRole('button', { name: 'Print itinerary' })).toBeVisible();
    await page.evaluate(() => {
      window.print = () => undefined;
    });

    await page.getByRole('button', { name: 'Print itinerary' }).click();

    const printView = page.locator('#print-itinerary');
    await expect(printView.getByRole('heading', { name: /^Day 1,/ })).toBeVisible();
    await expect(printView.getByRole('heading', { name: /^Day 2,/ })).toBeVisible();
    await expect(printView).toContainText(MORNING);
    await expect(printView).toContainText(LUNCH);
    await expect(printView).toContainText(EVENING);
    await expect(printView).not.toContainText(MAP);
  });
});
