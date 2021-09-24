import { EffectCallback, useEffect, useMemo, useRef } from 'react';
import { EventEmitter } from 'events';
import { useImmediatelyEffect } from '../../utils/effects';
import { useContainer } from '../../components/container';
import { useEventProxy } from '../../components/eventProxy';

/**
 * This hook runs not only the component rendered but also the `setData` callback is done.
 * It's the earliest time to get instance of component's `ref`.
 */
export const useRenderedEffect = (callback: EffectCallback, deps?: Array<any>) => {
  const container = useContainer();
  const eventProxyContext = useEventProxy();
  const cleanupEvents = useMemo(() => new EventEmitter(), []);
  const currentRenderId = container.getRenderId();
  const unmountedRef = useRef(false);

  useImmediatelyEffect(() => {
    eventProxyContext.internalChannels.rendered.filteredOnce(
      renderId => renderId === Number(currentRenderId),
      () => {
        // run all existing clean-up functions
        cleanupEvents.emit('cleanup');
        // then run the new effect
        const cleanup = callback();
        if (unmountedRef.current) {
          cleanup?.();
        } else {
          cleanupEvents.once('cleanup', () => cleanup?.());
        }
      },
    );
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  // call all clean-up functions when unmount
  useEffect(
    () => () => {
      unmountedRef.current = true;
      cleanupEvents.emit('cleanup');
    },
    [cleanupEvents],
  );
};
