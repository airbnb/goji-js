import React, { PropsWithChildren } from 'react';
import { UniversalHooksProvider } from '../lifecycles/universal/provider';
import { PortalProvider } from '../portal';
import { Container } from '../container';
import { ContainerProvider } from './container';

export const GojiProvider = ({
  children,
  container,
}: PropsWithChildren<{
  container: Container;
}>) => (
  <ContainerProvider container={container}>
    <UniversalHooksProvider>
      <PortalProvider>{children}</PortalProvider>
    </UniversalHooksProvider>
  </ContainerProvider>
);
