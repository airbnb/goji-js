import React, { PropsWithChildren, ReactNode, ReactPortal, useMemo, Key } from 'react';
import { Portal } from 'react-is';
import { PortalContext } from './context';
import { useContainer } from '../components/container';

export const PortalProvider = ({ children }: PropsWithChildren<{}>) => {
  const container = useContainer();
  const context = useMemo(
    () => ({
      createPortal(element: ReactNode, key?: Key | null): ReactPortal {
        return {
          $$typeof: Portal,
          children: element,
          containerInfo: container,
          key,
        } as any;
      },
    }),
    [container],
  );
  const { Provider } = PortalContext;

  return <Provider value={context}>{children}</Provider>;
};
