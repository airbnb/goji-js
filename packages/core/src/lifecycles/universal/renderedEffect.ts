import { EffectCallback, useEffect, useMemo, useRef } from 'react';
import { useImmediatelyEffect } from '../../utils/effects';
import { useContainer } from '../../components/container';
import { useEventProxy } from '../../components/eventProxy';
import { EventChannel } from '../../utils/eventChannel';

/**
 * This hook runs not only the component rendered but also the `setData` callback is done.
 * It's the earliest time to get instance of component's `ref`.
 */
export const useRenderedEffect = (callback: EffectCallback, deps?: Array<any>) => {
  const container = useContainer();
  const eventProxyContext = useEventProxy();
  const cleanupEventChannel = useMemo(() => new EventChannel(), []);
  const currentRenderId = container.getRenderId();
  const unmountedRef = useRef(false);

  useImmediatelyEffect(() => {
    eventProxyContext.internalChannels.rendered.filteredOnce(
      renderId => renderId === Number(currentRenderId),
      () => {
        // run all existing clean-up functions
        cleanupEventChannel.emit();
        // then run the new effect
        const cleanup = callback();
        if (unmountedRef.current) {
          cleanup?.();
        } else {
          cleanupEventChannel.once(() => cleanup?.());
        }
      },
    );
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  // call all clean-up functions when unmount
  useEffect(
    () => () => {
      unmountedRef.current = true;
      cleanupEventChannel.emit();
    },
    [cleanupEventChannel],
  );
};
