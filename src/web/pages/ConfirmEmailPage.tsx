import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api-client';
import { AuthShell } from '../components/AuthShell';

type Confirmation = { readonly state: 'pending' } | { readonly state: 'confirmed' } | { readonly state: 'refused'; readonly message: string };

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [confirmation, setConfirmation] = useState<Confirmation>({ state: 'pending' });
  // A confirmation link works once, so it must be sent once even when React re-runs effects.
  const hasSent = useRef(false);

  useEffect(() => {
    if (hasSent.current) return;
    hasSent.current = true;
    void api('POST', '/api/email-confirmations', { token }).then((result) => {
      setConfirmation(
        result.ok
          ? { state: 'confirmed' }
          : { state: 'refused', message: result.error.message ?? 'This link cannot be used.' },
      );
    });
  }, [token]);

  if (confirmation.state === 'pending') {
    return (
      <AuthShell>
        <p className="loading">Confirming your email address…</p>
      </AuthShell>
    );
  }
  if (confirmation.state === 'refused') {
    return (
      <AuthShell>
        <h1>This link cannot be used</h1>
        <p role="alert">{confirmation.message}</p>
      </AuthShell>
    );
  }
  return (
    <AuthShell>
      <h1>Email address confirmed</h1>
      <Link to="/trips" className="btn btn-primary">
        Go to your Trips
      </Link>
    </AuthShell>
  );
}
