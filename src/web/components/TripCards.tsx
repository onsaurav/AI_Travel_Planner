import { useId } from 'react';
import { Link } from 'react-router-dom';
import type { TripView } from '../../shared/trip-schemas';
import { deskListNext } from '../pages/desk-list-next';
import { travelersLabel } from '../pages/trip-labels';
import { StatusBadge } from './StatusBadge';

function TripCard({ trip }: { readonly trip: TripView }) {
  const titleId = useId();
  return (
    <article className="trip-card" aria-labelledby={titleId}>
      <header className="trip-card-header">
        <h2 id={titleId} className="trip-card-title">
          <Link to={`/trips/${encodeURIComponent(trip.id)}`}>{trip.name}</Link>
        </h2>
        <StatusBadge label={trip.status} />
      </header>
      <p className="trip-card-destination">{`${trip.destination.name}, ${trip.destination.country}`}</p>
      <dl className="trip-card-facts">
        <div>
          <dt>Dates</dt>
          <dd>{`${trip.startDate} to ${trip.endDate}`}</dd>
        </div>
        <div>
          <dt>Travelers</dt>
          <dd>{travelersLabel(trip)}</dd>
        </div>
        <div>
          <dt>Budget</dt>
          <dd>{`${trip.budget} ${trip.currency}`}</dd>
        </div>
      </dl>
      <p className="trip-card-next">
        <span className="muted">Next:</span> {deskListNext(trip.status)}
      </p>
    </article>
  );
}

/** The Traveler's Trips as cards: the same facts as the table, each Trip a block of its own. */
export function TripCards({ trips }: { readonly trips: readonly TripView[] }) {
  return (
    <ul className="trip-cards" aria-label="Trips">
      {trips.map((trip) => (
        <li key={trip.id}>
          <TripCard trip={trip} />
        </li>
      ))}
    </ul>
  );
}
