import { expect, test } from '@playwright/test';
import { aTripWithAPlan } from './support/plan-edit-journeys';
import { aTripReadyToPlan, setAiScript, TRIP_DAY_COUNT } from './support/plan-journeys';

test.afterEach(async () => {
  await setAiScript({ mode: 'ok', dayCount: TRIP_DAY_COUNT });
});

test.describe('the tour desk job on a Trip', () => {
  // @covers REQ-TRV-112@v1
  // @covers REQ-TRV-115@v1
  // @covers REQ-TRV-118@v1
  test('a Draft Trip says to generate a Plan, offers Generate Plan, and has no Chat', async ({
    browser,
  }) => {
    const { page } = await aTripReadyToPlan(browser, 'desk-draft');

    const desk = page.getByRole('list', { name: 'Desk job' });
    await expect(desk).toBeVisible();
    await expect(desk.getByText('Trip', { exact: true })).toBeVisible();
    await expect(desk.getByText('Itinerary', { exact: true })).toBeVisible();
    await expect(desk.getByText('Adjust', { exact: true })).toBeVisible();
    await expect(desk.getByText('Hand over', { exact: true })).toBeVisible();
    await expect(page.getByText('Next: generate a day-by-day Plan for this Trip.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate Plan' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Chat' })).toHaveCount(0);
  });

  // @covers REQ-TRV-112@v1
  // @covers REQ-TRV-113@v1
  // @covers REQ-TRV-114@v1
  // @covers REQ-TRV-116@v1
  // @covers REQ-TRV-118@v1
  test('a Planned Trip says to adjust or print, and shows Chat with help plus Print itinerary', async ({
    browser,
  }) => {
    const { page } = await aTripWithAPlan(browser, 'desk-planned');

    await expect(page.getByRole('list', { name: 'Desk job' })).toBeVisible();
    await expect(
      page.getByText('Next: adjust the itinerary in Chat, or print it for the Traveler.'),
    ).toBeVisible();
    const chat = page.getByRole('region', { name: 'Chat' });
    await expect(chat).toBeVisible();
    await expect(
      chat.getByText(
        'Ask a question or request a change. A change is previewed before it is saved.',
      ),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Print itinerary' })).toBeVisible();
  });
});
