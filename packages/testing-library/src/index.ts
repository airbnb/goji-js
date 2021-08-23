import { ReactElement } from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { buildRenderResult } from './rendered';

export const render = (element: ReactElement) => {
  let testRenderer: ReactTestRenderer;

  act(() => {
    testRenderer = create(element);
  });

  return buildRenderResult(testRenderer!.root);
};

export { act };
export { fireEvent } from './events';
export { waitFor, waitForElement } from './wait';
export { getQueriesForElement as within } from './rendered';
