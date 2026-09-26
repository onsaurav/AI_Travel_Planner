import { expect, test, type Page } from '@playwright/test';
import { E2E_OLLAMA_BASE_URL, E2E_OLLAMA_MODEL, OLLAMA_DOWN_APP_URL, OLLAMA_LIVE_APP_URL } from '../playwright.config';
import { chatLog, chatSection, expectChat, sendChat } from './support/chat-journeys';
import { ollamaServesModel, seedPlanFor } from './support/ollama-journeys';
import { aTripReadyToPlan, generatePlan } from './support/plan-journeys';

const UNAVAILABLE = 'The AI planner is unavailable right now';
const arrivingReply = (page: Page) => page.getByRole('list', { name: 'Reply arriving' }).getByRole('listitem').nth(1);

/** A Trip with a Plan already on it, so the Chat is offered without asking the AI for the Plan first. */
async function aTripWithASeededPlan(browser: Parameters<typeof aTripReadyToPlan>[0], label: string): Promise<Page> {
  const { page, email, tripName, dayCount } = await aTripReadyToPlan(browser, label);
  seedPlanFor({ ownerEmail: email, tripName, dayCount });
  await page.reload();
  await expect(chatSection(page)).toBeVisible();
  return page;
}

test.describe('with a local Ollama server running', () => {
  test.use({ baseURL: OLLAMA_LIVE_APP_URL });

  // @covers REQ-TRV-117@v1
  test('a Chat message is answered by Ollama, with no API key set, and the reply is shown piece by piece as it arrives', async ({ browser }) => {
    test.skip(!(await ollamaServesModel(E2E_OLLAMA_BASE_URL, E2E_OLLAMA_MODEL)), `Ollama is not serving ${E2E_OLLAMA_MODEL} at ${E2E_OLLAMA_BASE_URL}`);
    test.setTimeout(240_000);
    const page = await aTripWithASeededPlan(browser, 'ollama-live');

    await sendChat(page, 'When is the best season to visit?');

    await expect(arrivingReply(page)).toBeVisible({ timeout: 120_000 });
    const early = (await arrivingReply(page).locator('.chat-text').textContent()) ?? '';
    await expect(chatLog(page).locator(':scope > li')).toHaveCount(2, { timeout: 180_000 });
    const saved = (await chatLog(page).locator(':scope > li').nth(1).locator('.chat-text').textContent()) ?? '';
    expect(saved.length).toBeGreaterThan(early.length);
    expect(saved.startsWith(early)).toBe(true);
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
});

test.describe('when Ollama cannot be reached', () => {
  test.use({ baseURL: OLLAMA_DOWN_APP_URL });

  // @covers REQ-TRV-117@v1
  test('asking for a Plan says the AI is unavailable, and none of the request text is shown', async ({ browser }) => {
    const { page } = await aTripReadyToPlan(browser, 'ollama-down-plan');

    await generatePlan(page);

    await expect(page.getByRole('alert')).toContainText(UNAVAILABLE, { timeout: 15_000 });
    await expect(page.getByText(/You are a travel planner/i)).toHaveCount(0);
    await expect(page.getByText(/single JSON object/i)).toHaveCount(0);
    await expect(page.getByText(/127\.0\.0\.1:9\b|ECONNREFUSED|fetch failed/i)).toHaveCount(0);
  });

  // @covers REQ-TRV-117@v1
  test('a Chat message says the AI is unavailable, and none of the request text is shown', async ({ browser }) => {
    const page = await aTripWithASeededPlan(browser, 'ollama-down-chat');

    await sendChat(page, 'When is the best season to visit?');

    await expect(page.getByRole('alert')).toContainText(UNAVAILABLE, { timeout: 15_000 });
    await expect(page.getByText(/travel assistant for one trip/i)).toHaveCount(0);
    await expect(page.getByText(/single JSON object/i)).toHaveCount(0);
    await expect(page.getByText(/127\.0\.0\.1:9\b|ECONNREFUSED|fetch failed/i)).toHaveCount(0);
    await expectChat(page, []);
  });
});
