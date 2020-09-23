import { ReactElement } from 'react';
import { Container } from './container';
import { reconciler } from './reconciler';


// https://sourcegraph.com/github.com/facebook/react@master/-/blob/packages/react-reconciler/src/ReactRootTags.js
export type RootTag = 0 | 1 | 2;
export const LegacyRoot = 0;
export const BlockingRoot = 1;
export const ConcurrentRoot = 2;

export function renderIntoContainer(rootElement: ReactElement | null, container: Container, rootTag?: RootTag) {
  // Create a root Container if it doesn't exist
  if (!container.fiberRootContainer) {
    // https://sourcegraph.com/github.com/facebook/react@master/-/blob/packages/react-reconciler/src/ReactFiberReconciler.old.js
    // FIXME: refer to source code of react-reconciler, `@type/react-reconciler` is out of data; here we need to upgrade it;
    // @ts-ignore
    container.fiberRootContainer = reconciler.createContainer(container, rootTag, false);
  }

  reconciler.updateContainer(rootElement, container.fiberRootContainer, null, () => {});
}
