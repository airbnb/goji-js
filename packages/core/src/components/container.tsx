import React, { createContext, PropsWithChildren, useContext } from 'react';
import { Container } from '../container';

export const ContainerContext = createContext<Container | undefined>(undefined);

export const ContainerProvider = ({
  children,
  container,
}: PropsWithChildren<{ container: Container }>) => {
  const { Provider } = ContainerContext;

  return <Provider value={container}>{children}</Provider>;
};

export const useContainer = () => {
  const container = useContext(ContainerContext);
  if (!container) {
    throw new Error('Cannot found `containerContext`. This might be an internal error in GojiJS.');
  }

  return container;
};
