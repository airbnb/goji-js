import React, { useEffect } from 'react';
import { ScopedUpdater, ScopedUpdaterProps } from '../../components/scopedUpdater';

const getMockMiniappRuntimeComponentInstance = (setState?: (payload: any) => void) => {
  return {
    setData: setState || (() => {}),
  };
};

export const ScopedUpdaterTester: React.FC<
  ScopedUpdaterProps & { gojiId: number; setState?: (payload: any) => void }
> = ({ gojiId, setState, ...props }) => {
  useEffect(() => {
    const mockInstance = getMockMiniappRuntimeComponentInstance(setState);
    // @ts-ignore
    Object.e.scopedUpdaterAttach(gojiId, mockInstance);
    // @ts-ignore
    Object.e.subtreeAttached(gojiId, mockInstance);

    return () => {
      // @ts-ignore
      Object.e.scopedUpdaterDetached(gojiId);
      // @ts-ignore
      Object.e.subtreeDetached(gojiId);
    };
  }, [gojiId, setState]);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ScopedUpdater {...props} />;
};
