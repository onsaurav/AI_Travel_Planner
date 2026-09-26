import { defineConfig, devices } from '@playwright/test';

const PORT = 5174;
const OLLAMA_LIVE_PORT = 5175;
const OLLAMA_DOWN_PORT = 5176;
export const E2E_OUTBOX_DIR = '.e2e/outbox';
export const E2E_DATABASE_PATH = '.e2e/trv-e2e.sqlite';
/** The browser tests write what the next AI request should do here (mode: ok, error or hang). */
export const E2E_AI_SCRIPT_FILE = '.e2e/ai-script.json';
/** Held by the e2e server only, so a test can prove it never reaches a page or script. */
export const E2E_AI_API_KEY = 'sk-e2e-distinctive-key-value-4c1f9a'; // itm-sdlc:allow-secret - synthetic test key
/** The Administrator the installation seed step creates before the server starts. */
export const SEEDED_ADMIN_EMAIL = 'admin@example.com';
export const SEEDED_ADMIN_PASSWORD = 'harbour-lantern-amber-admin'; // itm-sdlc:allow-secret - synthetic test password
/** The local Ollama the live test talks to (REQ-TRV-117). The test skips when it is not serving this model. */
export const E2E_OLLAMA_BASE_URL = process.env.E2E_OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
export const E2E_OLLAMA_MODEL = process.env.E2E_OLLAMA_MODEL ?? 'llama2';
/** Application servers that use Ollama and hold no API key: one reaching the local Ollama, one pointed where nothing listens. */
export const OLLAMA_LIVE_APP_URL = `http://127.0.0.1:${OLLAMA_LIVE_PORT}`;
export const OLLAMA_DOWN_APP_URL = `http://127.0.0.1:${OLLAMA_DOWN_PORT}`;

/** What every e2e server shares: one database, one outbox, one seeded Administrator. */
const SHARED_ENV = {
  HOST: '127.0.0.1',
  DATABASE_PATH: E2E_DATABASE_PATH,
  EMAIL_TRANSPORT: 'file',
  EMAIL_OUTBOX_DIR: E2E_OUTBOX_DIR,
  EMAIL_FROM: 'no-reply@example.test',
  APP_ENV: 'development',
  APP_TIMEZONE: 'UTC',
  COOKIE_SECURE: 'false',
  NODE_ENV: 'test',
  AUTH_RATE_LIMIT_PER_MINUTE: '1000',
  SEED_ADMIN_PASSWORD: SEEDED_ADMIN_PASSWORD,
};

/** The Ollama servers leave reminders and purging to the main server, so no email is sent twice. */
const QUIET_JOBS = { REMINDER_CHECK_INTERVAL_MS: '2147483647', TRIP_PURGE_INTERVAL_MS: '2147483647' };

const ollamaServer = (port: number, ollamaBaseUrl: string, timeoutMs: number) => ({
  command: 'tsx src/server/main.ts',
  url: `http://127.0.0.1:${port}/api/health`,
  reuseExistingServer: false,
  timeout: 60_000,
  env: {
    ...SHARED_ENV,
    ...QUIET_JOBS,
    PORT: String(port),
    APP_BASE_URL: `http://127.0.0.1:${port}`,
    AI_PROVIDER: 'ollama',
    OLLAMA_BASE_URL: ollamaBaseUrl,
    AI_MODEL: E2E_OLLAMA_MODEL,
    AI_TIMEOUT_MS: String(timeoutMs),
  },
});

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Started in order: the first builds the page, resets the state and seeds the Administrator the others share.
  webServer: [
    {
      command: `npm run build:web && node e2e/support/reset-e2e-state.mjs && tsx scripts/seed-administrator.ts ${SEEDED_ADMIN_EMAIL} && tsx src/server/main.ts`,
      url: `http://127.0.0.1:${PORT}/api/health`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...SHARED_ENV,
        PORT: String(PORT),
        APP_BASE_URL: `http://127.0.0.1:${PORT}`,
        REMINDER_CHECK_INTERVAL_MS: '500',
        TRIP_PURGE_INTERVAL_MS: '500',
        AI_PROVIDER: 'scripted',
        AI_SCRIPT_FILE: E2E_AI_SCRIPT_FILE,
        AI_API_KEY: E2E_AI_API_KEY,
        AI_TIMEOUT_MS: '2000',
      },
    },
    ollamaServer(OLLAMA_LIVE_PORT, E2E_OLLAMA_BASE_URL, 180_000),
    // Port 9 (discard) has nothing listening, so every request is refused: Ollama is down.
    ollamaServer(OLLAMA_DOWN_PORT, 'http://127.0.0.1:9', 5_000),
  ],
});
