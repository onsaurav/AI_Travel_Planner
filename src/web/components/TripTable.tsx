import { Link } from 'react-router-dom';
import type { TripView } from '../../shared/trip-schemas';
import { travelersLabel } from '../pages/trip-labels';
import { StatusBadge } from './StatusBadge';

export function TripTable({ trips }: { readonly trips: readonly TripView[] }) {
  return (
    <div className="table-wrap">
      <table className="data-table trip-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Destination</th>
            <th scope="col">Dates</th>
            <th scope="col">Travelers</th>
            <th scope="col" className="numeric">
              Budget
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td className="cell-title">
                <Link to={`/trips/${encodeURIComponent(trip.id)}`}>{trip.name}</Link>
              </td>
              <td>{`${trip.destination.name}, ${trip.destination.country}`}</td>
              <td className="cell-nowrap">{`${trip.startDate} to ${trip.endDate}`}</td>
              <td className="cell-nowrap">{travelersLabel(trip)}</td>
              <td className="numeric cell-nowrap">{`${trip.budget} ${trip.currency}`}</td>
              <td>
                <StatusBadge label={trip.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
