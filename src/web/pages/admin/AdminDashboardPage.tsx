import { Link } from 'react-router-dom';
import { ADMIN_FUNCTIONS } from '../../../shared/admin-functions';
import { PageHeader } from '../../components/PageHeader';
import { MetricsPanel } from './MetricsPanel';

/** The admin functions, metrics and pipeline counts — an operations console (REQ-TRV-068, REQ-TRV-108, REQ-TRV-111). */
export function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Admin dashboard"
        lead="Users, Destinations, feedback and today's pipeline."
      />
      <nav aria-label="Admin functions">
        <ul>
          {ADMIN_FUNCTIONS.map((adminFunction) => (
            <li key={adminFunction.key}>
              <Link to={adminFunction.path}>{adminFunction.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <MetricsPanel />
    </>
  );
}
