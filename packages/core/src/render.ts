import { ReactElement } from 'react';
import { Container } from './container';
import { reconciler } from './reconciler';

export function renderIntoContainer(rootElement: ReactElement | null, container: Container) {
  // Create a root Container if it doesn't exist
  if (!container.fiberRootContainer) {
    container.fiberRootContainer = reconciler.createContainer(
      container,
      0,
      null,
      false,
      null,
      '',
      error => console.error(error),
      null,
    );
  }

  reconciler.updateContainer(rootElement, container.fiberRootContainer, null, () => {});
}
