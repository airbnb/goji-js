import React, { useCallback, useMemo } from 'react';
import { EventEmitter } from 'events';
import { UniversalHooksContext } from './context';
import { OnLoadOptions, UniversalLifecycleName } from '../types';
import { useImmediatelyEffect } from '../../utils/effects';
import { useEventProxy } from '../../components/eventProxy';

export const UniversalHooksProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const eventProxyContext = useEventProxy();

  // use `useMemo` to cache a singleton value
  const cache = useMemo(() => new Map<UniversalLifecycleName, any>(), []);
  const events = useMemo(() => new EventEmitter(), []);
  const universalHooksContext = useMemo(
    () => ({
      cache,
      events,
    }),
    [cache, events],
  );

  const emit = useCallback(
    (name: UniversalLifecycleName, data: any) => {
      cache.set(name, data);
      events.emit(name, data);
    },
    [cache, events],
  );

  // must use `useImmediatelyEffect` instead of `useEffect`
  // useLoadOptions
  useImmediatelyEffect(
    () =>
      eventProxyContext.lifecycleChannel.onLoad.on((options: OnLoadOptions) =>
        emit('loadOptions', options),
      ),
    [emit, eventProxyContext],
  );

  // useVisibility
  useImmediatelyEffect(
    () => eventProxyContext.lifecycleChannel.onLoad.on(() => emit('visibility', true)),
    [emit, eventProxyContext],
  );
  useImmediatelyEffect(
    () => eventProxyContext.lifecycleChannel.onLoad.on(() => emit('visibility', false)),
    [emit, eventProxyContext],
  );

  const { Provider } = UniversalHooksContext;

  return <Provider value={universalHooksContext}>{children}</Provider>;
};
