import type { ReactNode } from 'react';

interface PageHeaderProps {
  readonly title: string;
  /** A short word above the title saying which part of the product this is, such as `Admin`. */
  readonly eyebrow?: string;
  /** One line under the title. */
  readonly lead?: string;
  /** Shown beside the title, such as a status badge. */
  readonly badge?: ReactNode;
  /** The page's main action, and at most one quieter one. */
  readonly actions?: ReactNode;
}

/** The top of a signed-in page: where the person is, and the one or two things they can do from here. */
export function PageHeader({ title, eyebrow, lead, badge, actions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <div className="page-title-row">
          <h1>{title}</h1>
          {badge}
        </div>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  );
}
