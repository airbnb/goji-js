import { createContext, ReactNode, ReactPortal } from 'react';

export interface PortalContextType {
  // from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/f0016483a4b1d1fd6fd636c47eea19e2d1614336/types/react-dom/index.d.ts#L27
  createPortal: (element: ReactNode, key?: null | string | number) => ReactPortal;
}

export const PortalContext = createContext<PortalContextType | undefined>(undefined);
