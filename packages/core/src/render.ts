import { ReactElement } from 'react';
import { Container } from './container';
import { reconciler } from './reconciler';

export function renderIntoContainer(rootElement: ReactElement | null, container: Container) {
  // Create a root Container if it doesn't exist
  if (!container.fiberRootContainer) {
    container.fiberRootContainer = reconciler.createContainer(container, false, false);
  }

  reconciler.updateContainer(rootElement, container.fiberRootContainer, null, () => {});
}
