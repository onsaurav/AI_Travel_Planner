import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeletedTrips } from '../components/DeletedTrips';
import { PageHeader } from '../components/PageHeader';
import { TripFilters } from '../components/TripFilters';
import { TripTable } from '../components/TripTable';
import { apiPathFor, filterOptionsFrom, filterProblem, hasFilters, listMessage } from './trip-list-state';
import { useFilterForm } from './use-filter-form';
import { useTrips } from './use-trips';

const UNFILTERED = '/api/trips';

/**
 * The Traveler's own saved Trips (REQ-TRV-016), which they can search and filter (REQ-TRV-076, REQ-TRV-077). The
 * search and the filters are in the address of the page, so a reload keeps them and Back returns to the list as
 * it was. What the page has to say (why the filters cannot be sent, or that nothing matches) is one polite
 * announcement, so a screen reader hears it. With no Trips at all, that announcement sits in a card with the one
 * button that starts a Trip.
 */
export function TripsPage() {
  const [reloads, setReloads] = useState(0);
  const { form, searchText, setSearchText, change, clear } = useFilterForm();
  const problem = filterProblem(form);
  const all = useTrips(UNFILTERED, reloads);
  // With no filter, or one that cannot be sent, the list is the whole list, which is already asked for.
  const filteredPath = problem || !hasFilters(form) ? null : apiPathFor(form);
  const filtered = useTrips(filteredPath, reloads);
  const shown = filteredPath === null ? all : filtered;
  const isAnswerToNow = shown.state === 'loaded' && shown.path === (filteredPath ?? UNFILTERED);
  const message =
    all.state === 'loaded' && shown.state === 'loaded' && isAnswerToNow
      ? listMessage({ total: all.trips.length, shown: shown.trips.length, hasFilters: hasFilters(form) })
      : null;
  const hasNoTrips = all.state === 'loaded' && all.trips.length === 0;
  const newTrip = (
    <Link to="/trips/new" className="btn btn-primary">
      New Trip
    </Link>
  );

  return (
    <>
      <PageHeader title="Your Trips" lead="Every Trip you have saved, with its Plan." actions={hasNoTrips ? null : newTrip} />
      {all.state === 'loaded' && all.trips.length > 0 ? (
        <TripFilters
          form={form}
          searchText={searchText}
          options={filterOptionsFrom(all.trips)}
          onSearchText={setSearchText}
          onChange={change}
          onClear={clear}
        />
      ) : null}
      <div className={hasNoTrips ? 'empty-state' : 'list-status'}>
        <p role="status">{problem ?? message ?? ''}</p>
        {hasNoTrips ? (
          <>
            <p className="muted">Create a Trip, then generate its Plan day by day.</p>
            {newTrip}
          </>
        ) : null}
      </div>
      {shown.state === 'loading' ? <p className="loading">Loading…</p> : null}
      {shown.state === 'loaded' && shown.trips.length > 0 ? <TripTable trips={shown.trips} /> : null}
      {shown.state === 'failed' ? <p role="alert">{shown.message}</p> : null}
      <DeletedTrips onRestored={() => setReloads((count) => count + 1)} />
    </>
  );
}
