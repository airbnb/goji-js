import React, { ReactNode, useContext } from 'react';
import { PortalContext } from './context';

// use an internal component to support call hooks in the condition
// for example `{condition && createPortal()}`
const Portal = ({ children }: React.PropsWithChildren<{}>) => {
  const portalContext = useContext(PortalContext);
  if (!portalContext) {
    throw new Error('Cannot found `portalContext`. This might be an internal error in GojiJS.');
  }
  // since `key` is added on `<Portal>` there is no need to add it again on portal instance
  return portalContext.createPortal(children);
};

export const createPortal = (element: ReactNode, key?: null | string | number) => (
  <Portal key={key ?? String(key)}>{element}</Portal>
);

export { PortalContext } from './context';
export { PortalProvider } from './provider';
