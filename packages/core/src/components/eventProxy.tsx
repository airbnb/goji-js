import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useImperativeHandle,
  useContext,
} from 'react';
import { EventEmitter } from 'events';
import { batchedUpdates } from '../reconciler';
import { useContainer } from './container';

interface EventProxyContextType {
  handleEvent(name: string, callback: Function): () => void;
}

const EventProxyContext = createContext<EventProxyContextType | undefined>(undefined);
export interface EventProxy {
  emitEvent(name: string, data?: any): any[];
}

/**
 * EventProxyProvider is the gateway to communicate between reconciler container and React elements
 * For example, for native lifecycles:
 * @example
 * onLoad => EventProxyProvider.emitEvent('load') => eventProxyContext.handleEvent('load') => useOnLoad
 */
export const EventProxyProvider = ({ children }: PropsWithChildren<{}>) => {
  const container = useContainer();
  const events = useMemo(() => new EventEmitter(), []);
  const returnValues: Record<string, any[]> = useMemo(() => ({}), []);

  useImperativeHandle(
    container.eventProxyRef,
    () => ({
      emitEvent: (name: string, data?: any) => {
        batchedUpdates(() => {
          events.emit(name, data);
        });

        const retArr = returnValues[name];
        delete returnValues[name];
        return retArr;
      },
    }),
    [events, returnValues],
  );
  const context = useMemo(
    () => ({
      handleEvent: (name: string, callback?: any) => {
        const innerCallback = (...args) => {
          const ret = callback(...args);
          const retArr = returnValues[name] || [];
          retArr.push(ret);
          returnValues[name] = retArr;
        };

        events.on(name, innerCallback);
        return () => {
          events.removeListener(name, innerCallback);
        };
      },
    }),
    [events, returnValues],
  );
  const { Provider } = EventProxyContext;

  return <Provider value={context}>{children}</Provider>;
};

export const useEventProxy = () => {
  const eventProxy = useContext(EventProxyContext);

  if (!eventProxy) {
    throw new Error('Cannot found `eventProxy`. This might be an internal error in GojiJS.');
  }

  return eventProxy;
};
