import React, { useMemo } from 'react';
import { UniversalHooksContext } from './context';
import { OnLoadOptions } from '../types';
import { useImmediatelyEffect } from '../../utils/effects';
import { useEventProxy } from '../../components/eventProxy';
import { CachedEventChannel } from '../../utils/eventChannel';

export const UniversalHooksProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const eventProxyContext = useEventProxy();

  const universalLifecycleChannel = useMemo(
    () => ({
      loadOptions: new CachedEventChannel<OnLoadOptions>(),
      visibility: new CachedEventChannel<boolean>(),
    }),
    [],
  );
  const universalHooksContext = useMemo(
    () => ({
      universalLifecycleChannel,
    }),
    [universalLifecycleChannel],
  );

  // must use `useImmediatelyEffect` instead of `useEffect`
  // useLoadOptions
  useImmediatelyEffect(
    () =>
      eventProxyContext.lifecycleChannel.onLoad.on((options: OnLoadOptions) =>
        universalLifecycleChannel.loadOptions.emit(options),
      ),
    [universalLifecycleChannel, eventProxyContext],
  );

  // useVisibility
  useImmediatelyEffect(
    () =>
      eventProxyContext.lifecycleChannel.onShow.on(() =>
        universalLifecycleChannel.visibility.emit(true),
      ),
    [universalLifecycleChannel, eventProxyContext],
  );
  useImmediatelyEffect(
    () =>
      eventProxyContext.lifecycleChannel.onHide.on(() =>
        universalLifecycleChannel.visibility.emit(false),
      ),
    [universalLifecycleChannel, eventProxyContext],
  );

  const { Provider } = UniversalHooksContext;

  return <Provider value={universalHooksContext}>{children}</Provider>;
};
