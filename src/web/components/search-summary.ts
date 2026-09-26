/**
 * What a search panel says is in use, such as `“Tokyo” · 2 filters in use`, or null when nothing is. It is shown whether
 * or not the panel is hidden, so a hidden panel never hides that the list is narrowed.
 */
export function searchSummary(query: string, filterCount: number): string | null {
  const parts = [
    query.trim() === '' ? null : `“${query.trim()}”`,
    filterCount === 0 ? null : `${filterCount} ${filterCount === 1 ? 'filter' : 'filters'} in use`,
  ].filter((part): part is string => part !== null);
  return parts.length === 0 ? null : parts.join(' · ');
}
