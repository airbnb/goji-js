import { useMemo } from 'react';
import { EventEmitter } from 'events';
import { useImmediatelyEffect } from '../../utils/effects';
import { useContainer } from '../../components/container';
import { useEventProxy } from '../../components/eventProxy';

export const useRenderedEffect = (callback: () => void, deps?: Array<any>) => {
  const container = useContainer();
  const eventProxyContext = useEventProxy();
  const events = useMemo(() => new EventEmitter(), []);

  useImmediatelyEffect(() => {
    const unsubscribe = eventProxyContext.handleEvent('internalRendered', (renderId: string) =>
      events.emit(renderId),
    );

    return () => {
      unsubscribe();
      events.removeAllListeners();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentRenderId = container.getRenderId();

  useImmediatelyEffect(() => {
    events.once(currentRenderId, callback);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};
