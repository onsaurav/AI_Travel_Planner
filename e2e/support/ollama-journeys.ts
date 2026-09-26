import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { E2E_DATABASE_PATH } from '../../playwright.config';
import { daysFromToday } from './trip-journeys';

/** Whether an Ollama server answers at `baseUrl` and has `model` pulled, so a live test can skip instead of fail when it is absent. */
export async function ollamaServesModel(baseUrl: string, model: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/tags`, { signal: AbortSignal.timeout(3_000) });
    if (!response.ok) return false;
    const body = (await response.json()) as { models?: readonly { name?: string }[] };
    return (body.models ?? []).some((entry) => entry.name === model || entry.name === `${model}:latest`);
  } catch {
    // Unreachable is the answer being asked for, not a failure of the test.
    return false;
  }
}

/**
 * Writes a one-Activity-a-day Plan for a Trip the Traveler already saved (starting a week from today), straight into
 * the e2e database, and marks the Trip Planned. A small local model cannot be relied on to write a whole valid Plan.
 */
export function seedPlanFor(options: { readonly ownerEmail: string; readonly tripName: string; readonly dayCount: number }): void {
  const database = new Database(E2E_DATABASE_PATH);
  try {
    database.pragma('busy_timeout = 5000');
    const trip = database
      .prepare('SELECT trips.id AS id FROM trips JOIN accounts ON accounts.id = trips.owner_account_id WHERE accounts.email = ? AND trips.name = ?')
      .get(options.ownerEmail, options.tripName) as { id: string } | undefined;
    if (!trip) throw new Error(`The Trip ${options.tripName} to seed a Plan for does not exist.`);
    const plan = {
      currency: 'USD',
      days: Array.from({ length: options.dayCount }, (_, index) => ({
        dayNumber: index + 1,
        date: daysFromToday(7 + index),
        activities: [
          {
            id: `seeded-${index + 1}`,
            title: `Seeded walk ${index + 1}`,
            startTime: '10:00',
            durationMinutes: 60,
            estimatedCost: 0,
            location: 'Old town',
            reason: 'A gentle start to the day.',
            category: 'Activities',
            changedByHand: false,
          },
        ],
      })),
      stay: { accommodationType: 'Hotel', suggestedArea: 'Old town', nightlyCostEstimate: 120 },
    };
    const now = Date.now();
    database
      .prepare(`INSERT INTO plan_versions (id, trip_id, version_number, source, plan_json, created_at) VALUES (?, ?, 1, 'generation', ?, ?)`)
      .run(randomUUID(), trip.id, JSON.stringify(plan), now);
    database.prepare(`UPDATE trips SET status = 'Planned', updated_at = ? WHERE id = ?`).run(now, trip.id);
  } finally {
    database.close();
  }
}
