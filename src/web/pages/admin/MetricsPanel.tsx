import { useEffect, useState } from 'react';
import type { AdminMetrics } from '../../../shared/admin-metrics';
import { api } from '../../api-client';
import { FormField } from '../../components/FormField';
import {
  averageRatingLabel,
  budgetLabel,
  tripsSplitLabel,
  usageCostLabel,
} from './admin-view-state';

type State =
  | { readonly state: 'loading' }
  | { readonly state: 'loaded'; readonly metrics: AdminMetrics }
  | { readonly state: 'failed'; readonly message: string };

const queryFor = (from: string, to: string): string => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const text = params.toString();
  return text === '' ? '' : `?${text}`;
};

const RANGE_BACKWARDS = 'The end of the range is before its start.';

/**
 * The seven figures of the admin dashboard (REQ-TRV-069). Only AI usage follows the dates chosen; with none chosen it is
 * everything there has been. Each currency's average budget stands alone, never added to another's. While a new range is
 * read the last figures stay on show, marked busy, and a range that runs backwards is said so and not sent.
 */
export function MetricsPanel() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [shown, setShown] = useState<State>({ state: 'loading' });
  const [isReading, setIsReading] = useState(true);
  const isBackwards = from !== '' && to !== '' && from > to;

  useEffect(() => {
    if (isBackwards) return undefined;
    let isCurrent = true;
    setIsReading(true);
    void api<AdminMetrics>('GET', `/api/admin/metrics${queryFor(from, to)}`).then((result) => {
      if (!isCurrent) return;
      setIsReading(false);
      setShown(
        result.ok
          ? { state: 'loaded', metrics: result.data }
          : {
              state: 'failed',
              message: result.error.message ?? 'The figures could not be loaded.',
            },
      );
    });
    return () => {
      isCurrent = false;
    };
  }, [from, to, isBackwards]);

  const metrics = shown.state === 'loaded' ? shown.metrics : null;
  return (
    <section className="usage-board" aria-labelledby="metrics-heading">
      <h2 id="metrics-heading">Usage</h2>
      {shown.state === 'loading' ? <p>Loading the figures…</p> : null}
      {shown.state === 'failed' ? <p role="alert">{shown.message}</p> : null}
      {metrics ? <Figures metrics={metrics} /> : null}
      <div className="console-card">
        <fieldset className="date-range">
          <legend>AI usage dates</legend>
          <div className="date-range-fields">
            <FormField label="From" type="date" value={from} onChange={setFrom} />
            <FormField
              label="To"
              type="date"
              value={to}
              onChange={setTo}
              error={isBackwards ? RANGE_BACKWARDS : undefined}
            />
          </div>
        </fieldset>
        {metrics ? (
          <dl className="metric-grid metric-grid-2" aria-busy={isReading}>
            <div className="metric-card">
              <dt>AI requests</dt>
              <dd>{metrics.aiUsage.requests}</dd>
            </div>
            <div className="metric-card">
              <dt>Estimated cost</dt>
              <dd>{usageCostLabel(metrics.aiUsage.estimatedCost)}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </section>
  );
}

function Figures({ metrics }: { readonly metrics: AdminMetrics }) {
  return (
    <>
      <dl className="metric-grid">
        <div className="metric-card">
          <dt>Total users</dt>
          <dd>{metrics.users}</dd>
        </div>
        <div className="metric-card">
          <dt>Total trips</dt>
          <dd>{tripsSplitLabel(metrics.trips)}</dd>
        </div>
        <div className="metric-card metric-card-draft">
          <dt>Draft Trips</dt>
          <dd>{metrics.trips.draft}</dd>
        </div>
        <div className="metric-card metric-card-planned">
          <dt>Planned Trips</dt>
          <dd>{metrics.trips.planned}</dd>
        </div>
        <div className="metric-card">
          <dt>Generated itineraries</dt>
          <dd>{metrics.generatedItineraries}</dd>
        </div>
        <div className="metric-card">
          <dt>Feedback volume</dt>
          <dd>{metrics.feedback.count}</dd>
        </div>
        <div className="metric-card">
          <dt>Average rating</dt>
          <dd>{averageRatingLabel(metrics.feedback.averageRating)}</dd>
        </div>
      </dl>
      <div className="console-split">
        <div className="console-card">
          <h3>Popular destinations</h3>
          {metrics.popularDestinations.length === 0 ? (
            <p className="muted">No Trips yet.</p>
          ) : (
            <ol aria-label="Ranked by number of Trips">
              {metrics.popularDestinations.map((destination) => (
                <li key={`${destination.name}-${destination.country}`}>
                  {`${destination.name}, ${destination.country}: ${destination.trips} ${destination.trips === 1 ? 'Trip' : 'Trips'}`}
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="console-card">
          <h3>Average budget</h3>
          {metrics.averageBudget.length === 0 ? (
            <p className="muted">No Trips yet.</p>
          ) : (
            <ul aria-label="One figure for each currency">
              {metrics.averageBudget.map((figure) => (
                <li key={figure.currency}>{budgetLabel(figure)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
