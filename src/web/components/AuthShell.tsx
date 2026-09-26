import type { ReactNode } from 'react';

/**
 * The frame of every page seen before logging in: the product's name and one line about it beside a card that
 * holds the page's own heading and form.
 */
export function AuthShell({ children }: { readonly children: ReactNode }) {
  return (
    <main className="auth-page">
      <div className="auth-brand">
        <p className="brand auth-brand-name">
          <span className="brand-mark" aria-hidden="true">
            AT
          </span>
          AI Travel Planner
        </p>
        <p className="auth-tagline">Plan trips. Edit the itinerary.</p>
      </div>
      <div className="auth-card">{children}</div>
    </main>
  );
}
