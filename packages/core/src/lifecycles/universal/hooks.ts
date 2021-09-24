import { useContext, useRef } from 'react';
import { OnLoadOptions } from '../types';
import { UniversalHooksContext, UniversalHooksContextType } from './context';
import { useImmediatelyEffect } from '../../utils/effects';
import { EventChannel } from '../../utils/eventChannel';

const createUniversalLifecycleHook =
  <T = undefined>(
    channelSelector: (context: UniversalHooksContextType) => EventChannel<any, any>,
  ) =>
  (callback: (data: T) => void, deps?: Array<any>) => {
    const universalHooksContext = useContext(UniversalHooksContext);
    if (!universalHooksContext) {
      throw new Error(
        'Cannot found `universalHooksContext`. This might be an internal error in GojiJS.',
      );
    }

    const callbackRef = useRef<(data: T) => void>(callback);
    // only update callbackRef when deps changed
    useImmediatelyEffect(() => {
      callbackRef.current = callback;
    }, deps);

    useImmediatelyEffect(
      () => channelSelector(universalHooksContext).on(data => callbackRef.current(data)),
      [],
    );
  };

export const useLoadOptions = createUniversalLifecycleHook<OnLoadOptions>(
  _ => _.universalLifecycleChannel.loadOptions,
);
export const useVisibility = createUniversalLifecycleHook<boolean>(
  _ => _.universalLifecycleChannel.visibility,
);
