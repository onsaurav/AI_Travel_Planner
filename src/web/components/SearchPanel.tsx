import { useId, useState, type FormEvent, type ReactNode } from 'react';

interface SearchPanelProps {
  /** The name of the search landmark, such as `Search and filter Trips`. */
  readonly label: string;
  /** The words at the top of the panel. Kept apart from the landmark's name so the two never read the same. */
  readonly title: string;
  /** What is in use, such as `2 filters in use`, so hiding the panel never hides that the list is narrowed. */
  readonly summary: string | null;
  readonly onSubmit: (event: FormEvent) => void;
  /** The fields. */
  readonly children: ReactNode;
  /** The buttons under the fields, such as Search or Clear filters. */
  readonly actions?: ReactNode;
}

/**
 * Every search and filter form in the application: a panel with its title, what is in use, and a button that hides
 * or shows the fields. It opens with the fields showing; hiding them lasts only while the page is open.
 */
export function SearchPanel({
  label,
  title,
  summary,
  onSubmit,
  children,
  actions,
}: SearchPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const bodyId = useId();
  return (
    <form role="search" aria-label={label} className="search-panel" onSubmit={onSubmit} noValidate>
      <div className="search-panel-head">
        <p className="search-panel-title">{title}</p>
        {summary ? <span className="search-panel-summary">{summary}</span> : null}
        <button
          type="button"
          className="search-panel-toggle"
          aria-expanded={isOpen}
          aria-controls={bodyId}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>
      <div id={bodyId} className="search-panel-body" hidden={!isOpen}>
        {children}
        {actions ? <div className="search-panel-actions">{actions}</div> : null}
      </div>
    </form>
  );
}
