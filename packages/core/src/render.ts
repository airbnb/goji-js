import { ReactElement } from 'react';
import { Container } from './container';
import { reconciler } from './reconciler';

export function renderIntoContainer(rootElement: ReactElement, container: Container) {
  // Create a root Container if it doesn't exist
  if (!container.fiberRootContainer) {
    container.fiberRootContainer = reconciler.createContainer(
      container,
      0,
      null,
      false,
      null,
      '',
      () => {},
      null,
    );
  }

  reconciler.updateContainer(rootElement, container.fiberRootContainer, null, () => {});
}
