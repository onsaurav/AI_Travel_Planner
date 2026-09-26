import { createElement, Fragment } from 'react';
import { describe, expect, test } from 'vitest';
import { ChatBox } from '../../src/web/components/ChatBox';
import { PlanDisplay } from '../../src/web/components/PlanDisplay';
import { PlanGenerator } from '../../src/web/components/PlanGenerator';
import { A_FULL_PLAN, A_TRIP, NO_ACTIONS, markupOf, shownIn } from '../support/out-of-scope';

const DRAFT = { ...A_TRIP, status: 'Draft' as const };
const noop = () => undefined;

describe('the tour desk on a Trip', () => {
  // @covers REQ-TRV-114@v1
  test('an empty Chat says they can ask a question or request a change, previewed before it is saved', () => {
    const markup = markupOf(
      createElement(ChatBox, {
        tripId: A_TRIP.id,
        planVersion: 1,
        currency: 'USD',
        isBusy: false,
        onBusyChange: noop,
        onPlanChanged: noop,
      }),
    );

    expect(shownIn(markup)).toContain('Chat');
    expect(shownIn(markup)).toMatch(/ask a question or request a change/i);
    expect(shownIn(markup)).toMatch(/previewed before it is saved/i);
  });

  // @covers REQ-TRV-115@v1
  test('a Draft Trip offers Generate Plan and no Chat region', () => {
    const markup = markupOf(createElement(PlanGenerator, { trip: DRAFT, onPlanSaved: noop }));

    expect(shownIn(markup)).toContain('Generate Plan');
    expect(markup).not.toContain('id="chat-heading"');
  });

  // @covers REQ-TRV-113@v1
  // @covers REQ-TRV-116@v1
  test('Print itinerary and Chat are both in the itinerary work area', () => {
    const markup = markupOf(
      createElement(
        Fragment,
        null,
        createElement(PlanDisplay, { plan: A_FULL_PLAN, actions: NO_ACTIONS }),
        createElement(ChatBox, {
          tripId: A_TRIP.id,
          planVersion: 1,
          currency: 'USD',
          isBusy: false,
          onBusyChange: noop,
          onPlanChanged: noop,
        }),
      ),
    );

    expect(shownIn(markup)).toContain('Print itinerary');
    expect(shownIn(markup)).toContain('Chat');
    expect(markup.indexOf('Print itinerary')).toBeLessThan(markup.indexOf('id="chat-heading"'));
  });
});
