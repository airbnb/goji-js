import React, { PropsWithChildren } from 'react';
import { UniversalHooksProvider } from '../lifecycles/universal/provider';
import { EventProxyProvider } from './eventProxy';
import { PortalProvider } from '../portal';
import { Container } from '../container';
import { ContainerProvider } from './container';
import { PartialProvider } from '../partial';

export const GojiProvider = ({
  children,
  container,
}: PropsWithChildren<{
  container: Container;
}>) => (
    <ContainerProvider container={container}>
      <EventProxyProvider>
        <UniversalHooksProvider>
          <PortalProvider>
            <PartialProvider>{children}</PartialProvider>
          </PortalProvider>
        </UniversalHooksProvider>
      </EventProxyProvider>
    </ContainerProvider>
  );
