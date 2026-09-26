import { DESK_STEPS, deskStepState, type DeskStepId } from '../pages/desk-steps';

export function DeskSteps({ status }: { readonly status: 'Draft' | 'Planned' }) {
  return (
    <ol className="desk-steps" aria-label="Desk job">
      {DESK_STEPS.map((step, index) => {
        const state = deskStepState(status, step.id as DeskStepId);
        return (
          <li
            key={step.id}
            className={`desk-step desk-step-${state}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className="desk-step-index">{index + 1}</span>
            <span className="desk-step-text">
              <strong>{step.label}</strong>
              <span className="desk-step-does">{step.does}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
