import { Link } from 'react-router-dom';
import { ADMIN_FUNCTIONS } from '../../../shared/admin-functions';
import { PageHeader } from '../../components/PageHeader';
import { MetricsPanel } from './MetricsPanel';

const FUNCTION_HINT: Readonly<Record<(typeof ADMIN_FUNCTIONS)[number]['key'], string>> = {
  users: 'Accounts and roles',
  destinations: 'Places Travelers can choose',
  feedback: 'Ratings and comments',
  'notification-settings': 'Which emails go out',
  'ai-usage-limits': 'Caps and spend',
};

/** The admin functions, metrics and pipeline counts — an operations console (REQ-TRV-068, REQ-TRV-108, REQ-TRV-111). */
export function AdminDashboardPage() {
  return (
    <div className="admin-console">
      <PageHeader
        eyebrow="Operations"
        title="Admin dashboard"
        lead="Users, Destinations, feedback and today's pipeline."
      />
      <nav aria-label="Admin functions">
        <ul>
          {ADMIN_FUNCTIONS.map((adminFunction) => (
            <li key={adminFunction.key}>
              <Link to={adminFunction.path} className="admin-tile">
                {/* The letter is drawn by CSS, so the tile's text starts with the function's name. */}
                <span
                  className="admin-tile-mark"
                  aria-hidden="true"
                  data-mark={adminFunction.label.slice(0, 1)}
                />
                <span className="admin-tile-label">{adminFunction.label}</span>
                <span className="admin-tile-hint" aria-hidden="true">
                  {FUNCTION_HINT[adminFunction.key]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <MetricsPanel />
    </div>
  );
}
