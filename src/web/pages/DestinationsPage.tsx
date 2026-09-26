import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api-client';
import { FormField } from '../components/FormField';
import { PageHeader } from '../components/PageHeader';
import { SearchPanel } from '../components/SearchPanel';
import { searchSummary } from '../components/search-summary';
import type { DestinationSummary } from './destination';

type SearchState =
  | { readonly state: 'idle' }
  | { readonly state: 'loaded'; readonly results: readonly DestinationSummary[] }
  | { readonly state: 'failed'; readonly message: string };

/** A Traveler searches the enabled Destinations by name (REQ-TRV-078). */
export function DestinationsPage() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<SearchState>({ state: 'idle' });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await api<{ destinations: DestinationSummary[] }>(
      'GET',
      `/api/destinations?q=${encodeURIComponent(query)}`,
    );
    setSearch(
      result.ok
        ? { state: 'loaded', results: result.data.destinations }
        : { state: 'failed', message: result.error.message ?? 'The search could not be run.' },
    );
  };

  return (
    <>
      <PageHeader title="Destinations" lead="Places you can plan a Trip to." />
      <SearchPanel
        label="Find Destinations"
        title="Find a Destination"
        summary={searchSummary(query, 0)}
        onSubmit={(event) => void submit(event)}
        actions={<button type="submit">Search</button>}
      >
        <div className="search-panel-query">
          <FormField label="Search Destinations" value={query} onChange={setQuery} />
        </div>
      </SearchPanel>
      {search.state === 'failed' ? <p role="alert">{search.message}</p> : null}
      {search.state === 'loaded' && search.results.length === 0 ? (
        <p>No Destinations match.</p>
      ) : null}
      {search.state === 'loaded' && search.results.length > 0 ? (
        <ul aria-label="Search results">
          {search.results.map((destination) => (
            <li key={destination.id}>
              <Link to={`/destinations/${destination.id}`}>{destination.name}</Link> —{' '}
              {destination.country}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
