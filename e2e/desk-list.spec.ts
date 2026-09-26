import { expect, test } from '@playwright/test';
import { uniqueName } from './support/admin-journeys';
import { aTripWithAPlan } from './support/plan-edit-journeys';
import {
  aConfirmedTravelerOnTrips,
  aDestinationAddedByAdministrator,
  createTripThroughUi,
} from './support/trip-journeys';

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

test.describe('Your Trips as a desk list', () => {
  // @covers REQ-TRV-119@v1
  // @covers REQ-TRV-120@v1
  test('shows the Trip table, New Trip, a Filters group, and Generate Plan on a Draft row', async ({
    browser,
  }) => {
    const { name: destination } = await aDestinationAddedByAdministrator(browser, 'Dhaka');
    const page = await aConfirmedTravelerOnTrips(browser, 'desk-list-draft');
    const tripName = uniqueName('tur-draft');
    await createTripThroughUi(page, { name: tripName, destinationName: destination });

    await expect(page.getByRole('heading', { name: 'Your Trips' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'New Trip' }).first()).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    const search = page.getByRole('search', { name: 'Search and filter Trips' });
    await expect(search).toBeVisible();
    await expect(search.getByLabel('Search Trips', { exact: true })).toBeVisible();
    const filters = search.getByRole('group', { name: 'Filters' });
    await expect(filters).toBeVisible();
    for (const label of FILTER_LABELS) {
      await expect(filters.getByLabel(label, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('row', { name: new RegExp(tripName) })).toContainText(
      'Generate Plan',
    );
  });

  // @covers REQ-TRV-120@v1
  test('names Adjust on a Planned Trip', async ({ browser }) => {
    const { page, tripName } = await aTripWithAPlan(browser, 'desk-list-planned');
    await page.goto('/trips');

    await expect(page.getByRole('row', { name: new RegExp(tripName) })).toContainText('Adjust');
  });
});
